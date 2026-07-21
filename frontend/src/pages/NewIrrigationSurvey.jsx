import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Save, Plus, X, AlertTriangle, Compass } from 'lucide-react';

export default function NewIrrigationSurvey({ surveyType }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  // Core Fields
  const [totalLength, setTotalLength] = useState('');
  const [totalWidth, setTotalWidth] = useState('');

  // Main GPS Location
  const [location, setLocation] = useState({ lat: null, lng: null, accuracy: null });

  // Main Directional Photos
  const [photos, setPhotos] = useState({
    east: null,
    west: null,
    north: null,
    south: null
  });

  // Dynamic Polygon Points
  const [points, setPoints] = useState([
    { id: 1, point_value: '' },
    { id: 2, point_value: '' },
    { id: 3, point_value: '' },
    { id: 4, point_value: '' },
    { id: 5, point_value: '' },
    { id: 6, point_value: '' },
    { id: 7, point_value: '' }
  ]);

  const fileInputRef = useRef(null);
  const [activePhotoSlot, setActivePhotoSlot] = useState(null);
  const [activePointId, setActivePointId] = useState(null);

  const [isCapturingGPS, setIsCapturingGPS] = useState(false);

  const surveyTitle = surveyType === 'hnss' ? 'HNSS Survey' : 'Palar River Survey';
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Get Main GPS
  const getLocation = () => {
    setGpsError(null);
    setIsCapturingGPS(true);

    if ('geolocation' in navigator) {
      // Step 1: Try high-accuracy GPS first
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setIsCapturingGPS(false);
        },
        (error) => {
          console.warn('High accuracy GPS failed or timed out. Attempting network fallback...', error);
          // Step 2: Low-accuracy fallback (Wi-Fi/Cell towers) if high accuracy fails or times out
          navigator.geolocation.getCurrentPosition(
            (fallbackPosition) => {
              setLocation({
                lat: fallbackPosition.coords.latitude,
                lng: fallbackPosition.coords.longitude,
                accuracy: fallbackPosition.coords.accuracy
              });
              setIsCapturingGPS(false);
            },
            (fallbackError) => {
              setGpsError("Could not access GPS. Please ensure Location Services and GPS permissions are enabled on your device.");
              setIsCapturingGPS(false);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
      );
    } else {
      setGpsError("Geolocation is not supported by your browser.");
      setIsCapturingGPS(false);
    }
  };

  // Handle Photo Capture (Directional)
  const handlePhotoCapture = (slot, pointId = null) => {
    setActivePhotoSlot(slot);
    setActivePointId(pointId);
    fileInputRef.current.click();
  };

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use location if available
    const lat = location.lat;
    const lng = location.lng;
    
    // Apply Watermark
    const base64String = await watermarkImage(file, lat, lng);
    
    if (activePointId) {
      setPoints(points.map(p => {
        if (p.id === activePointId) {
          return { ...p, photo: base64String };
        }
        return p;
      }));
    } else if (activePhotoSlot) {
      setPhotos({ ...photos, [activePhotoSlot]: base64String });
    }
  };

  const addPoint = () => {
    setPoints([...points, { id: Date.now(), point_value: '' }]);
  };

  const removePoint = (id) => {
    setPoints(points.filter(p => p.id !== id));
  };

  const handlePointValueChange = (id, value) => {
    setPoints(points.map(p => {
      if (p.id === id) return { ...p, point_value: value };
      return p;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat) {
      setError("Please capture your Main Location before submitting.");
      return;
    }
    
    setLoading(true);
    setError(null);

    const payload = {
      surveyor_id: sessionStorage.getItem('rws_username') || 'unknown',
      total_length: totalLength,
      total_width: totalWidth,
      gps_lat: location.lat,
      gps_lng: location.lng,
      gps_accuracy: location.accuracy,
      photo_east: photos.east,
      photo_west: photos.west,
      photo_north: photos.north,
      photo_south: photos.south,
      points: points.map(p => ({
        point_value: p.point_value
      }))
    };

    try {
      const response = await fetch(`${apiUrl}/php-backend/api/irrigation.php?type=${surveyType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Server returned non-JSON response:', responseText);
        throw new Error('Server returned an unexpected error format. Please verify server setup or try again.');
      }

      if (response.ok && result.success) {
        // Redirect to appropriate survey list based on role
        const targetPath = `${basePath}/surveys-${surveyType}`;
        navigate(targetPath);
      } else {
        throw new Error(result.error || "Submission failed. Please check your data and click Submit to retry.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  const DirectionPhoto = ({ direction, label }) => (
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium text-slate-700 mb-2 flex items-center"><Compass size={16} className="mr-1"/> {label}</p>
      {photos[direction] ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary-500">
          <img src={photos[direction]} alt={direction} className="w-full h-full object-cover" />
          <button 
            type="button" 
            onClick={() => setPhotos({...photos, [direction]: null})}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => handlePhotoCapture(direction)}
          className="w-32 h-32 flex flex-col items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-200 hover:border-primary-400 transition-colors"
        >
          <Camera className="text-slate-400 mb-2" size={24} />
          <span className="text-xs text-slate-500 font-medium">Capture {label}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New {surveyTitle}</h1>
        <p className="text-slate-500">Record a new geographic structure survey</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-red-800">Submission Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setError(null)}
            className="self-end sm:self-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-semibold transition-colors flex-shrink-0"
          >
            Dismiss & Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Info */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4">Dimensions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Length (meters)</label>
              <input type="number" step="0.01" required value={totalLength} onChange={e => setTotalLength(e.target.value)} className="input-field" placeholder="e.g. 1500.50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Width (meters)</label>
              <input type="number" step="0.01" required value={totalWidth} onChange={e => setTotalWidth(e.target.value)} className="input-field" placeholder="e.g. 25.00" />
            </div>
          </div>
        </div>

        {/* Main Location */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4 flex items-center">
            <MapPin className="mr-2 text-primary-600" /> Main Geographic Tag
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <button 
                type="button" 
                onClick={getLocation}
                disabled={isCapturingGPS}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg border border-slate-300 transition-colors flex justify-center items-center disabled:opacity-50"
              >
                <MapPin className="mr-2 text-primary-600" size={20} />
                {isCapturingGPS ? 'Capturing GPS Location...' : location.lat ? 'Recapture Location' : 'Capture Main Location'}
              </button>
            </div>
            
            <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-200 w-full">
              {location.lat ? (
                <div>
                  <p className="text-sm font-semibold text-emerald-600 mb-1 flex items-center">
                    ✓ Valid GPS Lock (Accuracy: {Math.round(location.accuracy)}m)
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Lat: {location.lat.toFixed(6)}<br/>Lng: {location.lng.toFixed(6)}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">
                  {gpsError ? (
                    <span className="text-red-500 flex flex-col gap-2">
                      <AlertTriangle size={16}/> {gpsError}
                    </span>
                  ) : 'Click "Capture Main Location" to fetch GPS coordinates.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Polygon Points */}
        <div className="card bg-primary-50/30 border-primary-100">
          <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Polygon Reference Diagram</h3>
            <p className="text-xs text-slate-500 mb-3">Please map the points exactly as shown in the reference sketch.</p>
            <div className="aspect-video max-w-sm mx-auto bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
              <img src="/polygon-reference.jpg" alt="Polygon Reference" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-primary-200 pb-3 mb-4">
            <h2 className="text-lg font-semibold text-primary-900">Survey Polygon Points</h2>
            <button type="button" onClick={addPoint} className="text-primary-700 hover:bg-primary-100 px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors">
              <Plus size={16} className="mr-1"/> Add Point
            </button>
          </div>
          
          <div className="space-y-6">
            {points.map((point, index) => (
              <div key={point.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                {points.length > 1 && (
                  <button type="button" onClick={() => removePoint(point.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                )}
                
                <h3 className="font-bold text-slate-700 mb-4">Point #{index + 1}</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Point Value */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Point Value / Description</label>
                    <input 
                      type="text" 
                      required 
                      value={point.point_value} 
                      onChange={e => handlePointValueChange(point.id, e.target.value)} 
                      className="input-field" 
                      placeholder="e.g. Edge point measurement" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Directional Photos */}
        <div className={`card transition-opacity duration-300 ${!location.lat ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4 flex items-center">
            <Camera className="mr-2 text-primary-500" size={20} /> Directional Photographs
          </h2>
          
          {!location.lat && (
            <p className="text-sm text-red-500 mb-6 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertTriangle className="inline mr-2" size={16} /> 
              Please capture your Main Geographic Tag (GPS) above first. Your photos will be automatically watermarked with these coordinates.
            </p>
          )}
          {location.lat && (
            <p className="text-sm text-emerald-600 mb-6 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              ✓ GPS captured! Directional photos will now be automatically watermarked.
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            <DirectionPhoto direction="north" label="Facing North" />
            <DirectionPhoto direction="east" label="Facing East" />
            <DirectionPhoto direction="south" label="Facing South" />
            <DirectionPhoto direction="west" label="Facing West" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading || !location.lat}
            className={`flex items-center px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading || !location.lat
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Submitting...' : (
              <>
                <Save className="mr-2" size={20} />
                Submit {surveyTitle}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Hidden File Input for Camera */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}
