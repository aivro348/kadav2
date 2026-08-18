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
    'Location Details / ప్రదేశ వివరాలు',
    'Structure Type / నిర్మాణ రకం',
    'Dimensions & Capacity / కొలతలు & సామర్థ్యం',
    'GPS Location & Photos / GPS & ఫోటోలు'
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

  // High-Accuracy GPS Capture matching Borewell Survey with Accuracy tracking
  const captureGPS = () => {
    setIsCapturingGPS(true);
    if ('geolocation' in navigator) {
      // First try with high accuracy (GPS chip)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setValue('accuracy', position.coords.accuracy);
          setIsCapturingGPS(false);
        },
        (error) => {
          console.warn('High accuracy GPS failed. Trying low accuracy fallback...', error);
          // If high accuracy fails or times out, try low accuracy (Wi-Fi/Cell towers)
          navigator.geolocation.getCurrentPosition(
            (fallbackPosition) => {
              setValue('latitude', fallbackPosition.coords.latitude);
              setValue('longitude', fallbackPosition.coords.longitude);
              setValue('accuracy', fallbackPosition.coords.accuracy);
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

  // Watermark Image Function matching Borewell Survey with Accuracy Level
  const watermarkImage = (file, latitude, longitude, accuracy) => {
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        const textHeight = Math.max(18, height * 0.03);
        ctx.fillRect(0, height - textHeight * 3.5, width, textHeight * 3.5);

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = `${textHeight}px sans-serif`;
        ctx.textAlign = 'left';

        const padding = textHeight * 0.5;
        const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const latText = latitude ? (typeof latitude === 'number' ? latitude.toFixed(5) : latitude) : 'Unknown';
        const lngText = longitude ? (typeof longitude === 'number' ? longitude.toFixed(5) : longitude) : 'Unknown';
        const accText = accuracy ? (typeof accuracy === 'number' ? `${accuracy.toFixed(1)}m` : `${accuracy}m`) : 'N/A';

        ctx.fillText(`Lat: ${latText}, Lng: ${lngText} | Accuracy: ${accText}`, padding, height - textHeight * 1.8);
        ctx.fillText(`Water Conservation / నీటి సంరక్షణ | ${dateStr}`, padding, height - padding);

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
      const acc = getValues('accuracy');

      const newImages = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (lat && lng) {
          const watermarkedUrl = await watermarkImage(file, lat, lng, acc);
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
        <p className="text-emerald-700 font-semibold text-xl mb-1">విజయవంతంగా సమర్పించబడింది!</p>
        <p className="text-slate-500 text-sm">Your water conservation survey has been recorded. / మీ సర్వే విజయవంతంగా నమోదు చేయబడింది.</p>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Water Conservation Survey <span className="text-emerald-700 font-semibold text-lg sm:text-xl block sm:inline sm:ml-2">/ నీటి సంరక్షణ సర్వే</span>
        </h1>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">
              Step / దశ {currentStep + 1} of / లో {steps.length}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-600 font-medium">{steps[currentStep]}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* STEP 1: Location */}
          {currentStep === 0 && (
            <div className="space-y-5 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Location Details <span className="text-emerald-700 font-medium text-base">/ ప్రదేశ వివరాలు</span>
              </h2>
              <div>
                <label className="label-text font-semibold">
                  Mandal <span className="text-slate-600 font-normal">/ మండలం</span>
                </label>
                <select className="input-field" {...register('mandal', { required: true })}>
                  <option value="">Select Mandal / మండలాన్ని ఎంచుకోండి</option>
                  {locationsData.mandals.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text font-semibold">
                  Panchayat <span className="text-slate-600 font-normal">/ పంచాయతీ</span>
                </label>
                <select className="input-field" {...register('panchayat', { required: true })} disabled={!selectedMandal}>
                  <option value="">Select Panchayat / పంచాయతీని ఎంచుకోండి</option>
                  {locationsData.panchayats
                    .filter(p => p.mandal_id === selectedMandal)
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="label-text font-semibold">
                  Village <span className="text-slate-600 font-normal">/ గ్రామం</span>
                </label>
                <select className="input-field" {...register('village', { required: true })} disabled={!selectedPanchayat}>
                  <option value="">Select Village / గ్రామాన్ని ఎంచుకోండి</option>
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
            <div className="space-y-5 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Structure Type <span className="text-emerald-700 font-medium text-base">/ నిర్మాణ రకం</span>
              </h2>
              
              <div className="space-y-3">
                {[
                  { value: 'Check Dam', en: 'Check Dam', te: 'చెక్ డ్యామ్' },
                  { value: 'Percolation Tank', en: 'Percolation Tank', te: 'ఇంకుడు చెరువు (పెర్కోలేషన్ ట్యాంక్)' },
                  { value: 'Farm Pond', en: 'Farm Pond', te: 'పంట కుంట (ఫామ్ పాండ్)' },
                  { value: 'Trench', en: 'Trench', te: 'కందకం (ట్రెంచ్)' }
                ].map((type) => (
                  <label key={type.value} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${structureType === type.value ? 'border-primary-500 bg-primary-50/70 ring-1 ring-primary-400' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="radio"
                      value={type.value}
                      {...register('structureType')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                    />
                    <div className="ml-3">
                      <span className="font-semibold text-slate-900">{type.en}</span>
                      <span className="text-emerald-700 text-sm font-medium ml-2">/ {type.te}</span>
                    </div>
                  </label>
                ))}
              </div>

              {structureType && structureType !== 'Farm Pond' && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in slide-in-from-top-2 fade-in space-y-2">
                  <label className="label-text font-bold text-slate-900">
                    Structure Size or Subtype <span className="text-emerald-700 font-medium text-sm">/ నిర్మాణ పరిమాణం లేదా ఉపరకం</span>
                  </label>
                  
                  {structureType === 'Check Dam' && (
                    <select className="input-field mt-1" {...register('structureSubtype')}>
                      <option value="">Select Subtype / ఉపరకాన్ని ఎంచుకోండి</option>
                      <option value="Big">Big / పెద్దది</option>
                      <option value="Small">Small / చిన్నది</option>
                      <option value="Check Wall">Check Wall / చెక్ వాల్</option>
                    </select>
                  )}
                  
                  {structureType === 'Percolation Tank' && (
                    <select className="input-field mt-1" {...register('structureSubtype')}>
                      <option value="">Select Size / పరిమాణాన్ని ఎంచుకోండి</option>
                      <option value="Big">Big / పెద్దది</option>
                      <option value="Small">Small / చిన్నది</option>
                    </select>
                  )}

                  {structureType === 'Trench' && (
                    <select className="input-field mt-1" {...register('structureSubtype')}>
                      <option value="">Select Trench Type / కందకం రకాన్ని ఎంచుకోండి</option>
                      <option value="Continuous Contour">Continuous Contour / నిరంతర ఆకృతి కందకం (కంటిన్యూయస్ కాంటూర్)</option>
                      <option value="Big">Big / పెద్దది</option>
                      <option value="Small">Small / చిన్నది</option>
                    </select>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Dimensions */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Dimensions & Storage Capacity <span className="text-emerald-700 font-medium text-base">/ కొలతలు & నిల్వ సామర్థ్యం</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text font-semibold">
                    Length (m) <span className="text-slate-600 font-normal">/ పొడవు (మీటర్లు)</span>
                  </label>
                  <input type="number" step="0.01" min="0" className="input-field font-mono" {...register('length')} placeholder="0.00" />
                </div>
                <div>
                  <label className="label-text font-semibold">
                    Breadth (m) <span className="text-slate-600 font-normal">/ వెడల్పు (మీటర్లు)</span>
                  </label>
                  <input type="number" step="0.01" min="0" className="input-field font-mono" {...register('breadth')} placeholder="0.00" />
                </div>
                <div>
                  <label className="label-text font-semibold">
                    Height (m) <span className="text-slate-600 font-normal">/ ఎత్తు (మీటర్లు)</span>
                  </label>
                  <input type="number" step="0.01" min="0" className="input-field font-mono" {...register('height')} placeholder="0.00" />
                </div>
                <div>
                  <label className="label-text font-semibold">
                    Depth (m) <span className="text-slate-600 font-normal">/ లోతు (మీటర్లు)</span>
                  </label>
                  <input type="number" step="0.01" min="0" className="input-field font-mono" {...register('depth')} placeholder="0.00" />
                </div>
              </div>

              <div className="pt-2">
                <label className="label-text font-semibold mb-1 block">
                  Storage Capacity <span className="text-slate-600 font-normal">/ నిల్వ సామర్థ్యం</span>
                </label>
                <div className="flex space-x-3">
                  <input type="number" step="0.01" min="0" className="input-field flex-1 font-mono" {...register('capacity')} placeholder="0.00" />
                  <select className="input-field w-2/5" {...register('capacityUnit')}>
                    <option value="m³">Cubic Metre / ఘనపు మీటర్లు (m³)</option>
                    <option value="MCFT">MCFT</option>
                    <option value="MCF">MCF</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="label-text font-semibold mb-1 block">
                  Number of Fillings in a Year <span className="text-slate-600 font-normal">/ సంవత్సరంలో నీరు నిండే సార్లు (సంఖ్య)</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  How many times does the structure fill in a year? / సంవత్సరంలో ఈ నిర్మాణం ఎన్నిసార్లు నీటితో నిండుతుంది?
                </p>
                <input type="number" min="0" className="input-field max-w-xs font-mono" {...register('fillings')} placeholder="e.g. 5" />
                
                <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-lg mt-3 text-xs text-emerald-900 space-y-1">
                  <p className="font-semibold text-emerald-950">Typical Filling Frequencies / సాధారణ పూరక పౌనఃపున్యం:</p>
                  <p>• Farm Pond / పంట కుంట: <span className="font-semibold">15–20 times/year (సార్లు/సంవత్సరం)</span></p>
                  <p>• Check Dam / చెక్ డ్యామ్: <span className="font-semibold">5–6 times/year (సార్లు/సంవత్సరం)</span></p>
                  <p>• Percolation Tank / ఇంకుడు చెరువు: <span className="font-semibold">8–10 times/year (సార్లు/సంవత్సరం)</span></p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Location & Photos */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  High-Accuracy GPS Location <span className="text-emerald-700 font-medium text-base">/ ఖచ్చితమైన GPS ప్రదేశం</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label-text font-semibold">
                      Latitude <span className="text-slate-600 font-normal">/ అక్షాంశం</span>
                    </label>
                    <input type="number" step="any" className="input-field font-mono" {...register('latitude', { required: true })} readOnly placeholder="0.000000" />
                  </div>
                  <div>
                    <label className="label-text font-semibold">
                      Longitude <span className="text-slate-600 font-normal">/ రేఖాంశం</span>
                    </label>
                    <input type="number" step="any" className="input-field font-mono" {...register('longitude', { required: true })} readOnly placeholder="0.000000" />
                  </div>
                  <div>
                    <label className="label-text font-semibold">
                      GPS Accuracy <span className="text-slate-600 font-normal">/ ఖచ్చితత్వం</span>
                    </label>
                    <input 
                      type="text" 
                      className={`input-field font-mono font-bold ${watch('accuracy') ? 'text-emerald-700 bg-emerald-50/60 border-emerald-300' : 'text-slate-400'}`} 
                      value={watch('accuracy') ? `${Number(watch('accuracy')).toFixed(1)} m (${Number(watch('accuracy')) <= 5 ? 'High / ఎక్కువ' : Number(watch('accuracy')) <= 15 ? 'Moderate / మధ్యస్థం' : 'Approximate / సుమారు'})` : 'Not captured / తీసుకోలేదు'} 
                      readOnly 
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <button
                    type="button"
                    onClick={captureGPS}
                    disabled={isCapturingGPS}
                    className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <MapPin className="mr-2 h-5 w-5 text-primary-500" />
                    {isCapturingGPS ? 'Acquiring Signal... / లొకేషన్ తీస్తోంది...' : 'Capture GPS / GPS స్థానాన్ని తీసుకోండి'}
                  </button>
                  {watch('accuracy') && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${Number(watch('accuracy')) <= 5 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                      Accuracy / ఖచ్చితత్వం: {Number(watch('accuracy')).toFixed(1)}m
                    </span>
                  )}
                </div>
              </div>

              <div className={`transition-opacity duration-300 ${!watch('latitude') ? 'opacity-50 pointer-events-none' : ''}`}>
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  Photographs <span className="text-emerald-700 font-medium text-base">/ ఛాయాచిత్రాలు (ఫోటోలు)</span>
                </h2>
                {!watch('latitude') && (
                  <p className="text-sm text-red-500 mb-4 font-medium">
                    Please capture GPS location first. Your photos will be watermarked with the coordinates and accuracy level.<br/>
                    <span className="text-xs">దయచేసి మొదట GPS స్థానాన్ని తీసుకోండి. మీ ఫోటోలపై అక్షాంశం, రేఖాంశం మరియు ఖచ్చితత్వ స్థాయి ముద్రించబడతాయి.</span>
                  </p>
                )}
                {watch('latitude') && (
                  <p className="text-sm text-emerald-700 mb-4 font-medium">
                    ✓ GPS captured at <span className="font-mono font-bold">{Number(watch('accuracy')).toFixed(1)}m accuracy</span>. Photos will now be automatically watermarked.<br/>
                    <span className="text-xs text-emerald-800 font-normal">GPS స్థానం తీసుకోబడింది. ఫోటోలు తీయవచ్చు.</span>
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50">
                  <div className="space-y-1 text-center w-full">
                    <Camera className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-slate-600 justify-center mt-2 w-full max-w-xs mx-auto">
                      <label htmlFor="camera-capture" className="btn-primary relative cursor-pointer flex-1 bg-primary-600 text-white hover:bg-primary-700 w-full text-center flex items-center justify-center py-3 rounded-lg shadow-sm">
                        <Camera className="mr-2 h-5 w-5" />
                        <span>Live Capture / లైవ్ ఫోటో తీయండి</span>
                        <input id="camera-capture" name="camera-capture" type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Take clear photographs of the structure / నిర్మాణం యొక్క స్పష్టమైన ఫోటోలను తీయండి
                    </p>
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden bg-slate-100 aspect-square border border-slate-200 shadow-sm">
                        <img src={img} alt="Preview" className="object-cover w-full h-full" />
                        <button 
                          type="button"
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full text-xs opacity-85 hover:opacity-100 shadow"
                          title="Remove Photo / ఫోటోను తొలగించండి"
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
              className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg ${currentStep === 0
                  ? 'text-slate-400 cursor-not-allowed bg-slate-100'
                  : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm'
                }`}
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous / మునుపటి
            </button>

            <div className="flex space-x-3">
              <button type="button" className="hidden sm:flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm">
                <Save size={16} className="mr-2" />
                Save Draft / డ్రాఫ్ట్
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center px-5 py-2.5 text-sm font-semibold text-white border border-transparent rounded-lg transition-colors shadow-sm
                    ${!canProceed() ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                  Next / తరువాతి
                  <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!watch('latitude') || images.length === 0}
                  className={`flex items-center px-6 py-2.5 text-sm font-bold text-white border border-transparent rounded-lg shadow-sm transition-colors
                    ${(!watch('latitude') || images.length === 0) ? 'bg-success-300 cursor-not-allowed' : 'bg-success-600 hover:bg-success-700 shadow-success-600/30'}`}
                >
                  Submit / సమర్పించండి
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
