import React from 'react';
import {
  Menu,
  Search,
  Star,
  Plus,
  Globe,
  Bell,
  Layers,
  BookOpen,
  Sliders,
} from 'lucide-react';
import { CoachLabNavTab } from './CoachLabSidebar';
import { AppBrandConfig } from '../types';

interface CoachLabTopBarProps {
  activeTab: CoachLabNavTab;
  onSelectTab: (tab: CoachLabNavTab) => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  onNewExercise: () => void;
  brandConfig?: AppBrandConfig;
  onOpenBrandCustomizer?: () => void;
}

export const CoachLabTopBar: React.FC<CoachLabTopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onNewExercise,
  brandConfig,
  onOpenBrandCustomizer,
}) => {
  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-30 select-none">
      {/* Left: Mobile Menu Toggle & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Brand indicator */}
        {brandConfig && (
          <div
            onClick={onOpenBrandCustomizer}
            className="flex items-center gap-1.5 lg:hidden cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-900"
            title="Personalizza Brand"
          >
            {brandConfig.iconType === 'custom_image' && brandConfig.customImageUrl ? (
              <img
                src={brandConfig.customImageUrl}
                alt="Logo"
                className="w-6 h-6 rounded-md object-contain"
              />
            ) : (
              <span className="text-base">{brandConfig.presetEmoji || '⚽'}</span>
            )}
            <span className="text-xs font-black text-white">
              {brandConfig.namePart1}{' '}
              <span style={{ color: brandConfig.highlightColor || '#34d399' }}>
                {brandConfig.namePart2}
              </span>
            </span>
          </div>
        )}

        {/* View Switcher Pills */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onSelectTab('esercizi')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'esercizi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Libreria Esercizi</span>
            <span className="sm:hidden">Esercizi</span>
          </button>

          <button
            onClick={() => onSelectTab('lavagna')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'lavagna'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Lavagna Tattica 2D/3D</span>
            <span className="sm:hidden">Lavagna</span>
          </button>
        </div>
      </div>

      {/* Middle: Real-time Search Input (From Screenshot) */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cerca esercizi, tattiche, obiettivi..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right: Actions, Language & New Exercise */}
      <div className="flex items-center gap-2">
        {/* Brand Customizer Button */}
        {onOpenBrandCustomizer && (
          <button
            onClick={onOpenBrandCustomizer}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Personalizza Nome, Logo e Colori dell'App"
          >
            <Sliders size={14} className="text-emerald-400" />
            <span className="hidden lg:inline">Personalizza Logo</span>
          </button>
        )}

        {/* Favorite filter toggle */}
        <button
          onClick={onToggleFavoritesOnly}
          className={`p-2 rounded-xl border transition-all cursor-pointer hidden sm:flex items-center gap-1 text-xs font-semibold ${
            showFavoritesOnly
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Filtra solo preferiti"
        >
          <Star size={14} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          <span className="hidden xl:inline">Preferiti</span>
        </button>

        {/* New Exercise Button (Green accent from screenshot) */}
        <button
          onClick={onNewExercise}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Nuovo esercizio</span>
        </button>

        {/* Language selector: IT ∨ (from screenshot) */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300">
          <Globe size={13} className="text-slate-400" />
          <span>IT</span>
        </div>
      </div>
    </header>
  );
};

