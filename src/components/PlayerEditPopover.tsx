import React, { useRef } from 'react';
import { PlacedPlayer, Role } from '../types';
import { FACE_PRESETS, generateFaceSvg } from '../data/avatarPresets';
import { X, Trash2, RotateCw, User, Upload, Check } from 'lucide-react';

interface PlayerEditPopoverProps {
  player: PlacedPlayer | null;
  onClose: () => void;
  onUpdatePlayer: (updated: PlacedPlayer) => void;
  onRemovePlayer: (id: string) => void;
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

export const PlayerEditPopover: React.FC<PlayerEditPopoverProps> = ({
  player,
  onClose,
  onUpdatePlayer,
  onRemovePlayer,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-4 w-80 text-xs text-slate-200 animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-blue-500 flex items-center justify-center flex-shrink-0">
            {player.photoUrl ? (
              <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-white text-xs">{player.number}</span>
            )}
          </div>
          <span className="font-bold text-white text-sm truncate">{player.name}</span>
        </div>

        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2.5">
        {/* Name & Number */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Nome</label>
            <input
              type="text"
              value={player.name}
              onChange={(e) => onUpdatePlayer({ ...player, name: e.target.value })}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">N°</label>
            <input
              type="number"
              value={player.number}
              onChange={(e) => onUpdatePlayer({ ...player, number: Number(e.target.value) })}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-center font-bold focus:outline-none focus:border-blue-500"
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
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white"
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
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white"
            >
              <option value="home">Casa (Blu)</option>
              <option value="away">Ospite (Rosso)</option>
              <option value="jolly">Jolly (Giallo)</option>
              <option value="keeper">Portiere</option>
              <option value="referee">Arbitro</option>
            </select>
          </div>
        </div>

        {/* Orientation / Rotation */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <RotateCw size={11} /> Sguardo / Orientamento
            </label>
            <span className="text-[10px] font-mono text-slate-400">{player.rotation}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={player.rotation || 0}
            onChange={(e) => onUpdatePlayer({ ...player, rotation: Number(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>

        {/* Change Face / Photo */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Cambia Volto / Foto
          </label>
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
              className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] border border-slate-700"
              title="Scegli volto casuale"
            >
              Avatar 🎲
            </button>
          </div>
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
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px]"
          >
            Fatto
          </button>
        </div>
      </div>
    </div>
  );
};
