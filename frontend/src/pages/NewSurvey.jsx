import { useState, useEffect } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Save, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import locationsData from '../data/locations.json';

export default function NewSurvey() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState([]);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const steps = [
    t('survey.steps.location'), t('survey.steps.status'), t('survey.steps.type'), t('survey.steps.supply_nature'), 
    t('survey.steps.details'), t('survey.steps.water_quality'), t('survey.steps.history'), t('survey.steps.utilization'), 
    t('survey.steps.gps'), t('survey.steps.images')
  ];

  const { register, handleSubmit, watch, setValue, formState: { errors }, getValues } = useHookForm({
    defaultValues: {
      status: 'Successful',
      dried: 'No'
    }
  });

  const driedStatus = watch('dried');
  const borewellStatus = watch('status');
  const selectedMandal = watch('mandal');
  const selectedPanchayat = watch('panchayat');

  // Clear dependent fields when parent changes
  useEffect(() => {
    if (selectedMandal) {
      setValue('panchayat', '');
      setValue('village', '');
    }
  }, [selectedMandal, setValue]);

  useEffect(() => {
    if (selectedPanchayat) {
      setValue('village', '');
    }
  }, [selectedPanchayat, setValue]);

  // Autosave Draft
  useEffect(() => {
    const interval = setInterval(() => {
      const data = getValues();
      localStorage.setItem('surveyDraft', JSON.stringify(data));
    }, 30000);
    return () => clearInterval(interval);
  }, [getValues]);

  const handleNext = async () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const captureGPS = () => {
    setIsCapturingGPS(true);
    if ('geolocation' in navigator) {
      // First try with high accuracy (GPS chip)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setIsCapturingGPS(false);
        },
        (error) => {
          console.warn('High accuracy GPS failed. Trying low accuracy fallback...', error);
          // If high accuracy fails or times out, try low accuracy (Wi-Fi/Cell towers)
          navigator.geolocation.getCurrentPosition(
            (fallbackPosition) => {
              setValue('latitude', fallbackPosition.coords.latitude);
              setValue('longitude', fallbackPosition.coords.longitude);
              setIsCapturingGPS(false);
            },
            (fallbackError) => {
              alert('Error capturing GPS. Please ensure Location services are turned on for your device.');
              setIsCapturingGPS(false);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 2500, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsCapturingGPS(false);
    }
  };

  const watermarkImage = (file, latitude, longitude) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Draw watermark background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        const textHeight = Math.max(40, img.height * 0.05); // dynamic height based on image size
        ctx.fillRect(0, img.height - textHeight * 2.5, img.width, textHeight * 2.5);
        
        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = `${textHeight}px sans-serif`;
        ctx.textAlign = 'left';
        
        const padding = textHeight * 0.5;
        const dateStr = new Date().toLocaleString();
        
        ctx.fillText(`Lat: ${latitude}, Lng: ${longitude}`, padding, img.height - textHeight * 1.2);
        ctx.fillText(`Date: ${dateStr}`, padding, img.height - padding);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    if (e.target.files) {
      const lat = getValues('latitude');
      const lng = getValues('longitude');
      
      const newImages = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (lat && lng) {
          const watermarkedUrl = await watermarkImage(file, lat, lng);
          newImages.push(watermarkedUrl);
        } else {
          // Fallback if no GPS
          newImages.push(URL.createObjectURL(file));
        }
      }
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const onSubmit = async (data) => {
    console.log("Submitting survey:", data, images);
    
    setIsSubmitted(true); // Show animation early

    // Prepare payload for PHP API
    // Ensure arrays are converted to strings for the database
    
    // Map IDs to full exact names
    const villageObj = locationsData.villages.find(v => v.id === data.village);
    const panchayatObj = locationsData.panchayats.find(p => p.id === data.panchayat);
    const mandalObj = locationsData.mandals.find(m => m.id === data.mandal);
    
    // Get logged in user
    const username = localStorage.getItem('rws_username') || 'surveyor';

    const payload = {
      ...data,
      village: villageObj ? villageObj.name : data.village,
      panchayat: panchayatObj ? panchayatObj.name : data.panchayat,
      mandal: mandalObj ? mandalObj.name : data.mandal,
      borewell_type: Array.isArray(data.borewell_type) ? data.borewell_type.join(', ') : data.borewell_type,
      supply_nature: Array.isArray(data.supply_nature) ? data.supply_nature.join(', ') : data.supply_nature,
      crop_category: Array.isArray(data.crop_category) ? data.crop_category.join(', ') : data.crop_category,
      crop_names: (() => {
        let crops = Array.isArray(data.crop_names) ? [...data.crop_names] : (data.crop_names ? [data.crop_names] : []);
        if (crops.includes('others') && data.crop_names_other) {
          // Replace 'others' with the manual input or just append it
          crops = crops.filter(c => c !== 'others');
          crops.push(`Others (${data.crop_names_other})`);
        }
        return crops.join(', ');
      })(),
      created_by: username,
      images: images
    };

    try {
      // Determine API URL (use relative path for Hostinger)
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${apiUrl}/php-backend/api/surveys.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMsg = 'Failed to save survey to database';
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch (e) {
          // ignore JSON parse error
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      console.log('Survey saved successfully:', result);

      localStorage.removeItem('surveyDraft');
      
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('The server is currently very busy. Please wait 1 minute and try clicking Submit again.\n\nTechnical Details: ' + error.message);
      setIsSubmitted(false);
      return;
    }
    
    // Redirect after 2.5 seconds
    
    // Show animation
    setIsSubmitted(true);
    
    // Redirect after 2.5 seconds
    setTimeout(() => {
      navigate('..');
    }, 2500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Submitted Successfully!</h2>
        <p className="text-slate-500 text-lg">Your survey has been recorded.</p>
        <div className="mt-8 flex space-x-2">
          <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('survey.title')}</h1>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">{t('survey.step')} {currentStep + 1} {t('survey.of')} {steps.length}</span>
            <span className="text-sm font-medium text-slate-500">{steps[currentStep]}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* STEP 1: Location */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.location_details')}</h2>
              <div>
                <label className="label-text">{t('survey.mandal')}</label>
                <select className="input-field" {...register('mandal', { required: true })}>
                  <option value="">{t('survey.select_mandal')}</option>
                  {locationsData.mandals.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">{t('survey.panchayat')}</label>
                <select className="input-field" {...register('panchayat', { required: true })} disabled={!selectedMandal}>
                  <option value="">{t('survey.select_panchayat')}</option>
                  {locationsData.panchayats
                    .filter(p => p.mandal_id === selectedMandal)
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">{t('survey.village')}</label>
                <select className="input-field" {...register('village', { required: true })} disabled={!selectedPanchayat}>
                  <option value="">{t('survey.select_village')}</option>
                  {locationsData.villages
                    .filter(v => v.panchayat_id === selectedPanchayat)
                    .map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Status */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.borewell_status')}</h2>
              <div className="space-y-3">
                {[
                  { val: 'Successful', label: t('survey.status_successful') },
                  { val: 'Seasonal / Summer Dry', label: t('survey.status_seasonal') },
                  { val: 'Dried', label: t('survey.status_dried') }
                ].map((status) => (
                  <label key={status.val} className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="radio" 
                      value={status.val} 
                      {...register('status')} 
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                    />
                    <span className="ml-3 font-medium text-slate-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Type */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.borewell_type')}</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" value="Agriculture / Horticulture" {...register('borewell_type')} className="h-4 w-4 text-primary-600 rounded" />
                  <span className="ml-3 font-medium text-slate-700">{t('survey.type_agri')}</span>
                </label>
                <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" value="Livestock / Animals" {...register('borewell_type')} className="h-4 w-4 text-primary-600 rounded" />
                  <span className="ml-3 font-medium text-slate-700">{t('survey.type_livestock')}</span>
                </label>
                <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" value="Drinking water / domestic" {...register('borewell_type')} className="h-4 w-4 text-primary-600 rounded" />
                  <span className="ml-3 font-medium text-slate-700">{t('survey.type_drinking')}</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Supply Nature */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.steps.supply_nature')}</h2>
              <div>
                <label className="label-text mb-3 block">{t('survey.supply_nature_label')}</label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" value="Linked to tank" {...register('supply_nature')} className="h-4 w-4 text-primary-600 rounded" />
                    <span className="ml-3 font-medium text-slate-700">{t('survey.supply_tank')}</span>
                  </label>
                  <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" value="Linked to Sump" {...register('supply_nature')} className="h-4 w-4 text-primary-600 rounded" />
                    <span className="ml-3 font-medium text-slate-700">{t('survey.supply_sump')}</span>
                  </label>
                  <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" value="Direct Pumping" {...register('supply_nature')} className="h-4 w-4 text-primary-600 rounded" />
                    <span className="ml-3 font-medium text-slate-700">{t('survey.supply_direct')}</span>
                  </label>
                  <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" value="Drip irrigation" {...register('supply_nature')} className="h-4 w-4 text-primary-600 rounded" />
                    <span className="ml-3 font-medium text-slate-700">{t('survey.supply_drip')}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Details */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.borewell_details')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">{t('survey.depth')}</label>
                  <input type="number" step="0.1" className="input-field" {...register('borewell_depth')} />
                </div>
                <div>
                  <label className="label-text">{t('survey.motor_capacity')}</label>
                  <select className="input-field" {...register('motor_capacity')}>
                    <option value="">{t('survey.select_capacity')}</option>
                    <option value="7.5">7.5</option>
                    <option value="10">10</option>
                    <option value="12.5">12.5</option>
                    <option value="15">15</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">{t('survey.motor_depth')}</label>
                  <input type="number" step="0.1" className="input-field" {...register('motor_depth')} />
                </div>
                <div>
                  <label className="label-text">{t('survey.delivery_pipe')}</label>
                  <select className="input-field" {...register('delivery_pipe')}>
                    <option value="">{t('survey.select_pipe')}</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">{t('survey.water_level_fixing')}</label>
                  <input type="number" step="0.1" className="input-field" {...register('water_level_fixing')} />
                </div>
                <div>
                  <label className="label-text">{t('survey.water_struck_depth')}</label>
                  <input type="number" step="0.1" className="input-field" {...register('water_struck_depth')} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Water Quality */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.water_quality_params')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label-text">{t('survey.tds')}</label>
                  <input type="number" step="0.1" className="input-field" {...register('tds')} />
                </div>
                <div>
                  <label className="label-text">{t('survey.ph')}</label>
                  <input type="number" step="0.1" className="input-field" {...register('ph')} />
                </div>
                <div>
                  <label className="label-text">{t('survey.hardness')}</label>
                  <input type="number" step="0.1" className="input-field" {...register('hardness')} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: History */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.history')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">{t('survey.drilled_year')}</label>
                  <input type="text" maxLength="4" pattern="\d{4}" className="input-field" {...register('drilled_year')} onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); }} />
                </div>
                <div>
                  <label className="label-text">{t('survey.dried_year')}</label>
                  <input type="text" maxLength="4" pattern="\d{4}" className="input-field" {...register('dried_year')} onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); }} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text text-slate-700">{t('survey.dried_months')}</label>
                  <input type="text" placeholder={t('survey.dried_placeholder')} className="input-field" {...register('dried_months')} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Utilization */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.utilization')}</h2>
              <div>
                <label className="label-text">{t('survey.crop_category')}</label>
                <div className="flex space-x-4 mt-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="Agriculture" {...register('crop_category')} className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded" />
                    <span className="ml-2 text-slate-700">Agriculture</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="Horticulture" {...register('crop_category')} className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded" />
                    <span className="ml-2 text-slate-700">Horticulture</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label-text mb-3 block">{t('survey.crop_names')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Paddy', 'maize', 'grasses', 'millets', 'groundnuts', 'vegetables', 'fruits', 'flowers', 'mango', 'coconut', 'mulberry', 'no crop', 'others'].map(crop => (
                    <label key={crop} className="inline-flex items-center cursor-pointer hover:bg-slate-50 p-2 border border-slate-200 rounded-md">
                      <input type="checkbox" value={crop} {...register('crop_names')} className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-slate-300" />
                      <span className="ml-2 text-sm text-slate-700 capitalize">{crop}</span>
                    </label>
                  ))}
                </div>
                {watch('crop_names') && Array.isArray(watch('crop_names')) && watch('crop_names').includes('others') && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                    <label className="label-text text-sm text-slate-500">Please specify 'others':</label>
                    <input type="text" placeholder="Enter crop name manually" className="input-field mt-1" {...register('crop_names_other')} />
                  </div>
                )}
              </div>
              <div>
                <label className="label-text">{t('survey.dependent_families')}</label>
                <input type="number" className="input-field max-w-xs" {...register('dependent_families')} />
              </div>
              <div>
                <label className="label-text">{t('survey.dependent_animals')}</label>
                <input type="number" className="input-field max-w-xs" {...register('dependent_animals')} />
              </div>
              <div>
                <label className="label-text">{t('survey.agri_land_area')}</label>
                <input type="number" step="0.1" className="input-field max-w-xs" {...register('agri_land_area')} />
              </div>
            </div>
          )}

          {/* STEP 9: Location & Photos */}
          {currentStep === 8 && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.gps_location')}</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="label-text">{t('survey.latitude')}</label>
                    <input type="number" step="any" className="input-field" {...register('latitude', { required: true })} readOnly />
                  </div>
                  <div className="flex-1">
                    <label className="label-text">{t('survey.longitude')}</label>
                    <input type="number" step="any" className="input-field" {...register('longitude', { required: true })} readOnly />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={captureGPS}
                  disabled={isCapturingGPS}
                  className="mt-4 flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  <MapPin className="mr-2 h-5 w-5 text-primary-500" />
                  {isCapturingGPS ? t('survey.capturing') : t('survey.capture_gps')}
                </button>
              </div>

              <div className={`transition-opacity duration-300 ${!watch('latitude') ? 'opacity-50 pointer-events-none' : ''}`}>
                <h2 className="text-lg font-medium text-slate-900 mb-2">{t('survey.image_capture')}</h2>
                {!watch('latitude') && (
                  <p className="text-sm text-red-500 mb-4 font-medium">Please capture GPS location first. Your photos will be watermarked with the coordinates.</p>
                )}
                {watch('latitude') && (
                  <p className="text-sm text-green-600 mb-4 font-medium">GPS captured! Photos will now be automatically watermarked.</p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md bg-slate-50">
                  <div className="space-y-1 text-center w-full">
                    <Camera className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-slate-600 justify-center mt-2">
                      <label htmlFor="file-upload" className="btn-secondary relative cursor-pointer flex-1">
                        <span>{t('survey.upload_files')}</span>
                        <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageUpload} />
                      </label>
                      <label htmlFor="camera-capture" className="btn-primary relative cursor-pointer flex-1 bg-primary-600 text-white hover:bg-primary-700">
                        <span>Capture Photo</span>
                        <input id="camera-capture" name="camera-capture" type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{t('survey.image_hint')}</p>
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-md overflow-hidden bg-slate-100 aspect-square border border-slate-200">
                        <img src={img} alt="Preview" className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 0 
                  ? 'text-slate-400 cursor-not-allowed' 
                  : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('survey.previous')}
            </button>
            
            <div className="flex space-x-3">
              <button type="button" className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                <Save size={16} className="mr-2" />
                {t('survey.save_draft')}
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                >
                  {t('survey.next')}
                  <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 text-sm font-bold text-white bg-success-600 border border-transparent rounded-md hover:bg-success-700 shadow-sm"
                >
                  {t('survey.submit')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
