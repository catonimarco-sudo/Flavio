import React, { useState, useRef, useEffect } from 'react';
import { AppBrandConfig } from '../types';
import {
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Palette,
  RotateCcw,
  Sparkles,
  Trash2,
  Sliders,
  User,
} from 'lucide-react';

interface BrandCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandConfig: AppBrandConfig;
  onSaveBrand: (config: AppBrandConfig) => void;
  onResetToDefault: () => void;
}

const PRESET_EMOJIS = [
  '⚽', '🛡️', '🏆', '📋', '⚡', '🎯', '🦅', '🦁', '🐺', '🌟', '🏟️', '👟', '🧤', '🔥'
];

const PRESET_HIGHLIGHT_COLORS = [
  { name: 'Smeraldo Lab', hex: '#34d399' },
  { name: 'Verde Brillante', hex: '#22c55e' },
  { name: 'Azzurro Reale', hex: '#38bdf8' },
  { name: 'Blu Elettrico', hex: '#60a5fa' },
  { name: 'Giallo Oro', hex: '#facc15' },
  { name: 'Arancione Sole', hex: '#fb923c' },
  { name: 'Rosso Fuoco', hex: '#f87171' },
  { name: 'Viola Neon', hex: '#c084fc' },
  { name: 'Rosa Shocking', hex: '#f472b6' },
  { name: 'Bianco Puro', hex: '#ffffff' },
];

const PRESET_BG_COLORS = [
  { name: 'Verde Smeraldo', gradient: 'from-emerald-500 to-emerald-700', hex: '#059669' },
  { name: 'Blu Reale', gradient: 'from-blue-600 to-indigo-800', hex: '#2563eb' },
  { name: 'Azzurro Mare', gradient: 'from-cyan-500 to-blue-600', hex: '#0284c7' },
  { name: 'Viola Profondo', gradient: 'from-purple-600 to-indigo-950', hex: '#7c3aed' },
  { name: 'Rosso Granata', gradient: 'from-rose-600 to-red-900', hex: '#dc2626' },
  { name: 'Arancio Energia', gradient: 'from-orange-500 to-amber-700', hex: '#ea580c' },
  { name: 'Giallo Oro', gradient: 'from-amber-400 to-yellow-600', hex: '#d97706' },
  { name: 'Nero Carbone', gradient: 'from-slate-700 to-slate-900', hex: '#1e293b' },
];

export const BrandCustomizerModal: React.FC<BrandCustomizerModalProps> = ({
  isOpen,
  onClose,
  brandConfig,
  onSaveBrand,
  onResetToDefault,
}) => {
  const [namePart1, setNamePart1] = useState(brandConfig.namePart1);
  const [namePart2, setNamePart2] = useState(brandConfig.namePart2);
  const [highlightColor, setHighlightColor] = useState(brandConfig.highlightColor);
  const [subtitle, setSubtitle] = useState(brandConfig.subtitle);
  const [iconType, setIconType] = useState<'preset' | 'custom_image'>(brandConfig.iconType);
  const [presetEmoji, setPresetEmoji] = useState(brandConfig.presetEmoji);
  const [presetBgColor, setPresetBgColor] = useState(brandConfig.presetBgColor);
  const [customImageUrl, setCustomImageUrl] = useState(brandConfig.customImageUrl || '');
  const [coachName, setCoachName] = useState(brandConfig.coachName || 'Mister Catoni');
  const [coachRole, setCoachRole] = useState(brandConfig.coachRole || 'UEFA B • Under 13');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNamePart1(brandConfig.namePart1);
    setNamePart2(brandConfig.namePart2);
    setHighlightColor(brandConfig.highlightColor);
    setSubtitle(brandConfig.subtitle);
    setIconType(brandConfig.iconType);
    setPresetEmoji(brandConfig.presetEmoji);
    setPresetBgColor(brandConfig.presetBgColor);
    setCustomImageUrl(brandConfig.customImageUrl || '');
    setCoachName(brandConfig.coachName || 'Mister Catoni');
    setCoachRole(brandConfig.coachRole || 'UEFA B • Under 13');
  }, [brandConfig, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 4MB for localStorage)
    if (file.size > 4 * 1024 * 1024) {
      alert("L'immagine selezionata è superiore a 4MB. Scegli un'immagine più leggera.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomImageUrl(event.target.result);
        setIconType('custom_image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBrand({
      namePart1: namePart1.trim() || 'Coach',
      namePart2: namePart2.trim(),
      highlightColor,
      subtitle: subtitle.trim() || 'ALLENARE CON METODO',
      iconType,
      presetEmoji: presetEmoji.trim() || '⚽',
      presetBgColor,
      customImageUrl: customImageUrl.trim(),
      coachName: coachName.trim() || 'Mister',
      coachRole: coachRole.trim() || 'Allenatore',
    });
    onClose();
  };

  const handleReset = () => {
    if (confirm('Vuoi ripristinare il logo e il nome predefiniti "Coach Lab"?')) {
      onResetToDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Personalizza Brand & Logo</h2>
              <p className="text-xs text-slate-400">
                Modifica il nome dell'app, carica il tuo stemma sociale o cambia l'icona
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* LIVE PREVIEW BOX */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
              Anteprima Barra Laterale
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800/80 rounded-xl flex items-center gap-3">
              {/* Logo / Icon */}
              {iconType === 'custom_image' && customImageUrl ? (
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center shadow-lg shrink-0">
                  <img
                    src={customImageUrl}
                    alt="Logo"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
              ) : (
                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shrink-0 border border-white/20 text-2xl transition-all"
                  style={{ backgroundColor: presetBgColor }}
                >
                  <span>{presetEmoji}</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="min-w-0 flex-1">
                <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                  <span>{namePart1 || 'Coach'}</span>
                  {namePart2 && (
                    <span style={{ color: highlightColor }}>
                      {namePart2}
                    </span>
                  )}
                </div>
                <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mt-1 font-mono">
                  {subtitle || 'ALLENARE CON METODO'}
                </div>
              </div>
            </div>
          </div>

          {/* NAME & HIGHLIGHT INPUT */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Prima Parola / Prefisso
                </label>
                <input
                  type="text"
                  value={namePart1}
                  onChange={(e) => setNamePart1(e.target.value)}
                  placeholder="es. Coach, Mister, Academy..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none placeholder-slate-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Seconda Parola (In Evidenza)
                </label>
                <input
                  type="text"
                  value={namePart2}
                  onChange={(e) => setNamePart2(e.target.value)}
                  placeholder="es. Lab, Flavio, Tactics..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:border-emerald-500 focus:outline-none placeholder-slate-500 font-bold"
                  style={{ color: highlightColor }}
                />
              </div>
            </div>

            {/* Highlight color picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Colore Parola in Evidenza</span>
                <span className="text-[11px] font-mono" style={{ color: highlightColor }}>
                  {highlightColor}
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setHighlightColor(c.hex)}
                    className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                      highlightColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-110 shadow'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {highlightColor.toLowerCase() === c.hex.toLowerCase() && (
                      <Check size={12} className={c.hex === '#ffffff' ? 'text-black' : 'text-white'} />
                    )}
                  </button>
                ))}
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                  title="Scegli colore personalizzato"
                />
              </div>
            </div>

            {/* Slogan / Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Slogan / Sottotitolo
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="es. ALLENARE CON METODO, SCUOLA CALCIO..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs uppercase font-mono tracking-wider focus:border-emerald-500 focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          {/* LOGO & ICON SELECTION */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-200">
              Stemma & Icona Applicazione
            </label>

            {/* Switch between Preset and Custom Image */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setIconType('preset')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  iconType === 'preset'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚽ Icona con Simbolo</span>
              </button>

              <button
                type="button"
                onClick={() => setIconType('custom_image')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  iconType === 'custom_image'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload size={14} />
                <span>Carica Tuo Logo</span>
              </button>
            </div>

            {/* Custom Image Upload Section */}
            {iconType === 'custom_image' ? (
              <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="hidden"
                />

                {customImageUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden p-1 shrink-0">
                      <img
                        src={customImageUrl}
                        alt="Logo caricato"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white">Logo caricato con successo</div>
                      <p className="text-[11px] text-slate-400">
                        Viene visualizzato al posto dell'icona predefinita.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cambia immagine
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomImageUrl('');
                            setIconType('preset');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Rimuovi
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900/80"
                  >
                    <Upload size={24} className="mx-auto text-emerald-400 mb-2" />
                    <div className="text-xs font-bold text-white">
                      Clicca qui per caricare il tuo logo societario
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Supporta PNG con trasparenza, JPG, SVG o WebP
                    </div>
                  </div>
                )}

                {/* Direct Image URL input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Oppure inserisci URL immagine diretta (https://...):
                  </label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => {
                      setCustomImageUrl(e.target.value);
                      if (e.target.value) setIconType('custom_image');
                    }}
                    placeholder="https://mio-club.it/logo.png"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none placeholder-slate-600"
                  />
                </div>
              </div>
            ) : (
              /* Preset Emoji & Color Section */
              <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {/* Emojis */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-1.5">Scegli Simbolo</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setPresetEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                          presetEmoji === emoji
                            ? 'bg-emerald-600 text-white shadow-md scale-110'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                    <div className="flex items-center gap-1.5 ml-1">
                      <input
                        type="text"
                        value={presetEmoji}
                        onChange={(e) => setPresetEmoji(e.target.value)}
                        placeholder="Simbolo"
                        maxLength={4}
                        className="w-14 px-2 py-1.5 text-center text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                        title="Inserisci qualsiasi emoji o sigla personalizzata"
                      />
                    </div>
                  </div>
                </div>

                {/* Sfondo Icona */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-1.5">Colore Sfondo Icona</div>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_BG_COLORS.map((bg) => (
                      <button
                        key={bg.hex}
                        type="button"
                        onClick={() => setPresetBgColor(bg.hex)}
                        className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                          presetBgColor.toLowerCase() === bg.hex.toLowerCase()
                            ? 'border-white scale-110 shadow'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: bg.hex }}
                        title={bg.name}
                      >
                        {presetBgColor.toLowerCase() === bg.hex.toLowerCase() && (
                          <Check size={12} className="text-white" />
                        )}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={presetBgColor}
                      onChange={(e) => setPresetBgColor(e.target.value)}
                      className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                      title="Scegli colore personalizzato"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* COACH PROFILE FOOTER SECTION */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <User size={14} className="text-emerald-400" />
              <span>Profilo Mister (Visualizzato in basso a sinistra)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Nome & Titolo Allenatore
                </label>
                <input
                  type="text"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  placeholder="es. Mister Flavio, Mister Catoni..."
                  className="w-full px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Qualifica / Categoria Assegnata
                </label>
                <input
                  type="text"
                  value={coachRole}
                  onChange={(e) => setCoachRole(e.target.value)}
                  placeholder="es. UEFA B • Under 15, Prima Squadra..."
                  className="w-full px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Ripristina Predefiniti</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <Check size={16} />
                <span>Salva Brand & Logo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
