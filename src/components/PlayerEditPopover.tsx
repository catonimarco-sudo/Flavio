import React, { useRef, useState } from 'react';
import { PlacedPlayer, Role } from '../types';
import { FACE_PRESETS, generateFaceSvg } from '../data/avatarPresets';
import { JERSEY_PRESETS } from '../data/jerseyPresets';
import {
  X,
  Trash2,
  RotateCw,
  RotateCcw,
  User,
  Upload,
  Check,
  Palette,
  Shirt,
  Users,
  Compass,
  Sparkles,
  Minus,
  Plus,
} from 'lucide-react';
import { KIT_COLOR_PRESETS } from '../utils/kitVisuals';

interface PlayerEditPopoverProps {
  player: PlacedPlayer | null;
  onClose: () => void;
  onUpdatePlayer: (updated: PlacedPlayer) => void;
  onRemovePlayer: (id: string) => void;
  onApplyJerseyToTeam?: (
    team: 'home' | 'away' | 'jolly' | 'keeper' | 'referee',
    jerseyUrl: string | undefined
  ) => void;
  onApplyColorToTeam?: (
    team: 'home' | 'away' | 'jolly' | 'keeper' | 'referee',
    color: string,
    secondaryColor?: string
  ) => void;
}

const ROLES: Role[] = [
  'POR',
  'DC',
  'TD',
  'TS',
  'MED',
  'CC',
  'MEZ',
  'TRQ',
  'ED',
  'ES',
  'AD',
  'AS',
  'ATT',
  'P',
  'JOL',
  'ARB',
];

const TRIM_PRESETS = [
  { id: 'gold', name: 'Oro', hex: '#fbbf24' },
  { id: 'white', name: 'Bianco', hex: '#ffffff' },
  { id: 'black', name: 'Nero', hex: '#0f172a' },
  { id: 'yellow', name: 'Giallo', hex: '#facc15' },
  { id: 'red', name: 'Rosso', hex: '#dc2626' },
];

export const PlayerEditPopover: React.FC<PlayerEditPopoverProps> = ({
  player,
  onClose,
  onUpdatePlayer,
  onRemovePlayer,
  onApplyJerseyToTeam,
  onApplyColorToTeam,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jerseyFileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<'jersey' | 'profile' | 'orientation'>('jersey');
  const [showFaceGrid, setShowFaceGrid] = useState(false);
  const [showJerseyGrid, setShowJerseyGrid] = useState(false);

  if (!player) return null;

  const currentColor =
    player.customColor ||
    (player.team === 'away'
      ? '#1d4ed8'
      : player.team === 'keeper'
      ? '#059669'
      : player.team === 'jolly'
      ? '#ea580c'
      : player.team === 'referee'
      ? '#0f172a'
      : '#861726');

  const currentSecondary =
    player.secondaryColor ||
    (currentColor === '#ffffff' || currentColor === '#f8fafc' ? '#0f172a' : '#fbbf24');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdatePlayer({
            ...player,
            photoUrl: event.target.result as string,
            avatarType: 'photo',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJerseyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdatePlayer({
            ...player,
            jerseyImageUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      id="player-edit-popover-card"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-[#0b1120] border border-slate-700/90 rounded-2xl shadow-2xl p-3 sm:p-4 sm:w-96 max-w-[calc(100vw-1.5rem)] text-xs text-slate-200 animate-in slide-in-from-bottom-5 duration-200 backdrop-blur-md max-h-[86vh] flex flex-col"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Header with Live Player Preview Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-9 h-9 rounded-full overflow-hidden border-2 flex items-center justify-center shrink-0 shadow-md relative"
            style={{
              backgroundColor: currentColor,
              borderColor: currentSecondary,
            }}
          >
            {player.photoUrl ? (
              <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <span
                className="font-black text-xs font-sans tracking-tighter"
                style={{
                  color:
                    currentColor === '#ffffff' || currentColor === '#f8fafc' || currentColor === '#eab308'
                      ? '#0f172a'
                      : '#ffffff',
                }}
              >
                {player.number}
              </span>
            )}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-sm truncate block">{player.name}</span>
              <span
                className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase border"
                style={{
                  backgroundColor: `${currentColor}33`,
                  borderColor: currentColor,
                  color: '#ffffff',
                }}
              >
                {player.team}
              </span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase">
              {player.role} • N° {player.number}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          title="Chiudi modifiche"
        >
          <X size={15} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-2.5 shrink-0">
        <button
          onClick={() => setActiveTab('jersey')}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
            activeTab === 'jersey'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shirt size={12} />
          <span>Divisa & Colori</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User size={12} />
          <span>Profilo</span>
        </button>
        <button
          onClick={() => setActiveTab('orientation')}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
            activeTab === 'orientation'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass size={12} />
          <span>Orientamento</span>
        </button>
      </div>

      {/* Tab Contents (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* ========================================================
            TAB 1: DIVISA & COLORI
            ======================================================== */}
        {activeTab === 'jersey' && (
          <div className="space-y-3">
            {/* Colore Principale della Maglia */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Palette size={13} className="text-amber-400" />
                  <span>Colore Principale Maglia</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-white/60 shadow-xs inline-block"
                    style={{ backgroundColor: currentColor }}
                  />
                  <span className="text-[10px] font-mono text-slate-300 font-bold">{currentColor}</span>
                </div>
              </div>

              {/* 10 Quick Palette Swatches */}
              <div className="grid grid-cols-5 gap-1.5">
                {KIT_COLOR_PRESETS.map((col) => {
                  const isSelected = currentColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={col.id}
                      onClick={() => {
                        onUpdatePlayer({
                          ...player,
                          customColor: col.hex,
                        });
                      }}
                      className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                          : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
                      }`}
                      title={col.name}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-white/40 shadow-xs mb-1"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[8.5px] font-semibold text-slate-300 truncate w-full text-center">
                        {col.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom HEX Picker & Team Apply */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-2 flex-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <label className="text-[10px] text-slate-400 font-medium shrink-0">Colore Libero:</label>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => onUpdatePlayer({ ...player, customColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0 shrink-0"
                    title="Seleziona colore personalizzato"
                  />
                  <input
                    type="text"
                    value={player.customColor || ''}
                    placeholder={currentColor}
                    onChange={(e) => onUpdatePlayer({ ...player, customColor: e.target.value })}
                    className="w-18 bg-transparent text-[11px] font-mono text-white focus:outline-none uppercase"
                  />
                </div>

                {onApplyColorToTeam && (
                  <button
                    onClick={() => {
                      onApplyColorToTeam(player.team, currentColor, currentSecondary);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10.5px] flex items-center gap-1 shadow-sm transition-colors shrink-0"
                    title={`Applica questo colore a tutti i giocatori della squadra ${player.team}`}
                  >
                    <Users size={12} />
                    <span>A Squadra</span>
                  </button>
                )}
              </div>
            </div>

            {/* Colore Colletto & Bordo (Secondary Trim) */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Shirt size={13} className="text-amber-400" />
                  <span>Colletto & Dettagli (Bordi)</span>
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/60 inline-block shadow-xs"
                  style={{ backgroundColor: currentSecondary }}
                />
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {TRIM_PRESETS.map((trim) => {
                  const isTrimSelected = currentSecondary.toLowerCase() === trim.hex.toLowerCase();
                  return (
                    <button
                      key={trim.id}
                      onClick={() => onUpdatePlayer({ ...player, secondaryColor: trim.hex })}
                      className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                        isTrimSelected
                          ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50'
                          : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
                      }`}
                      title={trim.name}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/40 shadow-xs mb-0.5"
                        style={{ backgroundColor: trim.hex }}
                      />
                      <span className="text-[8.5px] font-semibold text-slate-300 truncate w-full text-center">
                        {trim.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divisa Grafica Personalizzata & Sponsor */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Grafica & Sponsor Petto</span>
                </span>
                <button
                  onClick={() => setShowJerseyGrid(!showJerseyGrid)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
                >
                  {showJerseyGrid ? 'Chiudi preset' : 'Campioni Divise'}
                </button>
              </div>

              {/* Active uploaded jersey preview */}
              {player.jerseyImageUrl && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/40 border border-amber-500/40">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={player.jerseyImageUrl}
                      alt="Maglia caricata"
                      className="w-8 h-8 rounded object-cover border border-amber-400/60 bg-black shrink-0"
                    />
                    <div className="truncate">
                      <span className="text-[10.5px] font-bold text-amber-300 block truncate">
                        Maglia Grafica Attiva
                      </span>
                      <span className="text-[9px] text-slate-400">Texture visibile sul campo</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdatePlayer({ ...player, jerseyImageUrl: undefined })}
                    className="p-1 rounded hover:bg-red-950 text-slate-400 hover:text-red-300"
                    title="Rimuovi maglia personalizzata"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Preset Jersey Gallery */}
              {showJerseyGrid && (
                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 max-h-36 overflow-y-auto">
                  {JERSEY_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onUpdatePlayer({
                          ...player,
                          jerseyImageUrl: preset.imageUrl,
                          customColor: preset.primaryColor,
                          secondaryColor: preset.secondaryColor,
                        });
                      }}
                      className={`flex flex-col items-center p-1 rounded-md border transition-all text-center group ${
                        player.jerseyImageUrl === preset.imageUrl
                          ? 'bg-amber-950/40 border-amber-400'
                          : 'border-slate-800 hover:border-slate-600 bg-slate-900/60'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.imageUrl}
                        alt={preset.name}
                        className="w-10 h-7 rounded object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[8.5px] font-semibold text-slate-300 truncate w-full mt-0.5">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Actions: Upload Jersey & Apply to Squad */}
              <div className="flex items-center gap-1.5">
                <input
                  type="file"
                  ref={jerseyFileInputRef}
                  accept="image/*"
                  onChange={handleJerseyUpload}
                  className="hidden"
                />
                <button
                  onClick={() => jerseyFileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition-colors"
                >
                  <Upload size={12} />
                  <span>Carica Foto Maglia</span>
                </button>

                {onApplyJerseyToTeam && (
                  <button
                    onClick={() => onApplyJerseyToTeam(player.team, player.jerseyImageUrl)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10.5px] font-medium transition-colors shrink-0"
                    title={`Applica questa divisa a tutti i giocatori della squadra ${player.team}`}
                  >
                    <Users size={12} className="text-amber-400" />
                    <span>A Squadra</span>
                  </button>
                )}
              </div>

              {/* Sponsor Petto */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <label className="text-[10px] text-slate-400 shrink-0 font-semibold">Sponsor Petto:</label>
                <input
                  type="text"
                  placeholder="es. SPQR, Betsson, Jeep..."
                  value={player.sponsorText || ''}
                  onChange={(e) => onUpdatePlayer({ ...player, sponsorText: e.target.value })}
                  className="flex-1 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-[11px] uppercase tracking-wider font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: PROFILO GIOCATORE (Nome, Numero, Ruolo, Squadra, Foto)
            ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-3">
            {/* Name & Number Stepper */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Nome Calciatore</label>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => onUpdatePlayer({ ...player, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-amber-500"
                  placeholder="es. Dybala, Pellegrini..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">N° Maglia</label>
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 overflow-hidden">
                  <button
                    onClick={() =>
                      onUpdatePlayer({ ...player, number: Math.max(1, (player.number || 1) - 1) })
                    }
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Minus size={11} />
                  </button>
                  <input
                    type="number"
                    value={player.number}
                    onChange={(e) => onUpdatePlayer({ ...player, number: Number(e.target.value) })}
                    className="w-full bg-transparent text-white text-center font-bold font-mono focus:outline-none text-xs"
                  />
                  <button
                    onClick={() =>
                      onUpdatePlayer({ ...player, number: Math.min(99, (player.number || 1) + 1) })
                    }
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            </div>

            {/* Ruolo Tattico & Squadra */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Ruolo Tattico</label>
                <select
                  value={player.role}
                  onChange={(e) => onUpdatePlayer({ ...player, role: e.target.value as Role })}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Squadra</label>
                <select
                  value={player.team}
                  onChange={(e) => onUpdatePlayer({ ...player, team: e.target.value as any })}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                >
                  <option value="home">Casa (Bordeaux / Rosso)</option>
                  <option value="away">Ospite (Blu / Bianco)</option>
                  <option value="keeper">Portiere (Verde / Giallo)</option>
                  <option value="jolly">Jolly (Arancione)</option>
                  <option value="referee">Arbitro (Nero)</option>
                </select>
              </div>
            </div>

            {/* Volto / Avatar Calciatore */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <User size={13} className="text-amber-400" />
                  <span>Volto / Foto Calciatore</span>
                </span>
                <button
                  onClick={() => setShowFaceGrid(!showFaceGrid)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
                >
                  {showFaceGrid ? 'Nascondi preset' : 'Sfoglia Campioni'}
                </button>
              </div>

              {/* Preset Avatars */}
              {showFaceGrid && (
                <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 max-h-36 overflow-y-auto">
                  {FACE_PRESETS.map((preset) => {
                    const faceSvgUri = generateFaceSvg(preset, 40);
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onUpdatePlayer({
                            ...player,
                            photoUrl: faceSvgUri,
                            avatarType: 'photo',
                          });
                        }}
                        className="flex flex-col items-center p-1 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors group"
                        title={preset.name}
                      >
                        <img
                          src={faceSvgUri}
                          alt={preset.name}
                          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 group-hover:border-amber-400"
                        />
                        <span className="text-[8.5px] text-slate-400 truncate w-full text-center mt-0.5">
                          {preset.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Upload Photo or Random Avatar */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                >
                  <Upload size={12} />
                  <span>Carica Foto Reale</span>
                </button>

                <button
                  onClick={() => {
                    const randomPreset = FACE_PRESETS[Math.floor(Math.random() * FACE_PRESETS.length)];
                    onUpdatePlayer({
                      ...player,
                      photoUrl: generateFaceSvg(randomPreset),
                      avatarType: 'photo',
                    });
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] border border-slate-700 transition-colors"
                  title="Assegna volto realistico casuale"
                >
                  Avatar 🎲
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ORIENTAMENTO & ROTAZIONE (360°)
            ======================================================== */}
        {activeTab === 'orientation' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Compass size={13} className="text-amber-400" />
                  <span>Orientamento Sguardo Calciatore</span>
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {player.rotation || 0}°
                </span>
              </div>

              {/* Quick -45° / +45° Step Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const newRot = (((player.rotation || 0) - 45) % 360 + 360) % 360;
                    onUpdatePlayer({ ...player, rotation: Math.round(newRot) });
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold active:scale-95 transition-all shadow-sm"
                  title="Gira a Sinistra di 45°"
                >
                  <RotateCcw size={13} className="text-amber-400" />
                  <span>◀ Sinistra (-45°)</span>
                </button>

                <button
                  onClick={() => {
                    const newRot = (((player.rotation || 0) + 45) % 360 + 360) % 360;
                    onUpdatePlayer({ ...player, rotation: Math.round(newRot) });
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold active:scale-95 transition-all shadow-sm"
                  title="Gira a Destra di 45°"
                >
                  <span>Destra (+45°) ▶</span>
                  <RotateCw size={13} className="text-amber-400" />
                </button>
              </div>

              {/* 4 Cardinal Directions */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Fronte', deg: 0 },
                  { label: 'Destra', deg: 90 },
                  { label: 'Retro', deg: 180 },
                  { label: 'Sinistra', deg: 270 },
                ].map(({ label, deg }) => (
                  <button
                    key={label}
                    onClick={() => onUpdatePlayer({ ...player, rotation: deg })}
                    className={`py-1.5 rounded-lg text-[10.5px] font-bold border transition-all ${
                      (player.rotation || 0) === deg
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Continuous Angle Slider */}
              <div className="pt-1">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={player.rotation || 0}
                  onChange={(e) => onUpdatePlayer({ ...player, rotation: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-2 bg-slate-950 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popover Footer: Remove Player & Done Confirmation */}
      <div className="pt-2.5 mt-2.5 border-t border-slate-800 flex items-center justify-between shrink-0">
        <button
          onClick={() => onRemovePlayer(player.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-[11px] transition-colors"
        >
          <Trash2 size={13} />
          <span>Rimuovi dal Campo</span>
        </button>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-colors"
        >
          <Check size={14} />
          <span>Fatto</span>
        </button>
      </div>
    </div>
  );
};
