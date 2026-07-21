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

  const surveyTitle = surveyType === 'hnss' ? 'HNSS Survey' : 'Palar River Survey';
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Get Main GPS
  const getLocation = () => {
    setGpsError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = position.coords.accuracy;
          if (accuracy > 5) {
            setGpsError(`GPS accuracy is ${Math.round(accuracy)}m. It must be less than 5m. Please move to a clear area and recapture.`);
            setLocation({ lat: null, lng: null, accuracy });
          } else {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: accuracy
            });
          }
        },
        (error) => {
          setGpsError("Could not access GPS. Please ensure location services are enabled.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsError("Geolocation is not supported by this browser.");
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
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Draw watermark background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        const textHeight = Math.max(20, img.height * 0.025);
        ctx.fillRect(0, img.height - textHeight * 3, img.width, textHeight * 3);
        
        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = `${textHeight}px sans-serif`;
        ctx.textAlign = 'left';
        
        const padding = textHeight * 0.5;
        const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        
        // If GPS isn't captured yet, show a fallback
        const latText = latitude ? latitude.toFixed(5) : 'Unknown';
        const lngText = longitude ? longitude.toFixed(5) : 'Unknown';
        
        ctx.fillText(`Lat: ${latText}, Lng: ${lngText}`, padding, img.height - textHeight * 1.5);
        ctx.fillText(`Time: ${dateStr}`, padding, img.height - padding);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
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
    if (!location.lat || location.accuracy > 5) {
      setError("Main location must be captured with < 5m accuracy before submitting.");
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
      
      const result = await response.json();
      if (result.success) {
        navigate('/surveyor/surveys');
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (err) {
      setError(err.message);
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
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
          <AlertTriangle className="text-red-500 mr-3 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
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
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg border border-slate-300 transition-colors flex justify-center items-center"
              >
                <MapPin className="mr-2 text-primary-600" size={20} />
                {location.lat ? 'Recapture Location' : 'Capture Main Location'}
              </button>
            </div>
            
            <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-200 w-full">
              {location.lat && location.accuracy <= 5 ? (
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
                  ) : 'Waiting for high-accuracy GPS (< 5m)'}
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
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-6">Directional Photographs</h2>
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
            disabled={loading || !location.lat || location.accuracy > 5}
            className={`flex items-center px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading || !location.lat || location.accuracy > 5 
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
