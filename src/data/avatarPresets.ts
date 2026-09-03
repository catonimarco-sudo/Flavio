// Realistic and stylized avatar face options for tactical board players
export interface FacePreset {
  id: string;
  name: string;
  hairColor: string;
  skinColor: string;
  eyeColor?: string;
  hairStyle: 'fade' | 'buzz' | 'curly' | 'wavy' | 'short' | 'undercut' | 'headband' | 'bald' | 'dreads';
  beardStyle?: 'none' | 'stubble' | 'full' | 'goatee' | 'heavy';
  beardColor?: string;
  accessory?: 'headband' | 'glasses';
}

export const FACE_PRESETS: FacePreset[] = [
  {
    id: 'face-dybala',
    name: 'Paulo (La Joya - Fantasista)',
    hairColor: '#1a1816',
    skinColor: '#f7d0a6',
    eyeColor: '#38bdf8',
    hairStyle: 'fade',
    beardStyle: 'none',
  },
  {
    id: 'face-lukaku',
    name: 'Romelu (Big Rom - Bomber)',
    hairColor: '#0a0a0a',
    skinColor: '#4d2d18',
    eyeColor: '#1e1b18',
    hairStyle: 'buzz',
    beardStyle: 'full',
  },
  {
    id: 'face-pellegrini',
    name: 'Lorenzo (Il Capitano)',
    hairColor: '#3a2719',
    skinColor: '#eec290',
    eyeColor: '#52341b',
    hairStyle: 'fade',
    beardStyle: 'stubble',
  },
  {
    id: 'face-mancini',
    name: 'Gianluca (Difensore Leader)',
    hairColor: '#2b1e15',
    skinColor: '#ebd0b0',
    eyeColor: '#452d1b',
    hairStyle: 'short',
    beardStyle: 'stubble',
  },
  {
    id: 'face-svilar',
    name: 'Mile (Portiere Reattivo)',
    hairColor: '#422c1d',
    skinColor: '#fae0c8',
    eyeColor: '#42687a',
    hairStyle: 'wavy',
    beardStyle: 'stubble',
  },
  {
    id: 'face-cristante',
    name: 'Bryan (Metronomo Fisico)',
    hairColor: '#6e4f32',
    skinColor: '#f7d7be',
    eyeColor: '#365314',
    hairStyle: 'short',
    beardStyle: 'heavy',
  },
  {
    id: 'face-elshaarawy',
    name: 'Stephan (Il Faraone)',
    hairColor: '#0f0e0d',
    skinColor: '#dfad7e',
    eyeColor: '#1e1b18',
    hairStyle: 'undercut',
    beardStyle: 'none',
  },
  {
    id: 'face-calafiori',
    name: 'Riccardo (Centrale Moderno)',
    hairColor: '#3d2b1f',
    skinColor: '#ebd2b7',
    eyeColor: '#5c3a21',
    hairStyle: 'headband',
    beardStyle: 'stubble',
    accessory: 'headband',
  },
  {
    id: 'face-derossi',
    name: 'Daniele (Mister / Condottiero)',
    hairColor: '#5c3826',
    skinColor: '#f5ccaa',
    eyeColor: '#225577',
    hairStyle: 'short',
    beardStyle: 'full',
    beardColor: '#8a3c1c',
  },
  {
    id: 'face-barella',
    name: 'Nicolo (Mezzala Dinamica)',
    hairColor: '#292019',
    skinColor: '#ebc7a2',
    eyeColor: '#423120',
    hairStyle: 'fade',
    beardStyle: 'none',
  },
  {
    id: 'face-dimarco',
    name: 'Federico (Mancino di Spinta)',
    hairColor: '#e0c068',
    skinColor: '#fbe2cb',
    eyeColor: '#3b82f6',
    hairStyle: 'buzz',
    beardStyle: 'stubble',
  },
  {
    id: 'face-ndicka',
    name: 'Evan (Difensore Roccioso)',
    hairColor: '#0c0c0c',
    skinColor: '#3b2213',
    eyeColor: '#18120c',
    hairStyle: 'dreads',
    beardStyle: 'stubble',
  },
  {
    id: 'face-ferguson',
    name: 'Evan (Ferguson - Attaccante)',
    hairColor: '#b48238',
    skinColor: '#fce7d2',
    eyeColor: '#4b5563',
    hairStyle: 'short',
    beardStyle: 'none',
  },
  {
    id: 'face-soule',
    name: 'Matias (Soulé - Talento Mancino)',
    hairColor: '#18181b',
    skinColor: '#f5d5b8',
    eyeColor: '#3b271a',
    hairStyle: 'fade',
    beardStyle: 'none',
  },
  {
    id: 'face-kone',
    name: 'Manu (Koné - Dominatore Fisico)',
    hairColor: '#0a0a0a',
    skinColor: '#3d2516',
    eyeColor: '#18120c',
    hairStyle: 'dreads',
    beardStyle: 'stubble',
  },
  {
    id: 'face-wesley',
    name: 'Wesley (Treno Biondo)',
    hairColor: '#fef08a',
    skinColor: '#452a18',
    eyeColor: '#1c1917',
    hairStyle: 'buzz',
    beardStyle: 'none',
  },
  {
    id: 'face-hermoso',
    name: 'Mario (Hermoso - Centrale di Personalità)',
    hairColor: '#18181b',
    skinColor: '#ebd2b7',
    eyeColor: '#332211',
    hairStyle: 'short',
    beardStyle: 'full',
  },
  {
    id: 'face-rensch',
    name: 'Devyne (Rensch - Terzino Rapido)',
    hairColor: '#18181b',
    skinColor: '#9a6338',
    eyeColor: '#271b12',
    hairStyle: 'fade',
    beardStyle: 'goatee',
  },
  {
    id: 'face-celik',
    name: 'Zeki (Celik - Terzino di Spinta)',
    hairColor: '#18181b',
    skinColor: '#e4be9b',
    eyeColor: '#2b1d14',
    hairStyle: 'short',
    beardStyle: 'stubble',
  },
  {
    id: 'face-gasperini',
    name: 'Gian Piero (Gasperini - Il Mister)',
    hairColor: '#e2e8f0',
    skinColor: '#fae2ce',
    eyeColor: '#38bdf8',
    hairStyle: 'short',
    beardStyle: 'none',
  },
];

/**
 * Generate a high-definition realistic vector face avatar as SVG Data URI
 */
export function generateFaceSvg(preset: FacePreset, size = 64): string {
  const {
    skinColor,
    hairColor,
    hairStyle,
    beardStyle = 'none',
    beardColor = hairColor,
    eyeColor = '#1e293b',
    accessory,
  } = preset;

  const skinShadeDark = adjustColor(skinColor, -25);
  const skinHighlight = adjustColor(skinColor, 20);

  // Realistic Hair rendering
  let hairPath = '';
  if (hairStyle === 'fade') {
    hairPath = `
      <!-- Fade Sides -->
      <path d="M17 26 C17 18, 22 17, 24 26 C22 34, 18 34, 17 26 Z" fill="${hairColor}" opacity="0.4" />
      <path d="M47 26 C47 18, 42 17, 40 26 C42 34, 46 34, 47 26 Z" fill="${hairColor}" opacity="0.4" />
      <!-- Textured Top Volume -->
      <path d="M18 24 C19 11, 45 11, 46 24 C45 18, 38 13, 32 13 C26 13, 19 18, 18 24 Z" fill="${hairColor}" />
      <path d="M21 21 C26 14, 38 13, 43 20 C38 17, 27 16, 21 21 Z" fill="${adjustColor(hairColor, 30)}" opacity="0.5" />
    `;
  } else if (hairStyle === 'buzz') {
    hairPath = `
      <ellipse cx="32" cy="22" rx="15" ry="11" fill="${hairColor}" opacity="0.85" />
      <!-- Hairline edge -->
      <path d="M19 25 Q32 21 45 25 Q32 23 19 25 Z" fill="${adjustColor(hairColor, -20)}" />
    `;
  } else if (hairStyle === 'curly') {
    hairPath = `
      <!-- Curly clustered locks -->
      <circle cx="21" cy="18" r="6" fill="${hairColor}"/>
      <circle cx="32" cy="14" r="7.5" fill="${hairColor}"/>
      <circle cx="43" cy="18" r="6" fill="${hairColor}"/>
      <circle cx="16" cy="24" r="5" fill="${hairColor}"/>
      <circle cx="48" cy="24" r="5" fill="${hairColor}"/>
      <circle cx="26" cy="15" r="6" fill="${adjustColor(hairColor, 20)}"/>
      <circle cx="38" cy="15" r="6" fill="${adjustColor(hairColor, 20)}"/>
    `;
  } else if (hairStyle === 'wavy') {
    hairPath = `
      <!-- Soft wavy modern hair -->
      <path d="M16 26 C15 13, 49 13, 48 26 C46 21, 42 16, 32 15 C22 16, 18 21, 16 26 Z" fill="${hairColor}"/>
      <path d="M20 25 C20 18, 25 18, 29 23 C26 21, 22 21, 20 25 Z" fill="${adjustColor(hairColor, 25)}"/>
      <path d="M44 25 C44 18, 39 18, 35 23 C38 21, 42 21, 44 25 Z" fill="${adjustColor(hairColor, 25)}"/>
    `;
  } else if (hairStyle === 'undercut') {
    hairPath = `
      <!-- Shaved temple -->
      <path d="M17 28 Q18 20 22 22 Q19 28 17 32 Z" fill="${hairColor}" opacity="0.5"/>
      <path d="M47 28 Q46 20 42 22 Q45 28 47 32 Z" fill="${hairColor}" opacity="0.5"/>
      <!-- High Crest -->
      <path d="M22 23 C22 8, 42 8, 42 23 C38 13, 26 13, 22 23 Z" fill="${hairColor}"/>
      <path d="M25 18 C28 11, 36 11, 39 18 Z" fill="${adjustColor(hairColor, 35)}" opacity="0.6"/>
    `;
  } else if (hairStyle === 'headband') {
    hairPath = `
      <!-- Long flow with headband -->
      <path d="M16 26 C15 12, 49 12, 48 26 C50 38, 46 44, 44 28 C41 21, 32 17, 23 21 C21 28, 17 38, 16 26 Z" fill="${hairColor}"/>
      <path d="M16 25 Q32 23 48 25" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none"/>
    `;
  } else if (hairStyle === 'dreads') {
    hairPath = `
      <ellipse cx="32" cy="22" rx="15" ry="11" fill="${hairColor}" />
      <!-- Dreads tips -->
      <line x1="20" y1="21" x2="16" y2="28" stroke="${hairColor}" stroke-width="3" stroke-linecap="round" />
      <line x1="25" y1="18" x2="22" y2="25" stroke="${hairColor}" stroke-width="3" stroke-linecap="round" />
      <line x1="39" y1="18" x2="42" y2="25" stroke="${hairColor}" stroke-width="3" stroke-linecap="round" />
      <line x1="44" y1="21" x2="48" y2="28" stroke="${hairColor}" stroke-width="3" stroke-linecap="round" />
    `;
  } else if (hairStyle === 'bald') {
    hairPath = '';
  } else {
    // short
    hairPath = `
      <path d="M16 25 C16 13, 48 13, 48 25 C46 19, 39 15, 32 15 C25 15, 18 19, 16 25 Z" fill="${hairColor}"/>
    `;
  }

  // Realistic Beard rendering
  let beardMarkup = '';
  if (beardStyle === 'full' || beardStyle === 'heavy') {
    beardMarkup = `
      <!-- Full beard & jawline shadow -->
      <path d="M19 32 C18 42, 23 48, 32 49 C41 48, 46 42, 45 32 C43 38, 39 45, 32 45 C25 45, 21 38, 19 32 Z" fill="${beardColor}" opacity="0.95"/>
      <!-- Moustache -->
      <path d="M26 36 Q32 38 38 36 Q32 34 26 36 Z" fill="${beardColor}"/>
    `;
  } else if (beardStyle === 'stubble') {
    beardMarkup = `
      <!-- Designer 3-day stubble -->
      <path d="M20 33 C19 41, 24 47, 32 48 C40 47, 45 41, 44 33 C42 39, 38 45, 32 45 C26 45, 22 39, 20 33 Z" fill="${beardColor}" opacity="0.45"/>
      <path d="M26 36 Q32 38 38 36" stroke="${beardColor}" stroke-width="1.2" stroke-linecap="round" opacity="0.5" fill="none"/>
    `;
  } else if (beardStyle === 'goatee') {
    beardMarkup = `
      <path d="M28 36 Q32 38 36 36" stroke="${beardColor}" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path d="M29 42 Q32 46 35 42 Q32 44 29 42 Z" fill="${beardColor}"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
    <defs>
      <!-- Skin Lighting Gradient -->
      <radialGradient id="skinG-${preset.id}" cx="42%" cy="38%" r="62%">
        <stop offset="0%" stop-color="${skinHighlight}" />
        <stop offset="65%" stop-color="${skinColor}" />
        <stop offset="100%" stop-color="${skinShadeDark}" />
      </radialGradient>
      <!-- Subtle Jawline Shadow -->
      <linearGradient id="jawShadow-${preset.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skinColor}" stop-opacity="0" />
        <stop offset="100%" stop-color="${skinShadeDark}" stop-opacity="0.6" />
      </linearGradient>
    </defs>

    <!-- Athletic Neck with Shadow -->
    <path d="M26 40 L26 50 L38 50 L38 40 Z" fill="${skinShadeDark}" />
    <path d="M27 41 Q32 45 37 41 L37 49 L27 49 Z" fill="${skinColor}" opacity="0.9" />

    <!-- Anatomical Head Shape (Cheeks & Jaw) -->
    <path d="
      M 32 16
      C 42 16, 47 23, 47 31
      C 47 38, 41 45, 32 47
      C 23 45, 17 38, 17 31
      C 17 23, 22 16, 32 16
      Z
    " fill="url(#skinG-${preset.id})" />

    <!-- Ears with Inner Cartilage -->
    <ellipse cx="16" cy="32" rx="3" ry="4.5" fill="${skinColor}" />
    <path d="M16 30 C15 32, 17 34, 16 35" stroke="${skinShadeDark}" stroke-width="0.8" fill="none" />
    <ellipse cx="48" cy="32" rx="3" ry="4.5" fill="${skinColor}" />
    <path d="M48 30 C49 32, 47 34, 48 35" stroke="${skinShadeDark}" stroke-width="0.8" fill="none" />

    <!-- Eyebrows (Athletic & Expressive) -->
    <path d="M22 26 Q26 24 30 26" stroke="${hairColor}" stroke-width="1.6" stroke-linecap="round" fill="none" />
    <path d="M34 26 Q38 24 42 26" stroke="${hairColor}" stroke-width="1.6" stroke-linecap="round" fill="none" />

    <!-- Eyes (Sclera + Iris + Pupil + Light Reflection) -->
    <!-- Left Eye -->
    <ellipse cx="26" cy="30" rx="3.2" ry="2.2" fill="#ffffff" />
    <circle cx="26.2" cy="30" r="1.6" fill="${eyeColor}" />
    <circle cx="26.2" cy="30" r="0.9" fill="#0f172a" />
    <circle cx="27" cy="29.4" r="0.5" fill="#ffffff" />

    <!-- Right Eye -->
    <ellipse cx="38" cy="30" rx="3.2" ry="2.2" fill="#ffffff" />
    <circle cx="37.8" cy="30" r="1.6" fill="${eyeColor}" />
    <circle cx="37.8" cy="30" r="0.9" fill="#0f172a" />
    <circle cx="38.6" cy="29.4" r="0.5" fill="#ffffff" />

    <!-- Nose (Bridge and Soft Shading) -->
    <path d="M32 27 L31.5 33 L33 33" stroke="${skinShadeDark}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.75" />
    <!-- Nostril accents -->
    <circle cx="30.5" cy="33.5" r="0.4" fill="${skinShadeDark}" opacity="0.6" />
    <circle cx="33.5" cy="33.5" r="0.4" fill="${skinShadeDark}" opacity="0.6" />

    <!-- Mouth & Lips -->
    <path d="M27.5 37.5 Q32 39.5 36.5 37.5" stroke="#a24e4e" stroke-width="1.4" stroke-linecap="round" fill="none" />
    <path d="M29.5 40 Q32 41 34.5 40" stroke="${skinShadeDark}" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.5" />

    <!-- Hair Overlay -->
    ${hairPath}

    <!-- Beard Overlay -->
    ${beardMarkup}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Utility color adjuster for SVG shades and highlights
 */
function adjustColor(hex: string, amount: number): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, val));
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

