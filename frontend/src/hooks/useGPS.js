import { useState } from 'react';

export default function useGPS(onSuccess, onError) {
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);

  const captureGPS = () => {
    setIsCapturingGPS(true);

    if ('geolocation' in navigator) {
      // First try with high accuracy (GPS chip)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position.coords.accuracy > 5) {
            alert(`GPS accuracy is too low (${Math.round(position.coords.accuracy)} meters). We require less than 5 meters. Please step outside into an open area with a clear view of the sky and try again.`);
            setIsCapturingGPS(false);
            if (onError) onError("Accuracy too low");
            return;
          }
          onSuccess(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
          setIsCapturingGPS(false);
        },
        (error) => {
          console.warn('High accuracy GPS failed. Trying low accuracy fallback...', error);
          // If high accuracy fails or times out, try low accuracy fallback
          navigator.geolocation.getCurrentPosition(
            (fallbackPosition) => {
              if (fallbackPosition.coords.accuracy > 5) {
                alert(`GPS accuracy is too low (${Math.round(fallbackPosition.coords.accuracy)} meters). We require less than 5 meters. Please step outside into an open area with a clear view of the sky and try again.`);
                setIsCapturingGPS(false);
                if (onError) onError("Accuracy too low");
                return;
              }
              onSuccess(fallbackPosition.coords.latitude, fallbackPosition.coords.longitude, fallbackPosition.coords.accuracy);
              setIsCapturingGPS(false);
            },
            (fallbackError) => {
              alert('Error capturing GPS. Please ensure Location services are turned on for your device.');
              setIsCapturingGPS(false);
              if (onError) onError(fallbackError);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 2500, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsCapturingGPS(false);
      if (onError) onError("Geolocation not supported");
    }
  };

  return { captureGPS, isCapturingGPS };
}
