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
  Cloud,
  CloudUpload,
  RefreshCw,
  Share2,
  Copy,
} from 'lucide-react';

export type CloudSyncStatus = 'idle' | 'saving' | 'saved' | 'live' | 'error';

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
  // Cloud sync props
  currentTacticId: string | null;
  cloudSyncStatus: CloudSyncStatus;
  cloudErrorMessage?: string | null;
  onSaveToCloud: () => void;
  onCopyShareLink: () => void;
  isCopiedLink: boolean;
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
  currentTacticId,
  cloudSyncStatus,
  cloudErrorMessage,
  onSaveToCloud,
  onCopyShareLink,
  isCopiedLink,
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
    <header className="min-h-12 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between px-2 sm:px-3 md:px-4 py-1 gap-1 shrink-0 text-slate-200 select-none z-30">
      {/* Left: Brand & Sidebar Toggle & Tactic Title */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        {/* Toggle Squad Sidebar (Left) */}
        {onToggleSquadSidebar && (
          <button
            onClick={onToggleSquadSidebar}
            className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
              showSquadSidebar
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Mostra / Nascondi Rosa Squadra"
          >
            {showSquadSidebar ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
          </button>
        )}

        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            <Shield size={15} className="stroke-[2.5]" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-sm tracking-tight text-white font-sans">
              Mister<span className="text-emerald-400">Tactics</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 uppercase hidden md:inline">
              Cloud HD
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800 hidden md:block" />

        {/* Tactic Title (Editable) */}
        <div className="relative min-w-0 max-w-[130px] xs:max-w-[170px] sm:max-w-[240px] md:max-w-[320px]">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-1">
              <input
                type="text"
                autoFocus
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                className="px-2 py-0.5 rounded bg-slate-950 border border-emerald-500 text-xs text-white font-medium focus:outline-none w-full min-w-[120px]"
              />
              <button
                type="submit"
                className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
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
              className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800/70 cursor-pointer group transition-colors"
              title="Clicca per rinominare lo schema"
            >
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">
                {tacticTitle}
              </span>
              <Edit3
                size={10}
                className="text-slate-500 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right: Key Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
        {/* Cloud Status & Save Button */}
        <div className="flex items-center gap-1">
          <button
            id="btn-cloud-save"
            onClick={onSaveToCloud}
            disabled={cloudSyncStatus === 'saving'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all active:scale-95 shrink-0 ${
              cloudSyncStatus === 'saving'
                ? 'bg-blue-950/80 border-blue-600 text-blue-300 cursor-wait'
                : cloudSyncStatus === 'saved' || cloudSyncStatus === 'live'
                ? 'bg-emerald-950/80 border-emerald-600/80 text-emerald-300 hover:bg-emerald-900/80'
                : cloudSyncStatus === 'error'
                ? 'bg-red-950/80 border-red-600 text-red-300'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-400 text-white shadow'
            }`}
            title={
              cloudErrorMessage ||
              (currentTacticId
                ? `Sincronizzato su Firestore ID: ${currentTacticId}`
                : 'Salva e sincronizza schema su Firebase Firestore')
            }
          >
            {cloudSyncStatus === 'saving' ? (
              <>
                <RefreshCw size={13} className="animate-spin text-blue-400" />
                <span className="hidden xs:inline">Salvataggio...</span>
              </>
            ) : cloudSyncStatus === 'saved' || cloudSyncStatus === 'live' ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="hidden xs:inline">Salvato Cloud</span>
              </>
            ) : cloudSyncStatus === 'error' ? (
              <>
                <Cloud size={13} className="text-red-400" />
                <span className="hidden xs:inline">Riprova Cloud</span>
              </>
            ) : (
              <>
                <CloudUpload size={13} />
                <span className="hidden xs:inline">Salva su Cloud</span>
              </>
            )}
          </button>

          {/* Copy Share Link Button (active when tactic has an ID) */}
          {currentTacticId && (
            <button
              id="btn-copy-share-link"
              onClick={onCopyShareLink}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-all active:scale-95 shrink-0 ${
                isCopiedLink
                  ? 'bg-emerald-900/80 border-emerald-500 text-emerald-200'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Copia link condivisibile per iPhone / iPad / PC"
            >
              {isCopiedLink ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span className="hidden sm:inline">{isCopiedLink ? 'Link Copiato!' : 'Condividi'}</span>
            </button>
          )}
        </div>

        {/* Rosa Squadra Modal */}
        <button
          id="btn-open-squad"
          onClick={onOpenSquadModal}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors active:scale-95 shrink-0"
          title="Gestione completa rosa, volti e foto"
        >
          <Users size={13} className="text-blue-400" />
          <span className="hidden xs:inline sm:inline">Rosa</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-bold">
            {squadCount}
          </span>
        </button>

        {/* Scheda Esercizio Modal */}
        <button
          id="btn-open-drill"
          onClick={onOpenDrillModal}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors active:scale-95 shrink-0"
          title="Compila scheda esercizio dettagliata"
        >
          <FileText size={13} className="text-emerald-400" />
          <span className="hidden sm:inline">Scheda</span>
        </button>

        {/* Libreria Schemi */}
        <button
          id="btn-open-presets"
          onClick={onOpenPresetsModal}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors active:scale-95 shrink-0"
          title="Libreria schemi e tattiche pronte"
        >
          <BookOpen size={13} className="text-purple-400" />
          <span className="hidden sm:inline">Libreria</span>
        </button>

        {/* Animazione Fasi Toggle */}
        <button
          id="btn-toggle-animation"
          onClick={onToggleAnimationBar}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-medium transition-all active:scale-95 shrink-0 ${
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
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Download size={13} strokeWidth={2.5} />
          <span className="hidden xs:inline">Esporta</span>
        </button>

        {/* Toggle Session Sidebar (Right) */}
        {onToggleSessionSidebar && (
          <button
            onClick={onToggleSessionSidebar}
            className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
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

