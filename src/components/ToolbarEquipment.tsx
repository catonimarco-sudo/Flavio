import React from 'react';
import { EquipmentType, PlacedEquipment, PlacedPlayer, Role } from '../types';
import { Plus } from 'lucide-react';
import { FACE_PRESETS, generateFaceSvg } from '../data/avatarPresets';

interface ToolbarEquipmentProps {
  onAddEquipment: (type: EquipmentType) => void;
  onAddPlayer: (team: 'home' | 'away' | 'jolly' | 'keeper' | 'referee', role?: Role) => void;
}

const EQUIPMENT_ITEMS: { type: EquipmentType; label: string; dotColor: string }[] = [
  { type: 'cone_orange', label: 'Conetto', dotColor: '#f97316' },
  { type: 'disc_yellow', label: 'Cinesino Giallo', dotColor: '#facc15' },
  { type: 'disc_red', label: 'Cinesino Rosso', dotColor: '#ef4444' },
  { type: 'disc_blue', label: 'Cinesino Blu', dotColor: '#3b82f6' },
  { type: 'disc_green', label: 'Cinesino Verde', dotColor: '#22c55e' },
  { type: 'ball', label: 'Pallone', dotColor: '#ffffff' },
  { type: 'mini_goal', label: 'Porticina', dotColor: '#cbd5e1' },
  { type: 'pole', label: 'Birillo / Paletto', dotColor: '#e11d48' },
  { type: 'ladder', label: 'Scaletta', dotColor: '#eab308' },
  { type: 'mannequin', label: 'Sagoma', dotColor: '#2563eb' },
  { type: 'hurdle', label: 'Ostacolo', dotColor: '#f97316' },
  { type: 'ring', label: 'Cerchio', dotColor: '#ec4899' },
];

export const ToolbarEquipment: React.FC<ToolbarEquipmentProps> = ({
  onAddEquipment,
  onAddPlayer,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1 px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
      {/* Left: Equipment & Training Items */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold pr-1">
          + Attrezzatura:
        </span>

        {EQUIPMENT_ITEMS.map((item) => (
          <button
            key={item.type}
            id={`btn-eq-${item.type}`}
            onClick={() => onAddEquipment(item.type)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-600 transition-all text-slate-200"
            title={`Aggiungi ${item.label} al campo`}
          >
            <span
              className="w-2 h-2 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: item.dotColor }}
            />
            <span className="font-medium text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Right: Quick Player Spawning */}
      <div className="flex items-center gap-1">
        {/* + POR */}
        <button
          id="btn-add-por"
          onClick={() => onAddPlayer('keeper', 'POR')}
          className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] shadow-sm transition-transform active:scale-95"
          title="Aggiungi Portiere (POR)"
        >
          <Plus size={11} strokeWidth={3} />
          <span>POR</span>
        </button>

        {/* + Blu */}
        <button
          id="btn-add-blue"
          onClick={() => onAddPlayer('home', 'CC')}
          className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] shadow-sm transition-transform active:scale-95"
          title="Aggiungi Giocatore Squadra Blu"
        >
          <Plus size={11} strokeWidth={3} />
          <span>Blu</span>
        </button>

        {/* + Rosso */}
        <button
          id="btn-add-red"
          onClick={() => onAddPlayer('away', 'CC')}
          className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] shadow-sm transition-transform active:scale-95"
          title="Aggiungi Giocatore Squadra Rossa (Avversario)"
        >
          <Plus size={11} strokeWidth={3} />
          <span>Rosso</span>
        </button>

        {/* + Jolly */}
        <button
          id="btn-add-jolly"
          onClick={() => onAddPlayer('jolly', 'JOL')}
          className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] shadow-sm transition-transform active:scale-95"
          title="Aggiungi Giocatore Jolly (Giallo)"
        >
          <Plus size={11} strokeWidth={3} />
          <span>Jolly</span>
        </button>

        {/* + Arbitro */}
        <button
          id="btn-add-ref"
          onClick={() => onAddPlayer('referee', 'ARB')}
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-yellow-300 font-semibold text-[10px]"
          title="Aggiungi Arbitro"
        >
          <Plus size={10} />
          <span>Arbitro</span>
        </button>
      </div>
    </div>
  );
};
