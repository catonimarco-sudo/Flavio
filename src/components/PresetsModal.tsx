import React from 'react';
import { PresetTactic } from '../types';
import { PRESET_TACTICS } from '../data/presetTactics';
import { BookOpen, Check, Play, X, Sparkles, Layout, Flame, Target } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (preset: PresetTactic) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131d33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Libreria Schemi & Esercitazioni
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
                  {PRESET_TACTICS.length} Schemi Pronti
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Seleziona uno schema tattico o un'esercitazione con un click per caricarla sulla lavagna.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* List of Presets */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_TACTICS.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/50">
                    {preset.category}
                  </span>
                  {preset.formationHome && (
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {preset.formationHome}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {preset.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {preset.description}
                </p>

                {preset.drillSheet && (
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span>⏱ {preset.drillSheet.durationMinutes} min</span>
                    <span>👥 {preset.drillSheet.playersCount}</span>
                    <span>📍 {preset.drillSheet.pitchDimensions}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {preset.players.length} Giocatori • {preset.equipment.length} Attrezzi
                </span>

                <button
                  onClick={() => {
                    onApplyPreset(preset);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-transform active:scale-95"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Carica sulla Lavagna</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
