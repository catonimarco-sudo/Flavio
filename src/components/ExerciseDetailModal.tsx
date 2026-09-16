import React from 'react';
import { CoachLabExercise } from '../data/coachLabExercises';
import { ExercisePitchThumbnail } from './ExercisePitchThumbnail';
import { X, Play, Clock, Users, Shield, Target, Award, Star, Printer, ChevronRight } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: CoachLabExercise | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenInTacticalBoard: (exercise: CoachLabExercise) => void;
  onToggleFavorite: (id: string) => void;
  onAddToSession?: (exercise: CoachLabExercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onOpenInTacticalBoard,
  onToggleFavorite,
  onAddToSession,
}) => {
  if (!isOpen || !exercise) return null;

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Possesso palla':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
      case 'Finalizzazione':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/60';
      case 'Transizioni':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/60';
      case 'Riscaldamento':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'Tattica':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60';
      case 'Partita a tema':
        return 'bg-teal-950/80 text-teal-300 border-teal-700/60';
      case 'Palle inattive':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60';
      case 'Portieri':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getCategoryBadgeClass(
                exercise.category
              )}`}
            >
              {exercise.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: #{exercise.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(exercise.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                exercise.isFavorite
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={exercise.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            >
              <Star size={16} fill={exercise.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Stampa scheda esercizio"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Title & Metadata */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {exercise.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* 3D Pitch Graphic Simulation Preview */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 group">
            <ExercisePitchThumbnail
              category={exercise.category}
              drillType={exercise.drillType}
              className="w-full max-h-[340px]"
            />
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-slate-800 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-400 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Anteprima Tattica 3D Isometrica</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Durata</div>
                <div className="text-sm font-bold text-white">{exercise.durationMinutes} minuti</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Users size={18} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Giocatori</div>
                <div className="text-sm font-bold text-white">{exercise.playersCount} atleti</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Target size={18} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Categoria</div>
                <div className="text-sm font-bold text-white">{exercise.ageGroup}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Intensità</div>
                <div className="text-sm font-bold text-white">{exercise.intensity}</div>
              </div>
            </div>
          </div>

          {/* Coaching Details & Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono">
                <Award size={14} />
                <span>Punti Chiave per il Mister</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {exercise.coachingPoints}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase font-mono">
                <Shield size={14} />
                <span>Regole, Vincoli & Varianti</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {exercise.rules}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pronto per simulazione tattica interattiva & animazione</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onAddToSession && (
              <button
                type="button"
                onClick={() => {
                  onAddToSession(exercise);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                + Aggiungi a Seduta
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onOpenInTacticalBoard(exercise);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Play size={15} fill="currentColor" />
              <span>Apri nella Lavagna Tattica</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
