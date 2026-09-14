/**
 * Dynamic Tactical Football Jersey SVG Generator
 * Generates crisp, high-resolution vector textures for player kits.
 */

export type JerseyPattern =
  | 'solid'
  | 'stripes_vertical'
  | 'stripes_horizontal'
  | 'sash'
  | 'halves'
  | 'pinstripes'
  | 'checkered'
  | 'raglan';

export interface CustomJerseyConfig {
  id?: string;
  name: string;
  pattern: JerseyPattern;
  primaryColor: string;
  secondaryColor: string;
  trimColor: string;
  sponsorText?: string;
  crestType?: 'shield' | 'scudetto' | 'circle' | 'star' | 'none';
  customLogoUrl?: string;
}

export function generateJerseySvgDataUri(config: CustomJerseyConfig): string {
  const {
    pattern,
    primaryColor,
    secondaryColor,
    trimColor,
    sponsorText = '',
    crestType = 'shield',
    customLogoUrl,
  } = config;

  let patternSvg = '';

  switch (pattern) {
    case 'stripes_vertical':
      patternSvg = `
        <rect x="0" y="0" width="80" height="60" fill="${primaryColor}"/>
        <rect x="10" y="0" width="10" height="60" fill="${secondaryColor}"/>
        <rect x="30" y="0" width="10" height="60" fill="${secondaryColor}"/>
        <rect x="50" y="0" width="10" height="60" fill="${secondaryColor}"/>
        <rect x="70" y="0" width="10" height="60" fill="${secondaryColor}"/>
      `;
      break;

    case 'stripes_horizontal':
      patternSvg = `
        <rect x="0" y="0" width="80" height="60" fill="${primaryColor}"/>
        <rect x="0" y="10" width="80" height="10" fill="${secondaryColor}"/>
        <rect x="0" y="28" width="80" height="10" fill="${secondaryColor}"/>
        <rect x="0" y="46" width="80" height="10" fill="${secondaryColor}"/>
      `;
      break;

    case 'sash':
      patternSvg = `
        <rect x="0" y="0" width="80" height="60" fill="${primaryColor}"/>
        <polygon points="18,0 34,0 62,60 46,60" fill="${secondaryColor}"/>
        <polygon points="34,0 38,0 66,60 62,60" fill="${trimColor}" opacity="0.8"/>
      `;
      break;

    case 'halves':
      patternSvg = `
        <rect x="0" y="0" width="40" height="60" fill="${primaryColor}"/>
        <rect x="40" y="0" width="40" height="60" fill="${secondaryColor}"/>
      `;
      break;

    case 'pinstripes':
      patternSvg = `
        <rect x="0" y="0" width="80" height="60" fill="${primaryColor}"/>
        <line x1="16" y1="0" x2="16" y2="60" stroke="${secondaryColor}" stroke-width="1.2" opacity="0.75"/>
        <line x1="32" y1="0" x2="32" y2="60" stroke="${secondaryColor}" stroke-width="1.2" opacity="0.75"/>
        <line x1="48" y1="0" x2="48" y2="60" stroke="${secondaryColor}" stroke-width="1.2" opacity="0.75"/>
        <line x1="64" y1="0" x2="64" y2="60" stroke="${secondaryColor}" stroke-width="1.2" opacity="0.75"/>
      `;
      break;

    case 'checkered':
      patternSvg = `
        <rect x="0" y="0" width="80" height="60" fill="${primaryColor}"/>
        <rect x="0" y="0" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="32" y="0" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="64" y="0" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="16" y="15" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="48" y="15" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="0" y="30" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="32" y="30" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="64" y="30" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="16" y="45" width="16" height="15" fill="${secondaryColor}"/>
        <rect x="48" y="45" width="16" height="15" fill="${secondaryColor}"/>
      `;
      break;

    case 'raglan':
      patternSvg = `
        <rect x="0" y="0" width="80" height="60" fill="${primaryColor}"/>
        <polygon points="0,0 22,0 14,24 0,16" fill="${secondaryColor}"/>
        <polygon points="80,0 58,0 66,24 80,16" fill="${secondaryColor}"/>
      `;
      break;

    case 'solid':
    default:
      patternSvg = `
        <rect x="0" y="0" width="80" height="60" fill="${primaryColor}"/>
        <!-- Subtle athletic diagonal weave line overlay -->
        <line x1="0" y1="20" x2="80" y2="28" stroke="${secondaryColor}" stroke-width="0.5" opacity="0.25"/>
        <line x1="0" y1="40" x2="80" y2="48" stroke="${secondaryColor}" stroke-width="0.5" opacity="0.25"/>
      `;
      break;
  }

  // Chest Crest
  let crestSvg = '';
  if (customLogoUrl) {
    crestSvg = `
      <g transform="translate(24, 15)">
        <image href="${customLogoUrl}" x="-7" y="-7" width="14" height="14" preserveAspectRatio="xMidYMid meet"/>
      </g>
    `;
  } else if (crestType === 'scudetto') {
    crestSvg = `
      <g transform="translate(24, 16)">
        <path d="M -4,-5 L 4,-5 L 4,1 C 4,5 0,8 0,8 C 0,8 -4,5 -4,1 Z" fill="#ffffff" stroke="#000000" stroke-width="0.5"/>
        <path d="M -3,-4 L -1,-4 L -1,1 C -1,3.5 -3,4.5 -3,4.5 Z" fill="#16a34a"/>
        <path d="M -1,-4 L 1,-4 L 1,4 L -1,4 Z" fill="#ffffff"/>
        <path d="M 1,-4 L 3,-4 C 3,4.5 1,3.5 1,3.5 L 1,1 Z" fill="#dc2626"/>
      </g>
    `;
  } else if (crestType === 'shield') {
    crestSvg = `
      <g transform="translate(24, 16)">
        <path d="M -4.5,-5 L 4.5,-5 L 4.5,1.5 C 4.5,5.5 0,8.5 0,8.5 C 0,8.5 -4.5,5.5 -4.5,1.5 Z" fill="${trimColor}" stroke="#0f172a" stroke-width="0.6"/>
        <path d="M -3,-3.5 L 3,-3.5 L 3,1 C 3,4 0,6 0,6 C 0,6 -3,4 -3,1 Z" fill="${secondaryColor}"/>
      </g>
    `;
  } else if (crestType === 'circle') {
    crestSvg = `
      <g transform="translate(24, 16)">
        <circle cx="0" cy="0" r="5" fill="${trimColor}" stroke="#0f172a" stroke-width="0.6"/>
        <circle cx="0" cy="0" r="3.5" fill="${secondaryColor}"/>
      </g>
    `;
  } else if (crestType === 'star') {
    crestSvg = `
      <g transform="translate(24, 15)">
        <polygon points="0,-5 1.5,-1.5 5,-1.5 2.2,0.8 3.2,4.5 0,2.3 -3.2,4.5 -2.2,0.8 -5,-1.5 -1.5,-1.5" fill="${trimColor}" stroke="#0f172a" stroke-width="0.5"/>
      </g>
    `;
  }

  // Technical Brand Logo on Right Chest
  const brandSvg = `
    <g transform="translate(56, 16)">
      <path d="M -4,-1 Q 0,2 4,-2" fill="none" stroke="${trimColor}" stroke-width="1.2" stroke-linecap="round"/>
    </g>
  `;

  // Collar V/Crew Neck
  const collarSvg = `
    <path d="M 30,0 L 40,8 L 50,0" fill="none" stroke="${trimColor}" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="40" cy="1" rx="10" ry="3" fill="#0b0f19" opacity="0.6"/>
  `;

  // Chest Sponsor Text
  let sponsorSvg = '';
  const safeSponsor = (sponsorText || '').trim();
  if (safeSponsor) {
    sponsorSvg = `
      <text x="40" y="34" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="900" fill="${trimColor}" stroke="#000000" stroke-width="0.5" text-anchor="middle" letter-spacing="1.5">
        ${safeSponsor.toUpperCase()}
      </text>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" width="80" height="60">
      <defs>
        <linearGradient id="fabric3d" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      ${patternSvg}
      <rect x="0" y="0" width="80" height="60" fill="url(#fabric3d)"/>
      ${collarSvg}
      ${crestSvg}
      ${brandSvg}
      ${sponsorSvg}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const FAMOUS_KIT_PRESETS: CustomJerseyConfig[] = [
  {
    id: 'roma-home-official',
    name: 'AS Roma Home',
    pattern: 'pinstripes',
    primaryColor: '#861726',
    secondaryColor: '#f59e0b',
    trimColor: '#fbbf24',
    sponsorText: 'SPQR',
    crestType: 'scudetto',
  },
  {
    id: 'milan-rossonera',
    name: 'AC Milan Rossonera',
    pattern: 'stripes_vertical',
    primaryColor: '#b91c1c',
    secondaryColor: '#0f172a',
    trimColor: '#ffffff',
    sponsorText: 'EMIRATES',
    crestType: 'scudetto',
  },
  {
    id: 'inter-nerazzurra',
    name: 'Inter Nerazzurra',
    pattern: 'stripes_vertical',
    primaryColor: '#1d4ed8',
    secondaryColor: '#090d16',
    trimColor: '#fbbf24',
    sponsorText: 'BETSSON',
    crestType: 'circle',
  },
  {
    id: 'juve-bianconera',
    name: 'Juventus Bianconera',
    pattern: 'stripes_vertical',
    primaryColor: '#f8fafc',
    secondaryColor: '#0f172a',
    trimColor: '#fbbf24',
    sponsorText: 'JEEP',
    crestType: 'shield',
  },
  {
    id: 'italia-azzurra',
    name: 'Italia Azzurra',
    pattern: 'solid',
    primaryColor: '#1d4ed8',
    secondaryColor: '#ffffff',
    trimColor: '#fbbf24',
    sponsorText: 'ITALIA',
    crestType: 'scudetto',
  },
  {
    id: 'real-blancos',
    name: 'Real Madrid Blanco',
    pattern: 'solid',
    primaryColor: '#ffffff',
    secondaryColor: '#fbbf24',
    trimColor: '#f59e0b',
    sponsorText: 'EMIRATES',
    crestType: 'circle',
  },
  {
    id: 'barca-blaugrana',
    name: 'Barcelona Blaugrana',
    pattern: 'stripes_vertical',
    primaryColor: '#1e3a8a',
    secondaryColor: '#991b1b',
    trimColor: '#fbbf24',
    sponsorText: 'SPOTIFY',
    crestType: 'shield',
  },
  {
    id: 'argentina-celeste',
    name: 'Argentina Albiceleste',
    pattern: 'stripes_vertical',
    primaryColor: '#38bdf8',
    secondaryColor: '#ffffff',
    trimColor: '#fbbf24',
    sponsorText: 'AFA',
    crestType: 'star',
  },
  {
    id: 'river-sash',
    name: 'River Banda Rossa',
    pattern: 'sash',
    primaryColor: '#ffffff',
    secondaryColor: '#dc2626',
    trimColor: '#0f172a',
    sponsorText: 'CODERE',
    crestType: 'shield',
  },
  {
    id: 'croatia-check',
    name: 'Croazia Scacchi',
    pattern: 'checkered',
    primaryColor: '#ffffff',
    secondaryColor: '#dc2626',
    trimColor: '#1d4ed8',
    sponsorText: 'HNS',
    crestType: 'shield',
  },
  {
    id: 'gk-emerald-pro',
    name: 'Portiere Smeraldo Fluo',
    pattern: 'raglan',
    primaryColor: '#10b981',
    secondaryColor: '#047857',
    trimColor: '#ffffff',
    sponsorText: 'KEEPER',
    crestType: 'circle',
  },
  {
    id: 'gk-sunset-orange',
    name: 'Portiere Sunset Arancio',
    pattern: 'raglan',
    primaryColor: '#ea580c',
    secondaryColor: '#9a3412',
    trimColor: '#facc15',
    sponsorText: 'KEEPER',
    crestType: 'shield',
  },
];
