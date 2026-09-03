// High-Definition 3D Broadcast Player Texture Preprocessor & Cache
// Performs real-time chroma-key background removal on the photorealistic 3D character renders

import backViewImg from '../assets/images/player_3d_back_view_1788446500023.jpg';
import frontViewImg from '../assets/images/player_3d_front_view_1788446512232.jpg';
import sideViewImg from '../assets/images/player_3d_side_view_1788446536140.jpg';
import stadiumBgImg from '../assets/images/stadium_broadcast_3d_1788446483602.jpg';

export { stadiumBgImg, backViewImg, frontViewImg, sideViewImg };

const processedCache = new Map<string, string>();

/**
 * Removes chroma green background from the 3D render with edge despill
 * Returns a high-res transparent PNG data URL
 */
export function getTransparent3DPlayerImage(rawSrc: string): Promise<string> {
  if (processedCache.has(rawSrc)) {
    return Promise.resolve(processedCache.get(rawSrc)!);
  }

  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(rawSrc);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 800;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(rawSrc);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Sample top-left corner chroma green
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Determine distance to background green
          const isGreenDominant = g > 85 && g > r * 1.15 && g > b * 1.15;
          const isCornerMatch = Math.abs(r - bgR) < 40 && Math.abs(g - bgG) < 40 && Math.abs(b - bgB) < 40;

          if (isGreenDominant || isCornerMatch) {
            data[i + 3] = 0; // completely transparent
          } else if (g > 95 && g > (r + b) * 0.65) {
            // Despill green fringe around player edges
            const maxRB = Math.max(r, b);
            data[i + 1] = maxRB;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultUrl = canvas.toDataURL('image/png');
        processedCache.set(rawSrc, resultUrl);
        resolve(resultUrl);
      } catch (err) {
        console.warn('Chroma key processing fallback:', err);
        resolve(rawSrc);
      }
    };
    img.onerror = () => {
      resolve(rawSrc);
    };
    img.src = rawSrc;
  });
}
