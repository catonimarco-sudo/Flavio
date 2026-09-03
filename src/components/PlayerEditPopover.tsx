import React, { useRef, useState } from 'react';
import { PlacedPlayer, Role } from '../types';
import { FACE_PRESETS, generateFaceSvg } from '../data/avatarPresets';
import { JERSEY_PRESETS, JerseyPreset } from '../data/jerseyPresets';
import { X, Trash2, RotateCw, RotateCcw, User, Upload, Check, Palette, Shirt, Users, Compass, Sparkles } from 'lucide-react';

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
    color: string
  ) => void;
  onOpen3DStudio?: (player: PlacedPlayer) => void;
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

const COLOR_PRESETS = [
  { name: 'Roma Bordeaux', hex: '#861726' },
  { name: 'Azzurro', hex: '#1d4ed8' },
  { name: 'Bianco', hex: '#f8fafc' },
  { name: 'Nero', hex: '#0f172a' },
  { name: 'Giallo Oro', hex: '#eab308' },
  { name: 'Verde Portiere', hex: '#059669' },
  { name: 'Arancione Fluo', hex: '#ea580c' },
  { name: 'Rosso Fuoco', hex: '#dc2626' },
];

export const PlayerEditPopover: React.FC<PlayerEditPopoverProps> = ({
  player,
  onClose,
  onUpdatePlayer,
  onRemovePlayer,
  onApplyJerseyToTeam,
  onApplyColorToTeam,
  onOpen3DStudio,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jerseyFileInputRef = useRef<HTMLInputElement | null>(null);
  const [showFaceGrid, setShowFaceGrid] = useState(false);
  const [showJerseyGrid, setShowJerseyGrid] = useState(false);

  if (!player) return null;

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
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-[#0b1120] border border-slate-700/80 rounded-2xl shadow-2xl p-3.5 sm:p-4 sm:w-88 max-w-[calc(100vw-2rem)] text-xs text-slate-200 animate-in slide-in-from-bottom-5 duration-200 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-amber-500/80 flex items-center justify-center flex-shrink-0 shadow-inner">
            {player.photoUrl ? (
              <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-amber-400 text-xs font-mono">{player.number}</span>
            )}
          </div>
          <div>
            <span className="font-bold text-white text-sm truncate block">{player.name}</span>
            <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase">{player.role} • N° {player.number}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
        {/* Name & Number */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Nome Giocatore</label>
            <input
              type="text"
              value={player.name}
              onChange={(e) => onUpdatePlayer({ ...player, name: e.target.value })}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">N° Maglia</label>
            <input
              type="number"
              value={player.number}
              onChange={(e) => onUpdatePlayer({ ...player, number: Number(e.target.value) })}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-center font-bold focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Role & Team */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Ruolo</label>
            <select
              value={player.role}
              onChange={(e) => onUpdatePlayer({ ...player, role: e.target.value as Role })}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-medium"
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
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-medium"
            >
              <option value="home">Casa (Bordeaux / Rosso)</option>
              <option value="away">Ospite (Bianco)</option>
              <option value="keeper">Portiere (Verde / Arancione)</option>
              <option value="jolly">Jolly (Giallo)</option>
              <option value="referee">Arbitro (Nero)</option>
            </select>
          </div>
        </div>

        {/* Custom Jersey & Shirt Upload Section */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
              <Shirt size={12} className="text-amber-400" /> Maglia Divisa & Grafica
            </span>
            <button
              onClick={() => setShowJerseyGrid(!showJerseyGrid)}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5"
            >
              {showJerseyGrid ? 'Chiudi preset' : 'Campioni Divise'}
            </button>
          </div>

          {/* Uploaded Jersey active badge / preview */}
          {player.jerseyImageUrl && (
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={player.jerseyImageUrl}
                  alt="Maglia caricata"
                  className="w-7 h-7 rounded object-cover border border-amber-400/60 bg-black flex-shrink-0"
                />
                <div className="truncate">
                  <span className="text-[10.5px] font-bold text-amber-300 block truncate">
                    Maglia Personalizzata Attiva
                  </span>
                  <span className="text-[9px] text-slate-400">Texture grafica visibile sul campo</span>
                </div>
              </div>
              <button
                onClick={() => onUpdatePlayer({ ...player, jerseyImageUrl: undefined })}
                className="p-1 rounded hover:bg-red-950 text-slate-400 hover:text-red-300"
                title="Rimuovi maglia personalizzata"
              >
                <X size={12} />
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

          {/* Action buttons: Upload Jersey Image & Apply to Squad */}
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
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition-colors"
            >
              <Upload size={12} />
              <span>Carica Foto Maglia</span>
            </button>

            {/* Apply Jersey to All Players on the Same Team */}
            {onApplyJerseyToTeam && (
              <button
                onClick={() => onApplyJerseyToTeam(player.team, player.jerseyImageUrl)}
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10.5px] font-medium transition-colors"
                title={`Applica questa divisa a tutti i giocatori della squadra ${player.team}`}
              >
                <Users size={12} className="text-amber-400" />
                <span>A Squadra</span>
              </button>
            )}
          </div>

          {/* Color Presets & Sponsor */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <Palette size={12} className="text-amber-400" /> Colore Maglia & Divisa:
              </span>
              <div className="flex items-center gap-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/50 inline-block shadow-xs"
                  style={{ backgroundColor: player.customColor || (player.team === 'away' ? '#1d4ed8' : '#eab308') }}
                />
                <span className="text-[9.5px] text-slate-400 font-mono">
                  {player.customColor || (player.team === 'away' ? '#1d4ed8' : '#eab308')}
                </span>
              </div>
            </div>

            {/* Quick Color Presets */}
            <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              {KIT_COLOR_PRESETS.map((col) => {
                const isActive = (player.customColor?.toLowerCase() === col.hex.toLowerCase()) ||
                  (!player.customColor && player.team === 'home' && col.id === 'yellow') ||
                  (!player.customColor && player.team === 'away' && col.id === 'blue');
                return (
                  <button
                    key={col.id}
                    onClick={() => onUpdatePlayer({ ...player, customColor: col.hex })}
                    className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                        : 'border-slate-800 hover:border-slate-600 bg-slate-900/60'
                    }`}
                    title={col.name}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-white/40 shadow-xs mb-1"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-[8px] font-bold text-slate-300 truncate w-full text-center">
                      {col.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom HEX Color Picker & Apply to Team */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 flex-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <label className="text-[10px] text-slate-400 font-medium">Personalizzato:</label>
                <input
                  type="color"
                  value={player.customColor || (player.team === 'away' ? '#1d4ed8' : '#eab308')}
                  onChange={(e) => onUpdatePlayer({ ...player, customColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                  title="Scegli colore personalizzato"
                />
                <span className="text-[10px] font-mono text-slate-300 font-bold">
                  {player.customColor || 'Default'}
                </span>
              </div>

              {onApplyColorToTeam && (
                <button
                  onClick={() => {
                    const colorToApply = player.customColor || (player.team === 'away' ? '#1d4ed8' : '#eab308');
                    onApplyColorToTeam(player.team, colorToApply);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition-colors"
                  title={`Applica questo colore a tutti i giocatori della squadra ${player.team}`}
                >
                  <Users size={12} />
                  <span>A Squadra</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <label className="text-[10px] text-slate-400 flex-shrink-0 font-medium">Sponsor Petto:</label>
              <input
                type="text"
                placeholder="es. SPQR, Betsson..."
                value={player.sponsorText || ''}
                onChange={(e) => onUpdatePlayer({ ...player, sponsorText: e.target.value })}
                className="flex-1 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-white text-[11px] uppercase tracking-wider font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Orientation / Rotation */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <RotateCw size={11} /> Sguardo / Orientamento
            </label>
            <span className="text-[10px] font-mono text-slate-400">{player.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={player.rotation || 0}
            onChange={(e) => onUpdatePlayer({ ...player, rotation: Number(e.target.value) })}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Realistic Face Selection & Photo Upload */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <User size={11} className="text-amber-400" /> Volto Realistico / Avatar
            </label>
            <button
              onClick={() => setShowFaceGrid(!showFaceGrid)}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
            >
              {showFaceGrid ? 'Nascondi preset' : 'Sfoglia Campioni'}
            </button>
          </div>

          {/* Quick preset gallery */}
          {showFaceGrid && (
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 mb-2 max-h-36 overflow-y-auto">
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
                    <img src={faceSvgUri} alt={preset.name} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 group-hover:border-amber-400" />
                    <span className="text-[8.5px] text-slate-400 truncate w-full text-center mt-0.5">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

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
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-blue-600/90 hover:bg-blue-600 text-white font-medium text-[11px]"
            >
              <Upload size={12} />
              <span>Carica Foto</span>
            </button>

            {/* Quick avatar cycle */}
            <button
              onClick={() => {
                const randomPreset =
                  FACE_PRESETS[Math.floor(Math.random() * FACE_PRESETS.length)];
                onUpdatePlayer({
                  ...player,
                  photoUrl: generateFaceSvg(randomPreset),
                  avatarType: 'photo',
                });
              }}
              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] border border-slate-700"
              title="Assegna volto realistico casuale"
            >
              Avatar 🎲
            </button>
          </div>
        </div>

        {/* Orientamento del Calciatore (Gira a Sinistra / Destra) */}
        <div className="pt-2.5 pb-1 border-t border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={13} />
              <span>Orientamento (Gira Sx / Dx)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-300 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              {player.rotation || 0}°
            </span>
          </div>

          {/* Quick Rotate Buttons */}
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <button
              onClick={() => {
                const newRot = (((player.rotation || 0) - 45) % 360 + 360) % 360;
                onUpdatePlayer({ ...player, rotation: Math.round(newRot) });
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold active:scale-95 transition-all shadow-sm"
              title="Gira a Sinistra di 45°"
            >
              <RotateCcw size={13} className="text-amber-400" />
              <span>◀ Gira Sinistra (-45°)</span>
            </button>

            <button
              onClick={() => {
                const newRot = (((player.rotation || 0) + 45) % 360 + 360) % 360;
                onUpdatePlayer({ ...player, rotation: Math.round(newRot) });
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold active:scale-95 transition-all shadow-sm"
              title="Gira a Destra di 45°"
            >
              <span>Gira Destra (+45°) ▶</span>
              <RotateCw size={13} className="text-amber-400" />
            </button>
          </div>

          {/* 4 Cardinal Perspectives */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            {[
              { label: 'Fronte', deg: 0 },
              { label: 'Destra', deg: 90 },
              { label: 'Retro', deg: 180 },
              { label: 'Sinistra', deg: 270 },
            ].map(({ label, deg }) => (
              <button
                key={label}
                onClick={() => onUpdatePlayer({ ...player, rotation: deg })}
                className={`py-1 rounded text-[10px] font-semibold border transition-all ${
                  (player.rotation || 0) === deg
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Continuous Angle Slider */}
          <div className="mb-2 flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={player.rotation || 0}
              onChange={(e) => onUpdatePlayer({ ...player, rotation: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          {/* Open in 3D HD Studio Button */}
          {onOpen3DStudio && (
            <button
              onClick={() => onOpen3DStudio(player)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/40 border border-amber-500/50 text-amber-300 font-bold text-xs transition-all shadow-sm mb-1"
            >
              <Sparkles size={13} />
              <span>Apri Studio 3D HD (Alta Definizione)</span>
            </button>
          )}
        </div>

        {/* Delete / Remove Action */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onRemovePlayer(player.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-semibold text-[11px]"
          >
            <Trash2 size={12} />
            <span>Rimuovi dal Campo</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm"
          >
            Fatto
          </button>
        </div>
      </div>
    </div>
  );
};
