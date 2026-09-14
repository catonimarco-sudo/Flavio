import React, { useState, useRef, useEffect } from 'react';
import {
  JerseyPattern,
  CustomJerseyConfig,
  generateJerseySvgDataUri,
  FAMOUS_KIT_PRESETS,
} from '../utils/jerseyGenerator';
import { KIT_COLOR_PRESETS } from '../utils/kitVisuals';
import {
  X,
  Shirt,
  Sparkles,
  Upload,
  Check,
  Palette,
  Shield,
  Layers,
  Copy,
  Users,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { PlacedPlayer } from '../types';

interface KitCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer?: PlacedPlayer | null;
  activePlayer?: PlacedPlayer | null;
  players?: PlacedPlayer[];
  onApplyKitToTeam?: (
    team: 'home' | 'away' | 'jolly' | 'keeper' | 'referee',
    kitUrl: string,
    primaryColor: string,
    secondaryColor: string
  ) => void;
  onApplyToTeam?: (
    team: 'home' | 'away' | 'jolly' | 'keeper' | 'referee',
    kitUrl: string,
    primaryColor: string,
    secondaryColor: string
  ) => void;
  onApplyKitToPlayer?: (
    playerId: string,
    kitUrl: string,
    primaryColor: string,
    secondaryColor: string
  ) => void;
  onApplyToPlayer?: (
    playerId: string,
    kitUrl: string,
    primaryColor: string,
    secondaryColor: string
  ) => void;
}

const PATTERNS: { id: JerseyPattern; label: string; desc: string }[] = [
  { id: 'solid', label: 'Tinta Unita', desc: 'Classica pulita' },
  { id: 'stripes_vertical', label: 'Strisce Verticali', desc: 'Stile Milan, Inter, Juve' },
  { id: 'stripes_horizontal', label: 'Strisce Orizzontali', desc: 'Stile Celtic, Sporting' },
  { id: 'sash', label: 'Fascia Diagonale', desc: 'Stile River Plate, Monaco' },
  { id: 'halves', label: 'A Metà', desc: 'Bicolore stile Genoa' },
  { id: 'pinstripes', label: 'Gessato Pinstripes', desc: 'Righe sottili stile Roma' },
  { id: 'checkered', label: 'A Scacchi', desc: 'Stile Croazia' },
  { id: 'raglan', label: 'Maniche Contrasto', desc: 'Stile Arsenal, West Ham' },
];

const TRIM_COLORS = [
  { label: 'Oro', hex: '#fbbf24' },
  { label: 'Bianco', hex: '#ffffff' },
  { label: 'Nero', hex: '#0f172a' },
  { label: 'Giallo', hex: '#facc15' },
  { label: 'Rosso', hex: '#dc2626' },
  { label: 'Azzurro', hex: '#38bdf8' },
];

export const KitCustomizerModal: React.FC<KitCustomizerModalProps> = ({
  isOpen,
  onClose,
  selectedPlayer,
  activePlayer,
  players: _players,
  onApplyKitToTeam,
  onApplyToTeam,
  onApplyKitToPlayer,
  onApplyToPlayer,
}) => {
  const currentTargetPlayer = selectedPlayer || activePlayer || null;
  const applyKitToTeamFn = onApplyKitToTeam || onApplyToTeam;
  const applyKitToPlayerFn = onApplyKitToPlayer || onApplyToPlayer;

  const [target, setTarget] = useState<'home' | 'away' | 'keeper' | 'player'>(
    currentTargetPlayer ? 'player' : 'home'
  );

  useEffect(() => {
    if (currentTargetPlayer) {
      setTarget('player');
    }
  }, [currentTargetPlayer]);

  const [pattern, setPattern] = useState<JerseyPattern>('pinstripes');
  const [primaryColor, setPrimaryColor] = useState<string>('#861726');
  const [secondaryColor, setSecondaryColor] = useState<string>('#f59e0b');
  const [trimColor, setTrimColor] = useState<string>('#fbbf24');
  const [sponsorText, setSponsorText] = useState<string>('SPQR');
  const [crestType, setCrestType] = useState<'shield' | 'scudetto' | 'circle' | 'star' | 'none'>('scudetto');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | undefined>(undefined);
  const [uploadedTextureUrl, setUploadedTextureUrl] = useState<string | undefined>(undefined);
  const [customSavedKits, setCustomSavedKits] = useState<CustomJerseyConfig[]>(() => {
    try {
      const saved = localStorage.getItem('mistertactics_custom_kits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Active current generated SVG URI
  const currentConfig: CustomJerseyConfig = {
    name: 'Kit Personalizzato',
    pattern,
    primaryColor,
    secondaryColor,
    trimColor,
    sponsorText,
    crestType,
    customLogoUrl,
  };

  const previewKitUrl = uploadedTextureUrl || generateJerseySvgDataUri(currentConfig);

  const handleApply = () => {
    if (target === 'player' && currentTargetPlayer) {
      if (typeof applyKitToPlayerFn === 'function') {
        applyKitToPlayerFn(currentTargetPlayer.id, previewKitUrl, primaryColor, secondaryColor);
      }
    } else {
      const team = target === 'player' ? 'home' : target;
      if (typeof applyKitToTeamFn === 'function') {
        applyKitToTeamFn(team, previewKitUrl, primaryColor, secondaryColor);
      }
    }
    onClose();
  };

  const handleSaveToMyKits = () => {
    const newKit: CustomJerseyConfig = {
      ...currentConfig,
      id: `custom-kit-${Date.now()}`,
      name: sponsorText.trim() ? `Kit ${sponsorText.trim()}` : `Kit ${pattern}`,
    };
    const updated = [newKit, ...customSavedKits.slice(0, 11)];
    setCustomSavedKits(updated);
    try {
      localStorage.setItem('mistertactics_custom_kits', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectPreset = (preset: CustomJerseyConfig) => {
    setPattern(preset.pattern);
    setPrimaryColor(preset.primaryColor);
    setSecondaryColor(preset.secondaryColor);
    setTrimColor(preset.trimColor);
    setSponsorText(preset.sponsorText || '');
    setCrestType(preset.crestType || 'shield');
    setCustomLogoUrl(preset.customLogoUrl);
    setUploadedTextureUrl(undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedTextureUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomLogoUrl(ev.target.result as string);
          setUploadedTextureUrl(undefined);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      id="kit-customizer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="kit-customizer-modal-card"
        className="relative w-full max-w-2xl bg-[#0b1120] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-sm">
              <Shirt size={17} />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                <span>Personalizza Maglie & Divise Squadra</span>
              </h2>
              <p className="text-[10px] text-slate-400">
                Disegna texture, strisce, colletti, sponsor o carica stemmi reali del club
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* Top Row: Interactive Live Preview & Target Squad Selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800">
            {/* Live Jersey Preview */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-36 h-28 sm:w-44 sm:h-32 bg-[#060a12] rounded-xl border-2 border-slate-800 flex items-center justify-center overflow-hidden shadow-inner group">
                <img
                  src={previewKitUrl}
                  alt="Anteprima Maglia"
                  className="w-32 sm:w-40 h-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-lg"
                />
                <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500">
                  HD 2D Texture
                </span>
              </div>
              <span className="mt-1.5 text-[10.5px] font-bold text-amber-400 tracking-wide">
                Anteprima Divisa Ufficiale
              </span>
            </div>

            {/* Target Selector */}
            <div className="md:col-span-7 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">
                A chi vuoi applicare questa maglia?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTarget('home')}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    target === 'home'
                      ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/40 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users size={14} className="text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[11px] block">Squadra Casa</span>
                    <span className="text-[9px] text-slate-500">Titolari maglia 1</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTarget('away')}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    target === 'away'
                      ? 'bg-blue-950/60 border-blue-400 ring-2 ring-blue-400/40 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users size={14} className="text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[11px] block">Squadra Ospiti</span>
                    <span className="text-[9px] text-slate-500">Divisa da trasferta</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTarget('keeper')}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    target === 'keeper'
                      ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/40 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield size={14} className="text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[11px] block">Portieri (POR)</span>
                    <span className="text-[9px] text-slate-500">Maglia portiere fluo</span>
                  </div>
                </button>

                {currentTargetPlayer ? (
                  <button
                    type="button"
                    onClick={() => setTarget('player')}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      target === 'player'
                        ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-400/40 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Shirt size={14} className="text-purple-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-[11px] block truncate">N° {currentTargetPlayer.number} {currentTargetPlayer.name}</span>
                      <span className="text-[9px] text-slate-500">Solo questo giocatore</span>
                    </div>
                  </button>
                ) : (
                  <div className="p-2 rounded-lg border border-slate-800/60 bg-slate-950/40 flex items-center text-slate-500 text-[10px]">
                    Seleziona un giocatore sul campo per vestirlo singolarmente.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 1: Pattern Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Layers size={13} className="text-amber-400" />
              <span>1. Modello & Trama della Maglia</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPattern(p.id);
                    setUploadedTextureUrl(undefined);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    pattern === p.id && !uploadedTextureUrl
                      ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="font-bold text-[11px] text-white block truncate">{p.label}</span>
                  <span className="text-[9px] text-slate-400 block truncate">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Colors Palette */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Primary Color */}
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">Colore Base</span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/40"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <div className="grid grid-cols-5 gap-1">
                {KIT_COLOR_PRESETS.slice(0, 10).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(c.hex);
                      setUploadedTextureUrl(undefined);
                    }}
                    className={`w-full aspect-square rounded-md border flex items-center justify-center transition-transform ${
                      primaryColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'ring-2 ring-white border-transparent scale-105'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  setUploadedTextureUrl(undefined);
                }}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 font-mono text-[10px] text-slate-200 text-center uppercase"
                placeholder="#HEX"
              />
            </div>

            {/* Secondary Color */}
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">Strisce / Dettagli</span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/40"
                  style={{ backgroundColor: secondaryColor }}
                />
              </div>
              <div className="grid grid-cols-5 gap-1">
                {KIT_COLOR_PRESETS.slice(0, 10).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSecondaryColor(c.hex);
                      setUploadedTextureUrl(undefined);
                    }}
                    className={`w-full aspect-square rounded-md border flex items-center justify-center transition-transform ${
                      secondaryColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'ring-2 ring-white border-transparent scale-105'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => {
                  setSecondaryColor(e.target.value);
                  setUploadedTextureUrl(undefined);
                }}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 font-mono text-[10px] text-slate-200 text-center uppercase"
                placeholder="#HEX"
              />
            </div>

            {/* Trim Collar & Cuffs Color */}
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">Colletto & Bordi</span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/40"
                  style={{ backgroundColor: trimColor }}
                />
              </div>
              <div className="grid grid-cols-6 gap-1">
                {TRIM_COLORS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      setTrimColor(c.hex);
                      setUploadedTextureUrl(undefined);
                    }}
                    className={`w-full aspect-square rounded-md border flex items-center justify-center transition-transform ${
                      trimColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'ring-2 ring-white border-transparent scale-105'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>
              <input
                type="text"
                value={trimColor}
                onChange={(e) => {
                  setTrimColor(e.target.value);
                  setUploadedTextureUrl(undefined);
                }}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 font-mono text-[10px] text-slate-200 text-center uppercase"
                placeholder="#HEX"
              />
            </div>
          </div>

          {/* Section 3: Sponsor & Stemma del Club */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sponsor Petto */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-white flex items-center justify-between">
                <span>Sponsor / Nome Club sul Petto</span>
                <span className="text-[9px] text-slate-400 font-normal">Opzionale</span>
              </label>
              <input
                type="text"
                value={sponsorText}
                onChange={(e) => {
                  setSponsorText(e.target.value);
                  setUploadedTextureUrl(undefined);
                }}
                placeholder="Es. SPQR, JEEP, ACADEMY..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-semibold text-xs uppercase tracking-wider focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Stemma / Logo Petto */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-white flex items-center justify-between">
                <span>Stemma Petto</span>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Upload size={11} /> Carica Logo PNG
                </button>
              </label>

              <div className="flex items-center gap-1.5">
                {(['scudetto', 'shield', 'circle', 'star', 'none'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setCrestType(t);
                      setCustomLogoUrl(undefined);
                      setUploadedTextureUrl(undefined);
                    }}
                    className={`flex-1 py-1 rounded-md border text-[10px] capitalize transition-colors ${
                      crestType === t && !customLogoUrl
                        ? 'bg-amber-950/60 border-amber-400 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {t === 'scudetto' ? 'Scudetto' : t === 'shield' ? 'Scudo' : t === 'circle' ? 'Cerchio' : t === 'star' ? 'Stella' : 'No'}
                  </button>
                ))}
              </div>

              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Section 4: Preset Famosi e Divise Pronte */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                <span>Divise Iconiche Pronte (1 Clic)</span>
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10.5px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
              >
                <Upload size={12} />
                <span>Carica Foto / Maglia da File</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {FAMOUS_KIT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-1.5 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/90 flex flex-col items-center gap-1 text-center group transition-all"
                >
                  <img
                    src={generateJerseySvgDataUri(preset)}
                    alt={preset.name}
                    className="w-12 h-9 object-contain group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[9px] font-semibold text-slate-300 truncate w-full">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSaveToMyKits}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Copy size={13} />
            <span>Salva tra i Miei Kit</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check size={14} strokeWidth={3} />
              <span>Applica Maglia Ora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
