export interface KitVisualConfig {
  filter: string;
  numberColor: string;
  strokeColor: string;
  badgeBg: string;
  badgeText: string;
  hex: string;
}

export interface KitPreset {
  id: string;
  name: string;
  hex: string;
}

export const KIT_COLOR_PRESETS: KitPreset[] = [
  { id: 'yellow', name: 'Giallo Oro', hex: '#eab308' },
  { id: 'blue', name: 'Azzurro / Blu', hex: '#1d4ed8' },
  { id: 'red', name: 'Rosso Fuoco', hex: '#dc2626' },
  { id: 'bordeaux', name: 'Roma Granata', hex: '#861726' },
  { id: 'white', name: 'Bianco', hex: '#f8fafc' },
  { id: 'black', name: 'Nero', hex: '#0f172a' },
  { id: 'green', name: 'Verde', hex: '#16a34a' },
  { id: 'orange', name: 'Arancione', hex: '#ea580c' },
  { id: 'purple', name: 'Viola', hex: '#7c3aed' },
  { id: 'sky', name: 'Celeste', hex: '#0ea5e9' },
];

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c
      .split('')
      .map((x) => x + x)
      .join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return { h: 50, s: 0.9, l: 0.5 };
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }
  return { h, s, l };
}

export function getKitVisuals(player: {
  customColor?: string;
  team?: 'home' | 'away' | 'jolly' | 'keeper' | 'referee' | string;
  role?: string;
}): KitVisualConfig {
  let hex = player.customColor;

  if (!hex) {
    if (player.team === 'away') {
      hex = '#1d4ed8'; // Default away: Navy/Azzurro
    } else if (player.team === 'keeper' || player.role === 'POR') {
      hex = '#16a34a'; // Default keeper: Emerald green
    } else if (player.team === 'jolly') {
      hex = '#ea580c'; // Default jolly: Orange
    } else if (player.team === 'referee' || player.role === 'ARB') {
      hex = '#0f172a'; // Default referee: Black
    } else {
      hex = '#eab308'; // Default home: Yellow Gold (matches EA FC broadcast photo)
    }
  }

  const { h, s, l } = hexToHsl(hex);

  // Check for grayscale (white / black / gray)
  if (s < 0.16) {
    if (l >= 0.6) {
      // White kit
      return {
        filter: 'grayscale(1) brightness(1.75) contrast(0.95)',
        numberColor: '#09090b',
        strokeColor: '#ffffff',
        badgeBg: '#ffffff',
        badgeText: '#09090b',
        hex,
      };
    } else {
      // Black / dark slate kit
      return {
        filter: 'grayscale(1) brightness(0.28) contrast(1.3)',
        numberColor: '#ffffff',
        strokeColor: '#000000',
        badgeBg: '#09090b',
        badgeText: '#facc15',
        hex,
      };
    }
  }

  // Chromatic color tint based on yellow (H = 50deg) base render
  const deltaHue = (h - 50 + 360) % 360;

  let brightness = 0.95;
  if (l < 0.35) {
    brightness = 0.65;
  } else if (l < 0.45) {
    brightness = 0.82;
  } else if (l > 0.6) {
    brightness = 1.1;
  }

  const sat = Math.min(2.0, Math.max(1.3, s * 1.8));
  const filter = `hue-rotate(${deltaHue}deg) saturate(${sat}) brightness(${brightness.toFixed(2)})`;

  // Number contrast
  const isLight = l >= 0.52 && !(h > 200 && h < 300); // Blue/purple are visually dark even at 0.52

  const numberColor = isLight ? '#09090b' : '#ffffff';
  const strokeColor = isLight ? '#ffffff' : '#000000';
  const badgeText = isLight ? '#09090b' : '#ffffff';

  return {
    filter,
    numberColor,
    strokeColor,
    badgeBg: hex,
    badgeText,
    hex,
  };
}
