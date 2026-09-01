// Realistic and stylized avatar face options for tactical board players
export interface FacePreset {
  id: string;
  name: string;
  hairColor: string;
  skinColor: string;
  hairStyle: 'short' | 'curly' | 'fade' | 'long' | 'buzz' | 'ponytail' | 'bald';
  beard?: boolean;
  accessory?: 'headband' | 'glasses';
}

export const FACE_PRESETS: FacePreset[] = [
  { id: 'face-1', name: 'Marco (Capitano)', hairColor: '#1e1b18', skinColor: '#f1c27d', hairStyle: 'fade', beard: true },
  { id: 'face-2', name: 'Alessandro (Regista)', hairColor: '#3c2415', skinColor: '#e0ac69', hairStyle: 'short', beard: false },
  { id: 'face-3', name: 'Federico (Ala Rapida)', hairColor: '#b87333', skinColor: '#ffdbac', hairStyle: 'curly', beard: false },
  { id: 'face-4', name: 'Davide (Centravanti)', hairColor: '#2b1d0c', skinColor: '#c68642', hairStyle: 'short', beard: true },
  { id: 'face-5', name: 'Lorenzo (Trequartista)', hairColor: '#090807', skinColor: '#8d5524', hairStyle: 'fade', beard: false },
  { id: 'face-6', name: 'Gianluigi (Portiere)', hairColor: '#4a3b32', skinColor: '#f1c27d', hairStyle: 'buzz', beard: true },
  { id: 'face-7', name: 'Giorgio (Difensore Roccia)', hairColor: '#1a1a1a', skinColor: '#ffdbac', hairStyle: 'bald', beard: true },
  { id: 'face-8', name: 'Matteo (Terzino Fluidificante)', hairColor: '#d4af37', skinColor: '#ffdbac', hairStyle: 'long', beard: false, accessory: 'headband' },
  { id: 'face-9', name: 'Nicolo (Mezzala Incursore)', hairColor: '#222222', skinColor: '#e0ac69', hairStyle: 'fade', beard: false },
  { id: 'face-10', name: 'Ciro (Bomber)', hairColor: '#2f1e0e', skinColor: '#f1c27d', hairStyle: 'short', beard: true },
  { id: 'face-11', name: 'Leonardo (Difensore Centrale)', hairColor: '#444444', skinColor: '#ffdbac', hairStyle: 'short', beard: true },
  { id: 'face-12', name: 'Giacomo (Esterno Sinistro)', hairColor: '#0a0a0a', skinColor: '#5c3818', hairStyle: 'curly', beard: false },
];

// Helper to render an SVG avatar face data URL or SVG markup
export function generateFaceSvg(preset: FacePreset, size = 64): string {
  const { skinColor, hairColor, hairStyle, beard, accessory } = preset;
  
  let hairPath = '';
  if (hairStyle === 'fade') {
    hairPath = `<path d="M18 24 Q32 10 46 24 Q48 18 32 14 Q16 18 18 24 Z" fill="${hairColor}" />
                <path d="M16 28 Q18 20 22 22 Q19 28 17 32 Z" fill="${hairColor}" opacity="0.6"/>
                <path d="M48 28 Q46 20 42 22 Q45 28 47 32 Z" fill="${hairColor}" opacity="0.6"/>`;
  } else if (hairStyle === 'curly') {
    hairPath = `<circle cx="22" cy="18" r="7" fill="${hairColor}"/>
                <circle cx="32" cy="15" r="8" fill="${hairColor}"/>
                <circle cx="42" cy="18" r="7" fill="${hairColor}"/>
                <circle cx="16" cy="24" r="6" fill="${hairColor}"/>
                <circle cx="48" cy="24" r="6" fill="${hairColor}"/>`;
  } else if (hairStyle === 'buzz') {
    hairPath = `<ellipse cx="32" cy="23" rx="15" ry="11" fill="${hairColor}" opacity="0.8"/>`;
  } else if (hairStyle === 'long' || hairStyle === 'ponytail') {
    hairPath = `<path d="M17 26 Q32 12 47 26 Q50 36 47 44 Q44 26 32 20 Q20 26 17 44 Q14 36 17 26 Z" fill="${hairColor}"/>`;
  } else if (hairStyle === 'bald') {
    hairPath = '';
  } else {
    // short
    hairPath = `<path d="M17 25 C17 14, 47 14, 47 25 C47 20, 32 15, 17 25 Z" fill="${hairColor}"/>`;
  }

  const beardMarkup = beard
    ? `<path d="M22 36 Q32 49 42 36 Q38 46 32 47 Q26 46 22 36 Z" fill="${hairColor}" opacity="0.9"/>
       <path d="M27 38 Q32 40 37 38" stroke="${hairColor}" stroke-width="2" fill="none"/>`
    : '';

  const headbandMarkup = accessory === 'headband'
    ? `<path d="M17 25 Q32 23 47 25" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none"/>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
    <defs>
      <radialGradient id="skinG-${preset.id}" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="${skinColor}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${skinColor}" stop-opacity="0.85"/>
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Base Face -->
    <circle cx="32" cy="32" r="16" fill="url(#skinG-${preset.id})" filter="url(#shadow)"/>
    <!-- Ears -->
    <circle cx="15" cy="33" r="3.5" fill="${skinColor}"/>
    <circle cx="49" cy="33" r="3.5" fill="${skinColor}"/>
    <!-- Eyes -->
    <circle cx="26.5" cy="31" r="2" fill="#1e293b"/>
    <circle cx="37.5" cy="31" r="2" fill="#1e293b"/>
    <circle cx="27" cy="30.5" r="0.6" fill="#ffffff"/>
    <circle cx="38" cy="30.5" r="0.6" fill="#ffffff"/>
    <!-- Eyebrows -->
    <path d="M24 27 Q27 26 29 27" stroke="${hairColor}" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <path d="M35 27 Q37 26 40 27" stroke="${hairColor}" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <!-- Nose -->
    <path d="M32 30 L31 34 L33 34" stroke="#8b5a2b" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.6"/>
    <!-- Mouth -->
    <path d="M28 37 Q32 40 36 37" stroke="#993d3d" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <!-- Hair -->
    ${hairPath}
    <!-- Beard -->
    ${beardMarkup}
    <!-- Accessories -->
    ${headbandMarkup}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
