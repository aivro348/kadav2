export const watermarkImage = (file, latitude, longitude) => {
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
