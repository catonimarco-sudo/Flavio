import React, { useState, useMemo } from 'react';
import { CoachLabExercise, COACHLAB_EXERCISES } from '../data/coachLabExercises';
import { ExercisePitchThumbnail } from './ExercisePitchThumbnail';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Clock,
  Users,
  Grid,
  List,
  FileSpreadsheet,
  Plus,
  X,
  Sparkles,
  Check,
} from 'lucide-react';

interface ExerciseLibraryViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  onSelectExercise: (exercise: CoachLabExercise) => void;
  onNewExercise: () => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  searchQuery,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onSelectExercise,
  onNewExercise,
}) => {
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');
  const [selectedObjective, setSelectedObjective] = useState<string>('Tutti');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>('Under 13');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedPlayersCount, setSelectedPlayersCount] = useState<number | null>(14);
  const [sortBy, setSortBy] = useState<'recent' | 'duration_asc' | 'duration_desc' | 'players' | 'title'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tutte');
  const [selectedFieldSize, setSelectedFieldSize] = useState<string>('Tutte');

  // Local state for favorites toggle
  const [exercisesList, setExercisesList] = useState<CoachLabExercise[]>(COACHLAB_EXERCISES);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExercisesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Filtered & Sorted Exercises
  const filteredExercises = useMemo(() => {
    return exercisesList.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesObj = item.objective.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesObj) return false;
      }

      // Favorites Only
      if (showFavoritesOnly && !item.isFavorite) return false;

      // Category
      if (selectedCategory !== 'Tutte' && item.category !== selectedCategory) return false;

      // Objective
      if (selectedObjective !== 'Tutti' && item.objective !== selectedObjective) return false;

      // Age Group Tag
      if (selectedAgeGroup && selectedAgeGroup !== 'Tutte' && item.ageGroup !== selectedAgeGroup) return false;

      // Duration Tag
      if (selectedDuration && item.durationMinutes !== selectedDuration) return false;

      // Player Count Tag
      if (selectedPlayersCount && item.playersCount !== selectedPlayersCount) return false;

      // Advanced: Difficulty
      if (selectedDifficulty !== 'Tutte' && item.difficulty !== selectedDifficulty) return false;

      // Advanced: Field Size
      if (selectedFieldSize !== 'Tutte' && item.fieldSize !== selectedFieldSize) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'duration_asc') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'duration_desc') return b.durationMinutes - a.durationMinutes;
      if (sortBy === 'players') return a.playersCount - b.playersCount;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0; // default order / recent
    });
  }, [
    exercisesList,
    searchQuery,
    showFavoritesOnly,
    selectedCategory,
    selectedObjective,
    selectedAgeGroup,
    selectedDuration,
    selectedPlayersCount,
    selectedDifficulty,
    selectedFieldSize,
    sortBy,
  ]);

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
    <div className="w-full flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 select-none animate-in fade-in duration-200">
      {/* 1. Page Header (Identical to CoachLab screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Libreria esercizi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centinaia di esercizi pronti all'uso per allenare con qualità.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Star size={14} fill={showFavoritesOnly ? 'currentColor' : 'none'} className={showFavoritesOnly ? 'text-amber-400' : ''} />
            <span>I miei preferiti</span>
          </button>

          <button
            onClick={onNewExercise}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Nuovo esercizio</span>
          </button>
        </div>
      </div>

      {/* 2. Main Filters Bar (Matches screenshot layout) */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 sm:p-4 mb-5 shadow-lg flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Categoria Dropdown */}
          <div className="flex flex-col gap-1 min-w-[150px]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
              CATEGORIA
            </span>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Tutte">Tutte</option>
                <option value="Possesso palla">Possesso palla</option>
                <option value="Finalizzazione">Finalizzazione</option>
                <option value="Transizioni">Transizioni</option>
                <option value="Riscaldamento">Riscaldamento</option>
                <option value="Tattica">Tattica</option>
                <option value="Partita a tema">Partita a tema</option>
                <option value="Palle inattive">Palle inattive</option>
                <option value="Portieri">Portieri</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Obiettivo Dropdown */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
              OBIETTIVO
            </span>
            <div className="relative">
              <select
                value={selectedObjective}
                onChange={(e) => setSelectedObjective(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Tutti">Tutti</option>
                <option value="Linee di passaggio">Linee di passaggio</option>
                <option value="Conclusione in porta">Conclusione in porta</option>
                <option value="Transizione positiva">Transizione positiva</option>
                <option value="Pressing e riconquista">Pressing e riconquista</option>
                <option value="Attivazione tecnica">Attivazione tecnica</option>
                <option value="1vs1 e duelli">1vs1 e duelli</option>
                <option value="Sovrapposizioni e cross">Sovrapposizioni e cross</option>
                <option value="Costruzione dal basso">Costruzione dal basso</option>
                <option value="Difesa a 4">Difesa a 4</option>
                <option value="Palle inattive">Palle inattive</option>
                <option value="Presa e rilancio">Presa e rilancio</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Quick Filter Active Tags (As shown in screenshot: Under 13 x, 60 min x, 14 giocatori x) */}
          <div className="flex items-end gap-2 flex-wrap pt-4 sm:pt-0">
            {selectedAgeGroup && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/70 border border-emerald-600/50 text-emerald-300">
                <span>{selectedAgeGroup}</span>
                <button
                  type="button"
                  onClick={() => setSelectedAgeGroup(null)}
                  className="hover:text-white p-0.5"
                  title="Rimuovi filtro categoria"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedDuration && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/70 border border-emerald-600/50 text-emerald-300">
                <span>{selectedDuration} min</span>
                <button
                  type="button"
                  onClick={() => setSelectedDuration(null)}
                  className="hover:text-white p-0.5"
                  title="Rimuovi filtro durata"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedPlayersCount && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/70 border border-emerald-600/50 text-emerald-300">
                <span>{selectedPlayersCount} giocatori</span>
                <button
                  type="button"
                  onClick={() => setSelectedPlayersCount(null)}
                  className="hover:text-white p-0.5"
                  title="Rimuovi filtro numero giocatori"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* If all 3 tags removed, show a button to restore default Under 13 / 14 giocatori */}
            {!selectedAgeGroup && !selectedPlayersCount && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAgeGroup('Under 13');
                  setSelectedPlayersCount(14);
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 underline underline-offset-2"
              >
                + Ripristina tag predefiniti
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto pt-4 sm:pt-0">
            {/* Altri filtri */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-slate-800 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>Altri filtri</span>
            </button>

            {/* Ordina dropdown */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] text-slate-400 font-mono">Ordina:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="recent">Più recenti</option>
                <option value="duration_asc">Durata crescente</option>
                <option value="duration_desc">Durata decrescente</option>
                <option value="players">N° Giocatori</option>
                <option value="title">Titolo A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters Row */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs animate-in slide-in-from-top-1 duration-150">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Difficoltà</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
              >
                <option value="Tutte">Tutte</option>
                <option value="Base">Base</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzato">Avanzato</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Dimensione Campo</span>
              <select
                value={selectedFieldSize}
                onChange={(e) => setSelectedFieldSize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
              >
                <option value="Tutte">Tutte</option>
                <option value="Settore ridotto">Settore ridotto</option>
                <option value="Trequarti">Trequarti</option>
                <option value="Metà campo">Metà campo</option>
                <option value="Campo intero">Campo intero</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Categoria Età</span>
              <select
                value={selectedAgeGroup || 'Tutte'}
                onChange={(e) => setSelectedAgeGroup(e.target.value === 'Tutte' ? null : e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
              >
                <option value="Tutte">Tutte</option>
                <option value="Under 13">Under 13</option>
                <option value="Under 15">Under 15</option>
                <option value="Under 17">Under 17</option>
                <option value="Prima Squadra">Prima Squadra</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Tutte');
                  setSelectedObjective('Tutti');
                  setSelectedAgeGroup('Under 13');
                  setSelectedDuration(null);
                  setSelectedPlayersCount(14);
                  setSelectedDifficulty('Tutte');
                  setSelectedFieldSize('Tutte');
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-center font-medium transition-colors"
              >
                Reimposta tutti i filtri
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Results Header with Count & Grid/List View Toggles (From Screenshot) */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300">
          <FileSpreadsheet size={16} className="text-emerald-400" />
          <span>
            <strong className="text-white">{filteredExercises.length}</strong> esercizi trovati
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vista a griglia"
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vista ad elenco"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* 4. Exercise Cards Grid (Matching CoachLab visual design) */}
      {filteredExercises.length === 0 ? (
        <div className="w-full py-16 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl">
          <Sparkles className="mx-auto text-slate-600 mb-2" size={32} />
          <h3 className="text-base font-bold text-white">Nessun esercizio trovato</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Prova a modificare i filtri o la ricerca per trovare altri esercizi nella libreria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Tutte');
              setSelectedObjective('Tutti');
              setSelectedAgeGroup(null);
              setSelectedDuration(null);
              setSelectedPlayersCount(null);
              onSearchChange('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
          >
            Azzera filtri
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className="group bg-slate-900 border border-slate-800/90 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-950/30 transition-all duration-200 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Card Header Thumbnail Container with 3D Pitch */}
              <div className="relative w-full overflow-hidden bg-slate-950">
                {/* 3D Pitch Graphic */}
                <ExercisePitchThumbnail
                  category={exercise.category}
                  drillType={exercise.drillType}
                />

                {/* Category Badge on Top-Left */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shadow-sm ${getCategoryBadgeClass(
                      exercise.category
                    )}`}
                  >
                    {exercise.category}
                  </span>
                </div>

                {/* Favorite Star on Top-Right */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(exercise.id, e)}
                  className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    exercise.isFavorite
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                  }`}
                  title={exercise.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                >
                  <Star size={14} fill={exercise.isFavorite ? 'currentColor' : 'none'} />
                </button>

                {/* Subtle Hover overlay */}
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              {/* Card Content */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-slate-900/90">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
                    {exercise.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {exercise.description}
                  </p>
                </div>

                {/* Metadata Footer: Duration & Players count */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-500" />
                    <span>{exercise.durationMinutes} min</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-slate-500" />
                    <span>{exercise.playersCount} giocatori</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-3 rounded-xl flex items-center justify-between gap-4 transition-all cursor-pointer shadow-md hover:bg-slate-850"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                  <ExercisePitchThumbnail
                    category={exercise.category}
                    drillType={exercise.drillType}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getCategoryBadgeClass(
                        exercise.category
                      )}`}
                    >
                      {exercise.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{exercise.ageGroup}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {exercise.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-xl">
                    {exercise.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-500" />
                  <span>{exercise.durationMinutes} min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-slate-500" />
                  <span>{exercise.playersCount} giocatori</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(exercise.id, e)}
                  className="p-1 text-slate-400 hover:text-amber-400"
                >
                  <Star size={15} fill={exercise.isFavorite ? '#f59e0b' : 'none'} className={exercise.isFavorite ? 'text-amber-400' : ''} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
