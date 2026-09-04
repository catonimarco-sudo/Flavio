import React, { useEffect, useState } from 'react';
import { AnimationStep, PlacedPlayer, PlacedEquipment, TacticalDrawing } from '../types';
import { Play, Pause, Plus, Trash2, ChevronRight, RotateCcw, FastForward } from 'lucide-react';

interface AnimationControlsProps {
  steps: AnimationStep[];
  activeStepIndex: number;
  onSelectStepIndex: (index: number) => void;
  onAddStep: () => void;
  onDeleteStep: (index: number) => void;
  onUpdateActiveStepSnapshot: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSetSpeed: (s: number) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  steps,
  activeStepIndex,
  onSelectStepIndex,
  onAddStep,
  onDeleteStep,
  onUpdateActiveStepSnapshot,
  isPlaying,
  onTogglePlay,
  speed,
  onSetSpeed,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 bg-slate-900 text-xs text-slate-200 select-none">
      {/* Left: Playback Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          id="btn-play-animation"
          onClick={onTogglePlay}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded font-bold text-xs shadow-sm transition-transform active:scale-95 shrink-0 ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          <span>{isPlaying ? 'Pausa' : 'Riproduci Fasi'}</span>
        </button>

        {/* Speed Selector */}
        <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
          <span className="text-slate-400 pr-0.5 font-mono hidden xs:inline">Vel:</span>
          {[0.5, 1, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-1.5 py-0.2 rounded font-semibold transition-colors ${
                speed === s ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Center: Step Badges / Timeline */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase mr-0.5 shrink-0">Timeline:</span>
        {steps.map((step, idx) => (
          <div
            key={step.id}
            onClick={() => onSelectStepIndex(idx)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer border shrink-0 transition-all ${
              activeStepIndex === idx
                ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <span>Fase {idx + 1}</span>
            {steps.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteStep(idx);
                }}
                className="text-slate-400 hover:text-red-300 p-0.5"
                title="Elimina questa fase"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        ))}

        {/* Add Step */}
        <button
          onClick={onAddStep}
          className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-[11px] shrink-0 transition-colors"
          title="Aggiungi nuova fase/fotogramma tattico"
        >
          <Plus size={11} />
          <span>+ Fase</span>
        </button>
      </div>

      {/* Right: Snapshot current positions */}
      <button
        onClick={onUpdateActiveStepSnapshot}
        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-[10px] shrink-0 ml-auto sm:ml-0"
        title="Salva la disposizione attuale come fotogramma della fase attiva"
      >
        Salva Fase {activeStepIndex + 1}
      </button>
    </div>
  );
};
