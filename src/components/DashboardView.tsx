import React from 'react';
import { CoachLabExercise, COACHLAB_EXERCISES } from '../data/coachLabExercises';
import { ExercisePitchThumbnail } from './ExercisePitchThumbnail';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Trophy,
  Clock,
  Play,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToExercises: () => void;
  onNavigateToBoard: () => void;
  onSelectExercise: (ex: CoachLabExercise) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToExercises,
  onNavigateToBoard,
  onSelectExercise,
}) => {
  const recentExercises = COACHLAB_EXERCISES.slice(0, 4);

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-5 sm:p-6 shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CoachLab - Allenare con Metodo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bentornato, Mister!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Tutto pronto per la seduta di oggi. Gestisci la rosa, prepara gli esercizi tattici e anima gli schemi sulla lavagna interattiva.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onNavigateToBoard}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer transform active:scale-95"
            >
              <Play size={15} fill="currentColor" />
              <span>Apri Lavagna Tattica</span>
            </button>
            <button
              onClick={onNavigateToExercises}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Libreria Esercizi (72)
            </button>
          </div>
        </div>

        {/* Subtle Pitch Grass Background Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] text-slate-400 font-mono uppercase">Esercizi in Libreria</div>
            <div className="text-2xl font-black text-white mt-1">72</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp size={12} />
              <span>+8 nuove varianti</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity size={20} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] text-slate-400 font-mono uppercase">Rosa Titolari</div>
            <div className="text-2xl font-black text-white mt-1">22</div>
            <div className="text-[10px] text-blue-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 size={12} />
              <span>100% idonei</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] text-slate-400 font-mono uppercase">Prossima Seduta</div>
            <div className="text-sm font-bold text-white mt-1.5">Oggi 18:30</div>
            <div className="text-[10px] text-purple-400 mt-1 font-mono">Campo Principale A</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Calendar size={20} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] text-slate-400 font-mono uppercase">Categoria Target</div>
            <div className="text-lg font-black text-white mt-1">Under 13</div>
            <div className="text-[10px] text-amber-400 mt-1 font-medium">Esordienti 2° Anno</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy size={20} />
          </div>
        </div>
      </div>

      {/* Featured Exercises from Library */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Esercizi Consigliati per la Seduta
            </h2>
            <p className="text-xs text-slate-400">
              Selezionati dalla libreria per obiettivi di possesso, finalizzazione e transizione.
            </p>
          </div>

          <button
            onClick={onNavigateToExercises}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Vedi tutti (72)</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative w-full bg-slate-950">
                <ExercisePitchThumbnail category={ex.category} drillType={ex.drillType} />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/90 text-emerald-300 border border-emerald-600/40">
                    {ex.category}
                  </span>
                </div>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {ex.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {ex.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                  <span>⏱ {ex.durationMinutes} min</span>
                  <span>👥 {ex.playersCount} atleti</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
