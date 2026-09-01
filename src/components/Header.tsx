import React, { useState } from 'react';
import {
  Shield,
  Users,
  FileText,
  BookOpen,
  Download,
  Check,
  Edit3,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';

interface HeaderProps {
  tacticTitle: string;
  onUpdateTitle: (title: string) => void;
  squadCount: number;
  onOpenSquadModal: () => void;
  onOpenDrillModal: () => void;
  onOpenPresetsModal: () => void;
  onOpenExportModal: () => void;
  showAnimationBar: boolean;
  onToggleAnimationBar: () => void;
  showSquadSidebar?: boolean;
  onToggleSquadSidebar?: () => void;
  showSessionSidebar?: boolean;
  onToggleSessionSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tacticTitle,
  onUpdateTitle,
  squadCount,
  onOpenSquadModal,
  onOpenDrillModal,
  onOpenPresetsModal,
  onOpenExportModal,
  showAnimationBar,
  onToggleAnimationBar,
  showSquadSidebar,
  onToggleSquadSidebar,
  showSessionSidebar,
  onToggleSessionSidebar,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(tacticTitle);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 md:px-4 shrink-0 text-slate-200 select-none z-30">
      {/* Left: Brand & Sidebar Toggle & Tactic Title */}
      <div className="flex items-center gap-2.5">
        {/* Toggle Squad Sidebar (Left) */}
        {onToggleSquadSidebar && (
          <button
            onClick={onToggleSquadSidebar}
            className={`p-1.5 rounded-lg border transition-colors ${
              showSquadSidebar
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra / Nascondi Pannello Rosa Squadra"
          >
            {showSquadSidebar ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
          </button>
        )}

        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            <Shield size={15} className="stroke-[2.5]" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-sm tracking-tight text-white font-sans">
              Mister<span className="text-emerald-400">Tactics</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 uppercase">
              HD Workstation
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800 hidden md:block" />

        {/* Tactic Title (Editable) */}
        <div className="relative">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-1">
              <input
                type="text"
                autoFocus
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                className="px-2 py-0.5 rounded bg-slate-950 border border-emerald-500 text-xs text-white font-medium focus:outline-none min-w-[240px] md:min-w-[320px]"
              />
              <button
                type="submit"
                className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Check size={12} />
              </button>
            </form>
          ) : (
            <div
              onClick={() => {
                setTempTitle(tacticTitle);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800/70 cursor-pointer group transition-colors"
              title="Clicca per rinominare lo schema"
            >
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white max-w-[200px] md:max-w-[360px] truncate">
                {tacticTitle}
              </span>
              <Edit3
                size={10}
                className="text-slate-500 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right: Key Action Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Rosa Squadra Modal */}
        <button
          id="btn-open-squad"
          onClick={onOpenSquadModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors active:scale-95"
          title="Gestione completa rosa, volti e foto"
        >
          <Users size={13} className="text-blue-400" />
          <span className="hidden sm:inline">Rosa</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-bold">
            {squadCount}
          </span>
        </button>

        {/* Scheda Esercizio Modal */}
        <button
          id="btn-open-drill"
          onClick={onOpenDrillModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors active:scale-95"
          title="Compila scheda esercizio dettagliata"
        >
          <FileText size={13} className="text-emerald-400" />
          <span className="hidden md:inline">Scheda</span>
        </button>

        {/* Libreria Schemi */}
        <button
          id="btn-open-presets"
          onClick={onOpenPresetsModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors active:scale-95"
          title="Libreria schemi e tattiche pronte"
        >
          <BookOpen size={13} className="text-purple-400" />
          <span className="hidden sm:inline">Libreria</span>
        </button>

        {/* Animazione Fasi Toggle */}
        <button
          id="btn-toggle-animation"
          onClick={onToggleAnimationBar}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all active:scale-95 ${
            showAnimationBar
              ? 'bg-amber-950/80 border-amber-500/80 text-amber-300'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
          title="Mostra barra temporale e fasi animate"
        >
          <Layers size={13} className={showAnimationBar ? 'text-amber-400' : ''} />
          <span className="hidden lg:inline">Fasi</span>
        </button>

        {/* Esporta */}
        <button
          id="btn-open-export"
          onClick={onOpenExportModal}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <Download size={13} strokeWidth={2.5} />
          <span>Esporta</span>
        </button>

        {/* Toggle Session Sidebar (Right) */}
        {onToggleSessionSidebar && (
          <button
            onClick={onToggleSessionSidebar}
            className={`p-1.5 rounded-lg border transition-colors ml-1 ${
              showSessionSidebar
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra / Nascondi Pannello Sessione Allenamento"
          >
            {showSessionSidebar ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          </button>
        )}
      </div>
    </header>
  );
};

