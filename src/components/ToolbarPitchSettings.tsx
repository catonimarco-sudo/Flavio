import React from 'react';
import { PitchSection, PitchTheme } from '../types';
import {
  Maximize,
  Shield,
  Crosshair,
  Shirt,
  Sparkles,
  User,
  Hash,
  Compass,
  Tag,
  Palette,
} from 'lucide-react';

interface ToolbarPitchSettingsProps {
  pitchSection: PitchSection;
  onSelectPitchSection: (section: PitchSection) => void;
  pitchTheme: PitchTheme;
  onSelectPitchTheme: (theme: PitchTheme) => void;
  onApplyFormation: (formationKey: string) => void;
  showDepartmentLines: boolean;
  onToggleDepartmentLines: () => void;
  showPhotos: boolean;
  onTogglePhotos: () => void;
  showNames: boolean;
  onToggleNames: () => void;
  showNumbers: boolean;
  onToggleNumbers: () => void;
  showRoles: boolean;
  onToggleRoles: () => void;
  showOrientation: boolean;
  onToggleOrientation: () => void;
  jerseyStyle: 'shirt' | 'circle' | 'vest';
  onCycleJerseyStyle: () => void;
}

const SECTIONS: { id: PitchSection; label: string }[] = [
  { id: 'full_horizontal', label: 'Intero' },
  { id: 'full_vertical', label: 'Verticale' },
  { id: 'attack_half', label: 'Attacco' },
  { id: 'defense_half', label: 'Difesa' },
  { id: 'trequarti', label: 'Trequarti' },
  { id: 'right_flank', label: 'Fascia Dx' },
  { id: 'left_flank', label: 'Fascia Sx' },
  { id: 'penalty_box', label: 'Area Rigore' },
];

export const ToolbarPitchSettings: React.FC<ToolbarPitchSettingsProps> = ({
  pitchSection,
  onSelectPitchSection,
  pitchTheme,
  onSelectPitchTheme,
  onApplyFormation,
  showDepartmentLines,
  onToggleDepartmentLines,
  showPhotos,
  onTogglePhotos,
  showNames,
  onToggleNames,
  showNumbers,
  onToggleNumbers,
  showRoles,
  onToggleRoles,
  showOrientation,
  onToggleOrientation,
  jerseyStyle,
  onCycleJerseyStyle,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
      {/* Pitch Sections */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold pr-0.5 flex items-center gap-1">
          <Maximize size={11} className="text-emerald-400" /> Campo:
        </span>

        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            id={`btn-sec-${sec.id}`}
            onClick={() => onSelectPitchSection(sec.id)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
              pitchSection === sec.id
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Formations, Department Lines & Player Displays */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
        {/* Modulo Dropdown */}
        <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
          <span className="font-bold text-amber-400">Modulo:</span>
          <select
            id="select-formation"
            onChange={(e) => {
              if (e.target.value) {
                onApplyFormation(e.target.value);
                e.target.value = ''; // reset select
              }
            }}
            defaultValue=""
            className="bg-transparent text-slate-200 text-[10px] outline-none cursor-pointer font-medium"
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">
              Modulo...
            </option>
            <option value="4-2-3-1" className="bg-slate-900 text-slate-200">
              4-2-3-1
            </option>
            <option value="4-3-3" className="bg-slate-900 text-slate-200">
              4-3-3
            </option>
            <option value="3-5-2" className="bg-slate-900 text-slate-200">
              3-5-2
            </option>
            <option value="4-4-2" className="bg-slate-900 text-slate-200">
              4-4-2
            </option>
            <option value="3-4-3" className="bg-slate-900 text-slate-200">
              3-4-3
            </option>
          </select>
        </div>

        {/* Linee Reparto */}
        <button
          id="btn-toggle-rep"
          onClick={onToggleDepartmentLines}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded border font-semibold text-[10px] transition-colors ${
            showDepartmentLines
              ? 'bg-rose-950/80 border-rose-500 text-rose-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Mostra linee di connessione tra Difensori, Centrocampisti e Attaccanti"
        >
          <Shield size={11} className={showDepartmentLines ? 'text-rose-400' : ''} />
          <span>Reparti</span>
        </button>

        {/* Stile Maglie */}
        <button
          id="btn-cycle-jersey"
          onClick={onCycleJerseyStyle}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-[10px]"
          title="Cambia grafica giocatore: Maglia classica o Cerchio minimal"
        >
          <Shirt size={11} className="text-blue-400" />
          <span>Maglie</span>
        </button>

        {/* Player Toggles: Nomi, Numeri, Foto, Ruoli, Sguardo */}
        <div className="flex items-center bg-slate-950 rounded p-0.5 border border-slate-800 text-[10px]">
          {/* Nomi */}
          <button
            id="toggle-names"
            onClick={onToggleNames}
            className={`px-1.5 py-0.2 rounded font-semibold transition-colors ${
              showNames ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra o nascondi i nomi dei giocatori"
          >
            Nomi
          </button>

          {/* Numeri */}
          <button
            id="toggle-numbers"
            onClick={onToggleNumbers}
            className={`px-1.5 py-0.2 rounded font-semibold transition-colors ${
              showNumbers ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra o nascondi i numeri di maglia"
          >
            Numeri
          </button>

          {/* Foto (Volti personalizzati) */}
          <button
            id="toggle-photos"
            onClick={onTogglePhotos}
            className={`flex items-center gap-0.5 px-1.5 py-0.2 rounded font-bold transition-all ${
              showPhotos
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra i volti reali/avatar dei giocatori"
          >
            <User size={10} strokeWidth={2.5} />
            <span>Foto</span>
          </button>

          {/* Ruolo */}
          <button
            id="toggle-roles"
            onClick={onToggleRoles}
            className={`px-1.5 py-0.2 rounded font-semibold transition-colors ${
              showRoles ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra o nascondi i ruoli (TRQ, POR, DC, CC, ATT)"
          >
            Ruolo
          </button>

          {/* Sguardo / Orientamento */}
          <button
            id="toggle-orientation"
            onClick={onToggleOrientation}
            className={`px-1.5 py-0.2 rounded font-semibold transition-colors ${
              showOrientation ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra la freccia di sguardo e orientamento tattico"
          >
            Sguardo
          </button>
        </div>

        {/* Pitch Theme Select */}
        <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
          <button
            onClick={() => onSelectPitchTheme('stripes')}
            className={`w-3 h-3 rounded-full border ${
              pitchTheme === 'stripes' ? 'ring-1 ring-white border-transparent' : 'border-slate-600'
            } bg-emerald-700`}
            title="Erba a strisce"
          />
          <button
            onClick={() => onSelectPitchTheme('dark_tactical')}
            className={`w-3 h-3 rounded-full border ${
              pitchTheme === 'dark_tactical' ? 'ring-1 ring-white border-transparent' : 'border-slate-600'
            } bg-[#0a1612]`}
            title="Lavagna scura da notte"
          />
          <button
            onClick={() => onSelectPitchTheme('light_turf')}
            className={`w-3 h-3 rounded-full border ${
              pitchTheme === 'light_turf' ? 'ring-1 ring-white border-transparent' : 'border-slate-600'
            } bg-green-500`}
            title="Erba brillante"
          />
        </div>
      </div>
    </div>
  );
};
