import { useState, useEffect } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Save, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import locationsData from '../data/locations.json';

export default function WaterConservationSurvey() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState([]);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const steps = [
    t('survey.steps.location', 'Location Details'), 
    'Structure Type', 
    'Dimensions & Capacity', 
    t('survey.steps.gps', 'GPS Location')
  ];

  const { register, handleSubmit, watch, setValue, formState: { errors }, getValues } = useHookForm({
    defaultValues: {
      capacityUnit: 'm³'
    }
  });

  const selectedMandal = watch('mandal');
  const selectedPanchayat = watch('panchayat');
  const structureType = watch('structureType');
  const latitude = watch('latitude');

  // Clear dependent location fields
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

  // Clear dependent structure subtype
  useEffect(() => {
    if (structureType) {
      setValue('structureSubtype', '');
    }
  }, [structureType, setValue]);

  // Autosave Draft
  useEffect(() => {
    const interval = setInterval(() => {
      const data = getValues();
      localStorage.setItem('waterSurveyDraft', JSON.stringify(data));
    }, 30000);
    return () => clearInterval(interval);
  }, [getValues]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // High-Accuracy GPS Capture matching Borewell Survey
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

  // Watermark Image Function matching Borewell Survey
  const watermarkImage = (file, latitude, longitude) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Downscale high-resolution mobile photos to max 1280px to save RAM & payload size
        const MAX_DIM = 1280;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Draw watermark background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        const textHeight = Math.max(18, height * 0.03);
        ctx.fillRect(0, height - textHeight * 3, width, textHeight * 3);

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = `${textHeight}px sans-serif`;
        ctx.textAlign = 'left';

        const padding = textHeight * 0.5;
        const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const latText = latitude ? (typeof latitude === 'number' ? latitude.toFixed(5) : latitude) : 'Unknown';
        const lngText = longitude ? (typeof longitude === 'number' ? longitude.toFixed(5) : longitude) : 'Unknown';

        ctx.fillText(`Lat: ${latText}, Lng: ${lngText}`, padding, height - textHeight * 1.5);
        ctx.fillText(`Time: ${dateStr}`, padding, height - padding);

        // Revoke Object URL to free mobile RAM immediately
        URL.revokeObjectURL(img.src);

        // Compress JPEG to 0.7 to reduce payload from ~10MB to ~200KB per photo
        resolve(canvas.toDataURL('image/jpeg', 0.7));
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
    setIsSubmitted(true);

    const villageObj = locationsData.villages.find(v => v.id === data.village);
    const panchayatObj = locationsData.panchayats.find(p => p.id === data.panchayat);
    const mandalObj = locationsData.mandals.find(m => m.id === data.mandal);

    const username = sessionStorage.getItem('rws_username') || 'surveyor';

    const payload = {
      ...data,
      survey_type: 'Water Conservation',
      village: villageObj ? villageObj.name : data.village,
      panchayat: panchayatObj ? panchayatObj.name : data.panchayat,
      mandal: mandalObj ? mandalObj.name : data.mandal,
      created_by: username,
      images: images
    };

    console.log("Submitting survey:", payload);

    // Store in local storage for instant retrieval in surveyor list
    const existing = JSON.parse(localStorage.getItem('water_surveys') || '[]');
    const surveyRecord = { 
      ...payload, 
      id: `WCS-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: Date.now() 
    };
    existing.unshift(surveyRecord);
    localStorage.setItem('water_surveys', JSON.stringify(existing));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${apiUrl}/php-backend/api/surveys.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Survey saved to API successfully:', result);
      }
      localStorage.removeItem('waterSurveyDraft');
    } catch (error) {
      console.warn('Backend API sync notice:', error.message);
    }

    const isSurveyor = location.pathname.startsWith('/surveyor');
    setTimeout(() => {
      if (isSurveyor) {
        navigate('/surveyor/surveys-water-conservation');
      } else {
        navigate('/select-survey');
      }
    }, 2000);
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

  // Next Button Validation Logic
  const canProceed = () => {
    if (currentStep === 0) return watch('mandal') && watch('panchayat') && watch('village');
    if (currentStep === 1) return watch('structureType') && (watch('structureType') === 'Farm Pond' || watch('structureSubtype'));
    if (currentStep === 2) return watch('length') && watch('breadth') && watch('height') && watch('capacity');
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Water Conservation Survey</h1>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">Step {currentStep + 1} of {steps.length}</span>
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
              <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.location_details', 'Location Details')}</h2>
              <div>
                <label className="label-text">{t('survey.mandal', 'Mandal')}</label>
                <select className="input-field" {...register('mandal', { required: true })}>
                  <option value="">{t('survey.select_mandal', 'Select Mandal')}</option>
                  {locationsData.mandals.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">{t('survey.panchayat', 'Panchayat')}</label>
                <select className="input-field" {...register('panchayat', { required: true })} disabled={!selectedMandal}>
                  <option value="">{t('survey.select_panchayat', 'Select Panchayat')}</option>
                  {locationsData.panchayats
                    .filter(p => p.mandal_id === selectedMandal)
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="label-text">{t('survey.village', 'Village')}</label>
                <select className="input-field" {...register('village', { required: true })} disabled={!selectedPanchayat}>
                  <option value="">{t('survey.select_village', 'Select Village')}</option>
                  {locationsData.villages
                    .filter(v => v.panchayat_id === selectedPanchayat)
                    .map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Structure Type */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Structure Type</h2>
              
              <div className="space-y-3">
                {['Check Dam', 'Percolation Tank', 'Farm Pond', 'Trench'].map((type) => (
                  <label key={type} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${structureType === type ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="radio"
                      value={type}
                      {...register('structureType')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                    />
                    <span className="ml-3 font-medium text-slate-700">{type}</span>
                  </label>
                ))}
              </div>

              {structureType && structureType !== 'Farm Pond' && (
                <div className="mt-6 animate-in slide-in-from-top-2 fade-in">
                  <label className="label-text">Structure Size / Subtype</label>
                  
                  {structureType === 'Check Dam' && (
                    <select className="input-field mt-1" {...register('structureSubtype')}>
                      <option value="">Select Subtype</option>
                      <option value="Big">Big</option>
                      <option value="Small">Small</option>
                      <option value="Check Wall">Check Wall</option>
                    </select>
                  )}
                  
                  {structureType === 'Percolation Tank' && (
                    <select className="input-field mt-1" {...register('structureSubtype')}>
                      <option value="">Select Size</option>
                      <option value="Big">Big</option>
                      <option value="Small">Small</option>
                    </select>
                  )}

                  {structureType === 'Trench' && (
                    <select className="input-field mt-1" {...register('structureSubtype')}>
                      <option value="">Select Trench Type</option>
                      <option value="Continuous Contour">Continuous Contour</option>
                      <option value="Big">Big</option>
                      <option value="Small">Small</option>
                    </select>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Dimensions */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Dimensions & Capacity</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Length (m)</label>
                  <input type="number" step="0.01" min="0" className="input-field" {...register('length')} placeholder="0.00" />
                </div>
                <div>
                  <label className="label-text">Breadth (m)</label>
                  <input type="number" step="0.01" min="0" className="input-field" {...register('breadth')} placeholder="0.00" />
                </div>
                <div>
                  <label className="label-text">Height (m)</label>
                  <input type="number" step="0.01" min="0" className="input-field" {...register('height')} placeholder="0.00" />
                </div>
                <div>
                  <label className="label-text">Depth (m)</label>
                  <input type="number" step="0.01" min="0" className="input-field" {...register('depth')} placeholder="0.00" />
                </div>
              </div>

              <div className="mt-6">
                <label className="label-text mb-2 block">Storage Capacity</label>
                <div className="flex space-x-4">
                  <input type="number" step="0.01" min="0" className="input-field flex-1" {...register('capacity')} placeholder="0.00" />
                  <select className="input-field w-1/3" {...register('capacityUnit')}>
                    <option value="m³">m³</option>
                    <option value="MCFT">MCFT</option>
                    <option value="MCF">MCF</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="label-text">Number of Fillings per Year</label>
                <input type="number" min="0" className="input-field max-w-xs mt-1" {...register('fillings')} placeholder="e.g. 5" />
              </div>
            </div>
          )}

          {/* STEP 4: Location & Photos */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-lg font-medium text-slate-900 mb-4">{t('survey.gps_location', 'High-Accuracy GPS Location')}</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="label-text">{t('survey.latitude', 'Latitude')}</label>
                    <input type="number" step="any" className="input-field" {...register('latitude', { required: true })} readOnly />
                  </div>
                  <div className="flex-1">
                    <label className="label-text">{t('survey.longitude', 'Longitude')}</label>
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
                  {isCapturingGPS ? t('survey.capturing', 'Capturing GPS...') : t('survey.capture_gps', 'Capture GPS')}
                </button>
              </div>

              <div className={`transition-opacity duration-300 ${!watch('latitude') ? 'opacity-50 pointer-events-none' : ''}`}>
                <h2 className="text-lg font-medium text-slate-900 mb-2">{t('survey.image_capture', 'Photographs')}</h2>
                {!watch('latitude') && (
                  <p className="text-sm text-red-500 mb-4 font-medium">Please capture GPS location first. Your photos will be watermarked with the coordinates.</p>
                )}
                {watch('latitude') && (
                  <p className="text-sm text-green-600 mb-4 font-medium">GPS captured! Photos will now be automatically watermarked.</p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md bg-slate-50">
                  <div className="space-y-1 text-center w-full">
                    <Camera className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-slate-600 justify-center mt-2 w-full max-w-xs mx-auto">
                      <label htmlFor="camera-capture" className="btn-primary relative cursor-pointer flex-1 bg-primary-600 text-white hover:bg-primary-700 w-full text-center flex items-center justify-center py-3 rounded-md">
                        <Camera className="mr-2 h-5 w-5" />
                        <span>Live Capture</span>
                        <input id="camera-capture" name="camera-capture" type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{t('survey.image_hint', 'Take clear photographs of the structure')}</p>
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-md overflow-hidden bg-slate-100 aspect-square border border-slate-200">
                        <img src={img} alt="Preview" className="object-cover w-full h-full" />
                        <button 
                          type="button"
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-80 hover:opacity-100"
                        >
                          ✕
                        </button>
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
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentStep === 0
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                }`}
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('survey.previous', 'Previous')}
            </button>

            <div className="flex space-x-3">
              <button type="button" className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                <Save size={16} className="mr-2" />
                {t('survey.save_draft', 'Save Draft')}
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md transition-colors
                    ${!canProceed() ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                  {t('survey.next', 'Next')}
                  <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!watch('latitude') || images.length === 0}
                  className={`flex items-center px-6 py-2 text-sm font-bold text-white border border-transparent rounded-md shadow-sm transition-colors
                    ${(!watch('latitude') || images.length === 0) ? 'bg-success-300 cursor-not-allowed' : 'bg-success-600 hover:bg-success-700'}`}
                >
                  {t('survey.submit', 'Submit')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
