import React, { useState, useEffect } from 'react';
import { TeamCategory } from '../types';
import { CategoryModal } from './CategoryModal';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Shield,
  Search,
  RotateCcw,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
} from 'lucide-react';

export const DEFAULT_CATEGORIES: TeamCategory[] = [
  {
    id: 'cat-u13',
    name: 'Under 13 - Esordienti',
    ageGroup: 'Esordienti (2013-2014)',
    players: 22,
    formation: '4-3-3',
    mister: 'Marco Catoni',
    assistantMister: 'Fabio Conti',
    color: '#2563eb',
    attendanceRate: 94,
    status: 'Attivo',
    notes: 'Priorità didattica: sviluppo del dominio della palla a 2 tocchi e transizione positiva.',
    season: '2025/2026',
  },
  {
    id: 'cat-u15',
    name: 'Under 15 - Giovanissimi',
    ageGroup: 'Giovanissimi Regionali (2011-2012)',
    players: 24,
    formation: '4-2-3-1',
    mister: 'Roberto Rossi',
    assistantMister: 'Matteo Neri',
    color: '#16a34a',
    attendanceRate: 94,
    status: 'Attivo',
    notes: 'Priorità didattica: verticalizzazioni rapide, ampiezza delle ali e pressing alto.',
    season: '2025/2026',
  },
  {
    id: 'cat-u17',
    name: 'Under 17 - Allievi Regionali',
    ageGroup: 'Allievi (2009-2010)',
    players: 21,
    formation: '3-5-2',
    mister: 'Andrea Bianchi',
    assistantMister: 'Dario Greco',
    color: '#9333ea',
    attendanceRate: 91,
    status: 'Attivo',
    notes: 'Priorità didattica: scalate difensive a 5, quinti a tutta fascia e finalizzazione con due punte.',
    season: '2025/2026',
  },
  {
    id: 'cat-u19',
    name: 'Prima Squadra - Eccellenza',
    ageGroup: 'Prima Squadra (Senior)',
    players: 26,
    formation: '4-3-3',
    mister: 'Stefano Ferri',
    assistantMister: 'Gianni Moretti',
    color: '#ea580c',
    attendanceRate: 96,
    status: 'Attivo',
    notes: 'Priorità: gestione delle palle inattive, ritmo gara elevato e compattezza tra i reparti.',
    season: '2025/2026',
  },
];

const STORAGE_KEY = 'mistertactics_team_categories';

interface SquadreViewProps {
  onOpenTacticalBoard: () => void;
  onDeployCategoryOnBoard?: (category: TeamCategory) => void;
}

export const SquadreView: React.FC<SquadreViewProps> = ({
  onOpenTacticalBoard,
  onDeployCategoryOnBoard,
}) => {
  // Load categories from localStorage or fallback to defaults
  const [categories, setCategories] = useState<TeamCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load categories from localStorage', e);
    }
    return DEFAULT_CATEGORIES;
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categoryToEdit, setCategoryToEdit] = useState<TeamCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'Tutti' | 'Attivo' | 'In Pausa' | 'Concluso'>('Tutti');

  // Persist whenever categories change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.warn('Could not save categories to localStorage', e);
    }
  }, [categories]);

  // Open modal in CREATE mode
  const handleOpenAddCategory = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal in EDIT mode
  const handleOpenEditCategory = (category: TeamCategory) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveCategory = (categoryData: TeamCategory) => {
    setCategories((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === categoryData.id);
      if (existingIdx >= 0) {
        // Update existing category
        const updated = [...prev];
        updated[existingIdx] = categoryData;
        return updated;
      } else {
        // Add new category
        return [...prev, categoryData];
      }
    });
  };

  // Delete category
  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Reset to default presets
  const handleResetDefaults = () => {
    if (confirm('Vuoi ripristinare le 4 categorie predefinite del club? Eventuali categorie create verranno sovrascritte.')) {
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  // Filter categories by search query and status
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.mister.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.ageGroup && cat.ageGroup.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cat.formation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Tutti' || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Club-wide metrics
  const totalPlayers = categories.reduce((sum, c) => sum + (c.players || 0), 0);
  const avgAttendance = categories.length
    ? Math.round(categories.reduce((sum, c) => sum + (c.attendanceRate || 0), 0) / categories.length)
    : 0;
  const activeCount = categories.filter((c) => c.status === 'Attivo').length;

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="text-emerald-400" />
            <span>Gestione Squadre & Categorie</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organigramma tecnico, rose giovanili e moduli di riferimento del club.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            title="Ripristina categorie predefinite"
            className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Ripristina</span>
          </button>

          <button
            id="btn-aggiungi-categoria"
            onClick={handleOpenAddCategory}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Aggiungi Categoria</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Squadre / Categorie</div>
          <div className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-1.5">
            <span>{categories.length}</span>
            <span className="text-xs font-normal text-emerald-400">({activeCount} attive)</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Totale Tesserati</div>
          <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{totalPlayers}</div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Presenze Medie Club</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{avgAttendance}%</div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Stagione Attiva</div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">2025/2026</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca categoria, mister o modulo..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['Tutti', 'Attivo', 'In Pausa', 'Concluso'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
          <Users size={36} className="mx-auto text-slate-600 mb-2" />
          <h3 className="text-base font-bold text-white">Nessuna categoria trovata</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {searchQuery
              ? `Nessun risultato corrispondente a "${searchQuery}". Prova a modificare la ricerca.`
              : 'Non ci sono categorie registrate. Fai clic su "+ Aggiungi Categoria" per crearne una.'}
          </p>
          <button
            onClick={handleOpenAddCategory}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Aggiungi Categoria Ora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all group"
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 ring-2 ring-slate-800"
                      style={{ backgroundColor: cat.color }}
                    >
                      ⚽
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                          {cat.name}
                        </h3>
                        {cat.ageGroup && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {cat.ageGroup}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Allenatore: <span className="text-slate-200 font-semibold">{cat.mister}</span>
                        {cat.assistantMister && (
                          <span className="text-slate-500"> • Vice: {cat.assistantMister}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                      {cat.formation}
                    </span>

                    <button
                      id={`btn-modifica-${cat.id}`}
                      onClick={() => handleOpenEditCategory(cat)}
                      title="Modifica Categoria"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 hover:text-emerald-300 text-slate-400 transition-colors cursor-pointer border border-slate-700"
                    >
                      <Edit size={15} />
                    </button>
                  </div>
                </div>

                {/* 3 Metric Badges */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center text-xs">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/60">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Tesserati</div>
                    <div className="font-bold text-white mt-0.5">{cat.players} giocatori</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/60">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Presenze</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{cat.attendanceRate}%</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/60">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Stato</div>
                    <div
                      className={`font-bold mt-0.5 ${
                        cat.status === 'Attivo'
                          ? 'text-emerald-400'
                          : cat.status === 'In Pausa'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {cat.status}
                    </div>
                  </div>
                </div>

                {/* Optional Notes */}
                {cat.notes && (
                  <p className="mt-3 text-[11px] text-slate-400 line-clamp-2 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                    "{cat.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEditCategory(cat)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <Edit size={13} />
                  <span>Modifica Dati</span>
                </button>

                <button
                  onClick={() => {
                    if (onDeployCategoryOnBoard) {
                      onDeployCategoryOnBoard(cat);
                    } else {
                      onOpenTacticalBoard();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span>Schiera 11 su Lavagna</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Add & Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};
