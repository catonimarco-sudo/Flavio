import React, { useState, useRef, useEffect } from 'react';
import {
  AppBrandingConfig,
  AppIconSymbol,
  APP_ICON_THEMES,
  generateAppIconSvg,
  renderIconToPngDataUri,
  applyAppBrandingToDocument,
  saveAppBranding,
} from '../utils/appIconGenerator';
import {
  X,
  Smartphone,
  Sparkles,
  Upload,
  Check,
  Download,
  Share2,
  HelpCircle,
  RotateCcw,
  Shield,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface AppBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrandName?: string;
  currentAppName?: string;
  onUpdateBrandName?: (newName: string) => void;
  onUpdateAppName?: (newName: string) => void;
}

const SYMBOLS: { id: AppIconSymbol; label: string; emoji: string }[] = [
  { id: 'shield', label: 'Scudetto Tattico', emoji: '🛡️' },
  { id: 'football', label: 'Pallone Calcio', emoji: '⚽' },
  { id: 'tactics', label: 'Lavagna Tattica', emoji: '📋' },
  { id: 'crown', label: 'Corona Campione', emoji: '👑' },
  { id: 'star', label: 'Stella d’Oro', emoji: '⭐' },
  { id: 'whistle', label: 'Fischietto Mister', emoji: '📯' },
  { id: 'jersey', label: 'Maglia Ufficiale', emoji: '👕' },
];

export const AppBrandModal: React.FC<AppBrandModalProps> = ({
  isOpen,
  onClose,
  currentBrandName,
  currentAppName,
  onUpdateBrandName,
  onUpdateAppName,
}) => {
  const initialName = currentBrandName || currentAppName || 'MisterTactics';
  const [appName, setAppName] = useState<string>(initialName);
  const [selectedSymbol, setSelectedSymbol] = useState<AppIconSymbol>('shield');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('emerald');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | undefined>(undefined);
  const [hasGlossReflect, setHasGlossReflect] = useState<boolean>(true);
  const [iconDataUri, setIconDataUri] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'designer' | 'ios_instructions'>('designer');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const nameToUse = currentBrandName || currentAppName || 'MisterTactics';
      setAppName(nameToUse);
      try {
        const savedConfig = localStorage.getItem('mistertactics_icon_config');
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          if (parsed.symbol) setSelectedSymbol(parsed.symbol);
          if (parsed.themeId) setSelectedThemeId(parsed.themeId);
          if (parsed.customLogoUrl) setCustomLogoUrl(parsed.customLogoUrl);
          if (typeof parsed.hasGlossReflect === 'boolean') setHasGlossReflect(parsed.hasGlossReflect);
        }
      } catch {}
    }
  }, [isOpen, currentBrandName, currentAppName]);

  // Re-generate preview when options change
  useEffect(() => {
    const safeName = (appName || '').trim() || 'MisterTactics';
    const config: AppBrandingConfig = {
      appName: safeName,
      symbol: selectedSymbol,
      themeId: selectedThemeId,
      customLogoUrl,
      hasGlossReflect,
    };
    const svgUri = generateAppIconSvg(config);
    setIconDataUri(svgUri);
  }, [appName, selectedSymbol, selectedThemeId, customLogoUrl, hasGlossReflect]);

  if (!isOpen) return null;

  const currentTheme =
    APP_ICON_THEMES.find((t) => t.id === selectedThemeId) || APP_ICON_THEMES[0];

  const handleApplyAndSave = async () => {
    const safeName = (appName || '').trim() || 'MisterTactics';
    const config: AppBrandingConfig = {
      appName: safeName,
      symbol: selectedSymbol,
      themeId: selectedThemeId,
      customLogoUrl,
      hasGlossReflect,
    };

    const svgUri = generateAppIconSvg(config);
    // Convert to PNG for native iOS retina compatibility
    const pngUri = await renderIconToPngDataUri(svgUri, 180);

    applyAppBrandingToDocument(safeName, pngUri);
    saveAppBranding(config, pngUri);
    if (onUpdateBrandName) onUpdateBrandName(safeName);
    if (onUpdateAppName) onUpdateAppName(safeName);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetToDefault = () => {
    setAppName('MisterTactics');
    setSelectedSymbol('shield');
    setSelectedThemeId('emerald');
    setCustomLogoUrl(undefined);
    setHasGlossReflect(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomLogoUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadIcon = async () => {
    const safeName = (appName || '').trim() || 'MisterTactics';
    const config: AppBrandingConfig = {
      appName: safeName,
      symbol: selectedSymbol,
      themeId: selectedThemeId,
      customLogoUrl,
      hasGlossReflect,
    };
    const svgUri = generateAppIconSvg(config);
    const pngUri = await renderIconToPngDataUri(svgUri, 180);

    const a = document.createElement('a');
    a.href = pngUri;
    a.download = `icona-${safeName.toLowerCase().replace(/\s+/g, '-')}-180x180.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id="app-brand-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="app-brand-modal-card"
        className="relative w-full max-w-2xl bg-[#0b1120] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-white font-black shadow-sm">
              <Smartphone size={17} />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                <span>Personalizza Nome & Icona iPhone / iPad</span>
              </h2>
              <p className="text-[10px] text-slate-400">
                Cambia il nome dell&apos;app e crea la tua icona ufficiale per la Schermata Home di iOS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('designer')}
            className={`pb-2 px-2 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'designer'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Personalizza Grafica & Nome
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ios_instructions')}
            className={`pb-2 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'ios_instructions'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone size={12} className="text-emerald-400" />
            <span>Come installare su iPhone & iPad</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {activeTab === 'designer' ? (
            <>
              {/* Row 1: iOS Screen Mock-up & Name Field */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800">
                {/* iPhone / iPad Home Screen Mock-up */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-2xl border-2 border-slate-700 flex flex-col items-center justify-center p-3 shadow-xl">
                    {/* Simulated iOS Wallpaper Grid dots */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] rounded-2xl" />

                    {/* Apple Retina App Icon */}
                    <div className="relative group cursor-pointer">
                      <img
                        src={iconDataUri}
                        alt="Icona iOS"
                        className="w-16 h-16 rounded-[18px] shadow-[0_8px_20px_rgba(0,0,0,0.6)] ring-1 ring-white/20 transition-transform group-hover:scale-105"
                      />
                      {/* iOS Badge */}
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow">
                        1
                      </span>
                    </div>

                    {/* iOS App Label beneath the icon */}
                    <span className="mt-2 text-[10.5px] font-medium text-white/90 text-center tracking-tight truncate max-w-[120px] drop-shadow">
                      {(appName || '').trim() || 'MisterTactics'}
                    </span>
                    <span className="text-[8px] text-emerald-400 font-mono">
                      Schermata Home iOS
                    </span>
                  </div>
                </div>

                {/* Name & Club Customization */}
                <div className="md:col-span-7 space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-white block mb-1">
                      Nome dell&apos;Applicazione / Club:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="Es. AC Milan Academy, Mister Rossi..."
                        maxLength={24}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={handleResetToDefault}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-[10.5px] flex items-center gap-1"
                        title="Ripristina MisterTactics"
                      >
                        <RotateCcw size={11} /> Reset
                      </button>
                    </div>
                    <p className="text-[9.5px] text-slate-400 mt-1">
                      Questo nome sostituirà &quot;MisterTactics&quot; nel titolo, nell&apos;intestazione e sotto l&apos;icona su iPhone e iPad.
                    </p>
                  </div>

                  {/* Glass Reflect Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-300">
                      Riflesso di luce Apple Glass Glossy
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasGlossReflect(!hasGlossReflect)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        hasGlossReflect ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          hasGlossReflect ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Symbol Selection or Upload Logo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-400" />
                    <span>Scegli Simbolo o Carica Stemma del Tuo Club</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10.5px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <Upload size={12} />
                    <span>Carica Stemma Ufficiale (PNG/JPG)</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {SYMBOLS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedSymbol(s.id);
                        setCustomLogoUrl(undefined);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        selectedSymbol === s.id && !customLogoUrl
                          ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-base">{s.emoji}</span>
                      <span className="font-bold text-[11px] text-white truncate">{s.label}</span>
                    </button>
                  ))}
                </div>

                {customLogoUrl && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-600/40 text-[10.5px]">
                    <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                      <Check size={13} /> Stemma personalizzato caricato e attivo!
                    </span>
                    <button
                      type="button"
                      onClick={() => setCustomLogoUrl(undefined)}
                      className="text-red-400 hover:text-red-300 font-bold"
                    >
                      Rimuovi Stemma
                    </button>
                  </div>
                )}
              </div>

              {/* Row 3: Colors & Gradient Themes */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Palette size={13} className="text-emerald-400" />
                  <span>Sfondo & Colori Ufficiali del Club</span>
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {APP_ICON_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        selectedThemeId === theme.id
                          ? 'border-emerald-400 ring-2 ring-emerald-400/30 bg-slate-800'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-lg border border-white/20 shrink-0 shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                        }}
                      />
                      <span className="font-semibold text-[10.5px] text-white truncate">
                        {theme.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Tab 2: Step-by-Step iOS & iPad instructions */
            <div className="space-y-4 py-2">
              <div className="p-3 bg-emerald-950/40 border border-emerald-600/40 rounded-xl">
                <h3 className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Smartphone size={14} /> Come salvare l&apos;app su Schermata Home di iPhone o iPad
                </h3>
                <p className="text-[11px] text-slate-300">
                  Una volta salvata l&apos;icona personalizzata qui sopra, segui questi 3 semplici passaggi in Safari per vederla sul tuo dispositivo:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-white text-xs">Apri in Safari</h4>
                  <p className="text-[10px] text-slate-400">
                    Apri il link della tua lavagna tattica nel browser Safari su iPhone o iPad.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-white text-xs">Tocca &quot;Condividi&quot;</h4>
                  <p className="text-[10px] text-slate-400">
                    Tocca il pulsante di Condivisione (icona quadrata con la freccia verso l&apos;alto ⎋) nella barra degli strumenti in basso su iPhone o in alto su iPad.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-white text-xs">Aggiungi a Home</h4>
                  <p className="text-[10px] text-slate-400">
                    Scorri verso il basso e tocca &quot;Aggiungi a schermata Home&quot;. Vedrai comparire la tua icona e il tuo nome personalizzati. Tocca &quot;Aggiungi&quot;!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadIcon}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Scarica Icona PNG (180x180)</span>
            <span className="sm:hidden">Scarica PNG</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Chiudi
            </button>
            <button
              type="button"
              onClick={handleApplyAndSave}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              {isSaved ? <Check size={14} className="text-emerald-200" /> : <Sparkles size={14} />}
              <span>{isSaved ? 'Applicato & Salvato!' : 'Salva & Applica a iOS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
