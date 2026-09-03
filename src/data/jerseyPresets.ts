/**
 * Preset tactical jersey kits generated as crisp high-resolution SVG Data URIs
 * for instant club styling alongside custom image uploads.
 */

export interface JerseyPreset {
  id: string;
  name: string;
  club: string;
  primaryColor: string;
  secondaryColor: string;
  imageUrl: string;
}

// Generate an SVG texture data URI for custom jersey fabrics
function createStripedJerseySvg(c1: string, c2: string, sponsor = '', isVertical = true): string {
  const stripes = isVertical
    ? `
      <rect x="0" y="0" width="10" height="60" fill="${c1}"/>
      <rect x="10" y="0" width="10" height="60" fill="${c2}"/>
      <rect x="20" y="0" width="10" height="60" fill="${c1}"/>
      <rect x="30" y="0" width="10" height="60" fill="${c2}"/>
      <rect x="40" y="0" width="10" height="60" fill="${c1}"/>
      <rect x="50" y="0" width="10" height="60" fill="${c2}"/>
      <rect x="60" y="0" width="10" height="60" fill="${c1}"/>
      <rect x="70" y="0" width="10" height="60" fill="${c2}"/>
    `
    : `
      <rect x="0" y="0" width="80" height="12" fill="${c1}"/>
      <rect x="0" y="12" width="80" height="12" fill="${c2}"/>
      <rect x="0" y="24" width="80" height="12" fill="${c1}"/>
      <rect x="0" y="36" width="80" height="12" fill="${c2}"/>
      <rect x="0" y="48" width="80" height="12" fill="${c1}"/>
    `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" width="80" height="60">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
      </linearGradient>
    </defs>
    ${stripes}
    <rect x="0" y="0" width="80" height="60" fill="url(#g)"/>
    ${sponsor ? `<text x="40" y="34" font-family="sans-serif" font-size="7" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="0.5" text-anchor="middle" letter-spacing="1.5">${sponsor}</text>` : ''}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createRomaHomeJerseySvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" width="80" height="60">
    <defs>
      <linearGradient id="romaBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#991b2b"/>
        <stop offset="50%" stop-color="#861726"/>
        <stop offset="100%" stop-color="#6e101d"/>
      </linearGradient>
      <linearGradient id="romaGold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="80" height="60" fill="url(#romaBg)"/>
    <!-- Subtle Jacquard texture pinstripes -->
    <line x1="20" y1="0" x2="20" y2="60" stroke="#f59e0b" stroke-width="0.6" stroke-opacity="0.35"/>
    <line x1="40" y1="0" x2="40" y2="60" stroke="#f59e0b" stroke-width="0.6" stroke-opacity="0.35"/>
    <line x1="60" y1="0" x2="60" y2="60" stroke="#f59e0b" stroke-width="0.6" stroke-opacity="0.35"/>
    <!-- Collar and shoulder trim -->
    <path d="M 28,0 L 40,8 L 52,0" fill="none" stroke="url(#romaGold)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- SPQR Sponsor -->
    <text x="40" y="33" font-family="sans-serif" font-size="8.5" font-weight="900" fill="#f59e0b" text-anchor="middle" letter-spacing="2.5">SPQR</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createAzzurroJerseySvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" width="80" height="60">
    <defs>
      <linearGradient id="itaBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1d4ed8"/>
        <stop offset="60%" stop-color="#1e40af"/>
        <stop offset="100%" stop-color="#172554"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="80" height="60" fill="url(#itaBg)"/>
    <!-- Marble texture overlay lines -->
    <path d="M 0,20 Q 25,10 40,30 T 80,15" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.18"/>
    <path d="M 0,45 Q 35,40 50,55 T 80,40" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.18"/>
    <!-- Tricolore trim -->
    <rect x="34" y="0" width="4" height="6" fill="#16a34a"/>
    <rect x="38" y="0" width="4" height="6" fill="#ffffff"/>
    <rect x="42" y="0" width="4" height="6" fill="#dc2626"/>
    <text x="40" y="32" font-family="sans-serif" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">ITALIA</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createWhiteAwayJerseySvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" width="80" height="60">
    <defs>
      <linearGradient id="wBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="80" height="60" fill="url(#wBg)"/>
    <!-- Modern geometric sash -->
    <polygon points="20,0 36,0 60,60 44,60" fill="#861726" opacity="0.9"/>
    <polygon points="36,0 40,0 64,60 60,60" fill="#f59e0b" opacity="0.9"/>
    <text x="40" y="33" font-family="sans-serif" font-size="7.5" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1.5">AWAY</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createGoalkeeperFluoSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" width="80" height="60">
    <defs>
      <linearGradient id="gkBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="50%" stop-color="#059669"/>
        <stop offset="100%" stop-color="#047857"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="80" height="60" fill="url(#gkBg)"/>
    <!-- Cyber honeycomb pattern -->
    <path d="M 10,15 L 20,10 L 30,15 L 30,25 L 20,30 L 10,25 Z" fill="none" stroke="#34d399" stroke-width="1" opacity="0.3"/>
    <path d="M 50,15 L 60,10 L 70,15 L 70,25 L 60,30 L 50,25 Z" fill="none" stroke="#34d399" stroke-width="1" opacity="0.3"/>
    <path d="M 30,30 L 40,25 L 50,30 L 50,40 L 40,45 L 30,40 Z" fill="none" stroke="#a7f3d0" stroke-width="1.2" opacity="0.4"/>
    <text x="40" y="53" font-family="sans-serif" font-size="6.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">KEEPER</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const JERSEY_PRESETS: JerseyPreset[] = [
  {
    id: 'roma-home',
    name: 'AS Roma Home',
    club: 'Roma Giallorossa',
    primaryColor: '#861726',
    secondaryColor: '#f59e0b',
    imageUrl: createRomaHomeJerseySvg(),
  },
  {
    id: 'stripes-redblack',
    name: 'Rossonera',
    club: 'Strisce Verticali',
    primaryColor: '#dc2626',
    secondaryColor: '#ffffff',
    imageUrl: createStripedJerseySvg('#b91c1c', '#0f172a', 'EMIRATES'),
  },
  {
    id: 'stripes-blueblack',
    name: 'Nerazzurra',
    club: 'Strisce Verticali',
    primaryColor: '#1d4ed8',
    secondaryColor: '#ffffff',
    imageUrl: createStripedJerseySvg('#1d4ed8', '#090d16', 'BETSSON'),
  },
  {
    id: 'stripes-blackwhite',
    name: 'Bianconera',
    club: 'Strisce Verticali',
    primaryColor: '#0f172a',
    secondaryColor: '#ffffff',
    imageUrl: createStripedJerseySvg('#f8fafc', '#0f172a', 'JEEP'),
  },
  {
    id: 'azzurra-ita',
    name: 'Azzurra',
    club: 'Nazionale',
    primaryColor: '#1e40af',
    secondaryColor: '#ffffff',
    imageUrl: createAzzurroJerseySvg(),
  },
  {
    id: 'white-away',
    name: 'White Away',
    club: 'Trasferta',
    primaryColor: '#ffffff',
    secondaryColor: '#861726',
    imageUrl: createWhiteAwayJerseySvg(),
  },
  {
    id: 'gk-fluo',
    name: 'Portiere Fluo',
    club: 'Goalkeeper',
    primaryColor: '#059669',
    secondaryColor: '#ffffff',
    imageUrl: createGoalkeeperFluoSvg(),
  },
];
