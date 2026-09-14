/**
 * App Branding & iOS Home Screen Icon Generator
 * Generates official 180x180 px retina PNG icons for iPhone/iPad Home Screen
 * and synchronizes DOM meta tags dynamically.
 */

export type AppIconSymbol =
  | 'shield'
  | 'football'
  | 'tactics'
  | 'crown'
  | 'star'
  | 'whistle'
  | 'eagle'
  | 'jersey';

export interface AppIconTheme {
  id: string;
  name: string;
  gradient: [string, string];
  accent: string;
}

export const APP_ICON_THEMES: AppIconTheme[] = [
  { id: 'emerald', name: 'Smeraldo Tattico', gradient: ['#059669', '#022c22'], accent: '#34d399' },
  { id: 'roma', name: 'Giallorosso Roma', gradient: ['#991b1b', '#450a0a'], accent: '#f59e0b' },
  { id: 'inter', name: 'Nerazzurro Milano', gradient: ['#1d4ed8', '#030712'], accent: '#38bdf8' },
  { id: 'milan', name: 'Rossonero Diavolo', gradient: ['#dc2626', '#09090b'], accent: '#f87171' },
  { id: 'juve', name: 'Bianconero Torino', gradient: ['#334155', '#020617'], accent: '#f8fafc' },
  { id: 'italia', name: 'Azzurro Nazionale', gradient: ['#2563eb', '#172554'], accent: '#ffffff' },
  { id: 'gold', name: 'Oro Campione', gradient: ['#d97706', '#78350f'], accent: '#fde047' },
  { id: 'dark', name: 'Dark Stealth', gradient: ['#1e293b', '#020617'], accent: '#10b981' },
  { id: 'viola', name: 'Viola Giglio', gradient: ['#7c3aed', '#2e1065'], accent: '#c084fc' },
];

export interface AppBrandingConfig {
  appName: string;
  symbol: AppIconSymbol;
  themeId: string;
  customLogoUrl?: string;
  hasGlossReflect?: boolean;
}

const STORAGE_BRAND_NAME_KEY = 'mistertactics_brand_name';
const STORAGE_ICON_CONFIG_KEY = 'mistertactics_icon_config';
const STORAGE_ICON_DATA_KEY = 'mistertactics_icon_png_data';

export const DEFAULT_BRANDING: AppBrandingConfig = {
  appName: 'MisterTactics',
  symbol: 'shield',
  themeId: 'emerald',
  hasGlossReflect: true,
};

/**
 * Generates an SVG string representation of the 180x180 icon
 */
export function generateAppIconSvg(config: AppBrandingConfig): string {
  const theme = APP_ICON_THEMES.find((t) => t.id === config.themeId) || APP_ICON_THEMES[0];
  const [c1, c2] = theme.gradient;
  const accent = theme.accent;

  let symbolSvg = '';

  if (config.customLogoUrl) {
    symbolSvg = `
      <g transform="translate(90, 90)">
        <circle cx="0" cy="0" r="48" fill="#ffffff" fill-opacity="0.12"/>
        <image href="${config.customLogoUrl}" x="-42" y="-42" width="84" height="84" preserveAspectRatio="xMidYMid meet"/>
      </g>
    `;
  } else {
    switch (config.symbol) {
      case 'football':
        symbolSvg = `
          <g transform="translate(90, 90)">
            <!-- Outer Glow -->
            <circle cx="0" cy="0" r="42" fill="#ffffff" stroke="${accent}" stroke-width="2.5" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))"/>
            <!-- Ball Pentagons Pattern -->
            <polygon points="0,-16 15,-5 9,13 -9,13 -15,-5" fill="#0f172a"/>
            <line x1="0" y1="-16" x2="0" y2="-40" stroke="#0f172a" stroke-width="2.5"/>
            <line x1="15" y1="-5" x2="38" y2="-12" stroke="#0f172a" stroke-width="2.5"/>
            <line x1="9" y1="13" x2="24" y2="34" stroke="#0f172a" stroke-width="2.5"/>
            <line x1="-9" y1="13" x2="-24" y2="34" stroke="#0f172a" stroke-width="2.5"/>
            <line x1="-15" y1="-5" x2="-38" y2="-12" stroke="#0f172a" stroke-width="2.5"/>
          </g>
        `;
        break;

      case 'tactics':
        symbolSvg = `
          <g transform="translate(90, 90)">
            <!-- Clipboard Frame -->
            <rect x="-38" y="-46" width="76" height="92" rx="10" fill="#0f172a" stroke="${accent}" stroke-width="2.5"/>
            <!-- Clip Top -->
            <rect x="-18" y="-52" width="36" height="12" rx="4" fill="${accent}"/>
            <!-- Pitch lines -->
            <rect x="-30" y="-36" width="60" height="72" rx="4" fill="none" stroke="#334155" stroke-width="1.5"/>
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#334155" stroke-width="1.5"/>
            <circle cx="0" cy="0" r="10" fill="none" stroke="#334155" stroke-width="1.5"/>
            <!-- Tactical Players -->
            <circle cx="-14" cy="-16" r="5" fill="#ef4444"/>
            <circle cx="14" cy="-16" r="5" fill="#3b82f6"/>
            <circle cx="0" cy="18" r="5" fill="#eab308"/>
            <!-- Tactical Arrow -->
            <path d="M -10,-10 Q 0,-2 8,-10" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="3 2"/>
            <polygon points="8,-10 4,-7 5,-12" fill="${accent}"/>
          </g>
        `;
        break;

      case 'crown':
        symbolSvg = `
          <g transform="translate(90, 95)">
            <path d="M -44,22 L -36,-26 L -12,4 L 0,-34 L 12,4 L 36,-26 L 44,22 Z" fill="${accent}" stroke="#0f172a" stroke-width="2"/>
            <rect x="-44" y="22" width="88" height="12" rx="4" fill="#f59e0b" stroke="#0f172a" stroke-width="1.5"/>
            <circle cx="-36" cy="-28" r="4" fill="#ffffff"/>
            <circle cx="0" cy="-36" r="5" fill="#ffffff"/>
            <circle cx="36" cy="-28" r="4" fill="#ffffff"/>
            <!-- Jewels -->
            <circle cx="-22" cy="28" r="3" fill="#dc2626"/>
            <circle cx="0" cy="28" r="3.5" fill="#2563eb"/>
            <circle cx="22" cy="28" r="3" fill="#16a34a"/>
          </g>
        `;
        break;

      case 'star':
        symbolSvg = `
          <g transform="translate(90, 90)">
            <polygon points="0,-48 14,-14 50,-14 22,9 32,44 0,22 -32,44 -22,9 -50,-14 -14,-14" fill="${accent}" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"/>
          </g>
        `;
        break;

      case 'whistle':
        symbolSvg = `
          <g transform="translate(90, 90)">
            <!-- Whistle Body -->
            <path d="M -30,-4 C -30,-22 -14,-34 6,-34 C 26,-34 40,-20 40,0 C 40,20 24,34 4,34 L -30,34 L -30,12 L -42,12 L -42,-4 Z" fill="${accent}" stroke="#0f172a" stroke-width="2.5"/>
            <circle cx="6" cy="0" r="14" fill="#0f172a" opacity="0.4"/>
            <line x1="-30" y1="12" x2="4" y2="12" stroke="#0f172a" stroke-width="2.5"/>
            <!-- Ring -->
            <circle cx="-42" cy="4" r="5" fill="none" stroke="#ffffff" stroke-width="2"/>
          </g>
        `;
        break;

      case 'jersey':
        symbolSvg = `
          <g transform="translate(90, 92) scale(1.6)">
            <!-- Shirt Shape -->
            <path d="M -8,-20 L -22,-16 L -28,-3 L -18,2 L -14,-5 L -14,24 L 14,24 L 14,-5 L 18,2 L 28,-3 L 22,-16 L 8,-20 Z" fill="${accent}" stroke="#ffffff" stroke-width="1.2"/>
            <!-- Collar -->
            <path d="M -8,-20 Q 0,-14 8,-20" fill="none" stroke="#ffffff" stroke-width="2"/>
            <!-- Number 10 on chest -->
            <text x="0" y="10" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#0f172a" text-anchor="middle">10</text>
          </g>
        `;
        break;

      case 'shield':
      default:
        symbolSvg = `
          <g transform="translate(90, 90)">
            <!-- Outer Shield -->
            <path d="M -44,-42 L 44,-42 C 44,-42 46,12 0,52 C -46,12 -44,-42 -44,-42 Z" fill="${accent}" stroke="#ffffff" stroke-width="2.5" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.5))"/>
            <!-- Inner Shield Contrast -->
            <path d="M -34,-32 L 34,-32 C 34,-32 36,8 0,40 C -36,8 -34,-32 -34,-32 Z" fill="#0f172a" opacity="0.88"/>
            <!-- Tactical White Board Crosshair Lines inside Shield -->
            <line x1="0" y1="-28" x2="0" y2="34" stroke="${accent}" stroke-width="1.8" opacity="0.6"/>
            <line x1="-26" y1="0" x2="26" y2="0" stroke="${accent}" stroke-width="1.8" opacity="0.6"/>
            <circle cx="0" cy="0" r="12" fill="none" stroke="${accent}" stroke-width="1.8" opacity="0.6"/>
            <!-- Tactical Dots -->
            <circle cx="-12" cy="-14" r="4.5" fill="#38bdf8"/>
            <circle cx="12" cy="-14" r="4.5" fill="#ef4444"/>
            <circle cx="0" cy="16" r="4.5" fill="#facc15"/>
          </g>
        `;
        break;
    }
  }

  // iOS App Icon Squircle Continuous Curvature Frame (180x180)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>

        <!-- Subtle Top-to-Bottom Apple Glass Refraction -->
        <linearGradient id="glassGloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32"/>
          <stop offset="45%" stop-color="#ffffff" stop-opacity="0.08"/>
          <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
        </linearGradient>

        <!-- Radial Center Highlight -->
        <radialGradient id="centerGlow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>

        <clipPath id="appleSquircleClip">
          <rect x="0" y="0" width="180" height="180" rx="40" ry="40"/>
        </clipPath>
      </defs>

      <!-- Main Icon Canvas with iOS Corner Radii -->
      <g clip-path="url(#appleSquircleClip)">
        <!-- Base Gradient -->
        <rect x="0" y="0" width="180" height="180" fill="url(#bgGrad)"/>
        <!-- Radial Spotlight -->
        <rect x="0" y="0" width="180" height="180" fill="url(#centerGlow)"/>

        <!-- High-tech Subtle Carbon/Pitch Lines overlay -->
        <line x1="0" y1="45" x2="180" y2="45" stroke="#ffffff" stroke-width="0.8" opacity="0.08"/>
        <line x1="0" y1="90" x2="180" y2="90" stroke="#ffffff" stroke-width="0.8" opacity="0.08"/>
        <line x1="0" y1="135" x2="180" y2="135" stroke="#ffffff" stroke-width="0.8" opacity="0.08"/>
        <line x1="45" y1="0" x2="45" y2="180" stroke="#ffffff" stroke-width="0.8" opacity="0.08"/>
        <line x1="90" y1="0" x2="90" y2="180" stroke="#ffffff" stroke-width="0.8" opacity="0.08"/>
        <line x1="135" y1="0" x2="135" y2="180" stroke="#ffffff" stroke-width="0.8" opacity="0.08"/>

        <!-- Core Symbol -->
        ${symbolSvg}

        <!-- Apple Glass Gloss Effect -->
        ${
          config.hasGlossReflect !== false
            ? '<rect x="0" y="0" width="180" height="180" fill="url(#glassGloss)" pointer-events="none"/>'
            : ''
        }

        <!-- Inner Edge Stroke Highlight -->
        <rect x="1" y="1" width="178" height="178" rx="39" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.25" pointer-events="none"/>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Converts SVG to standard PNG Data URI using a hidden canvas for true iOS Safari apple-touch-icon compatibility
 */
export async function renderIconToPngDataUri(svgDataUri: string, size = 180): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(svgDataUri);
          return;
        }
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const pngUrl = canvas.toDataURL('image/png');
        resolve(pngUrl);
      } catch {
        resolve(svgDataUri);
      }
    };
    img.onerror = () => resolve(svgDataUri);
    img.src = svgDataUri;
  });
}

/**
 * Applies the customized name and icon to the DOM, browser tabs, and Apple Home Screen meta tags
 */
export function applyAppBrandingToDocument(name: string, iconDataUri: string) {
  const safeName = (name || '').trim() || 'MisterTactics';

  // 1. Update Title & Meta OG
  document.title = `${safeName} - Lavagna Tattica & Allenamenti`;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${safeName} - Lavagna Tattica`);

  // 2. Apple Mobile Web App Title
  let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if (!appleTitle) {
    appleTitle = document.createElement('meta');
    appleTitle.setAttribute('name', 'apple-mobile-web-app-title');
    document.head.appendChild(appleTitle);
  }
  appleTitle.setAttribute('content', safeName);

  // 3. Apple Touch Icon for iPhone / iPad Home Screen
  let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
  if (!appleIcon) {
    appleIcon = document.createElement('link');
    appleIcon.setAttribute('rel', 'apple-touch-icon');
    appleIcon.setAttribute('sizes', '180x180');
    document.head.appendChild(appleIcon);
  }
  appleIcon.setAttribute('href', iconDataUri);

  // 4. Favicon for browser tabs
  let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('href', iconDataUri);

  // 5. Dynamic Web App Manifest Blob injection
  try {
    const manifestObj = {
      id: '/',
      name: safeName,
      short_name: safeName.length > 12 ? safeName.substring(0, 12) : safeName,
      description: 'Lavagna tattica professionale e gestione squadra',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#020617',
      theme_color: '#020617',
      icons: [
        { src: iconDataUri, sizes: '180x180', type: 'image/png', purpose: 'any' },
        { src: iconDataUri, sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: iconDataUri, sizes: '512x512', type: 'image/png', purpose: 'any' },
      ],
    };
    const blob = new Blob([JSON.stringify(manifestObj)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(blob);

    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute('href', manifestUrl);
  } catch (e) {
    console.warn('Could not inject dynamic manifest:', e);
  }
}

/**
 * Load saved branding from localStorage
 */
export function loadSavedAppBranding(): { config: AppBrandingConfig; iconDataUri: string } {
  let config: AppBrandingConfig = { ...DEFAULT_BRANDING };
  try {
    const savedName = localStorage.getItem(STORAGE_BRAND_NAME_KEY);
    const savedConfig = localStorage.getItem(STORAGE_ICON_CONFIG_KEY);
    if (savedConfig) {
      config = { ...config, ...JSON.parse(savedConfig) };
    }
    if (savedName) {
      config.appName = savedName;
    }
  } catch {}

  if (!config.appName || typeof config.appName !== 'string') {
    config.appName = 'MisterTactics';
  }

  const savedData = localStorage.getItem(STORAGE_ICON_DATA_KEY);
  const iconDataUri = savedData || generateAppIconSvg(config);

  return { config, iconDataUri };
}

/**
 * Save branding to localStorage
 */
export function saveAppBranding(config: AppBrandingConfig, iconDataUri: string) {
  try {
    localStorage.setItem(STORAGE_BRAND_NAME_KEY, config.appName);
    localStorage.setItem(STORAGE_ICON_CONFIG_KEY, JSON.stringify(config));
    localStorage.setItem(STORAGE_ICON_DATA_KEY, iconDataUri);
  } catch (e) {
    console.warn('Failed to save branding in localStorage:', e);
  }
}
