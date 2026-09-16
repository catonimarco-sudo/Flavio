import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users2,
  UserCheck,
  BookOpen,
  Clock,
  FolderKanban,
  BarChart3,
  Video,
  FileText,
  Play,
  Layers,
  ChevronRight,
} from 'lucide-react';

export type CoachLabNavTab =
  | 'dashboard'
  | 'calendario'
  | 'squadre'
  | 'giocatori'
  | 'esercizi'
  | 'sessioni'
  | 'piani_lavoro'
  | 'statistiche'
  | 'video'
  | 'note'
  | 'lavagna';

interface CoachLabSidebarProps {
  activeTab: CoachLabNavTab;
  onSelectTab: (tab: CoachLabNavTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const CoachLabSidebar: React.FC<CoachLabSidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    { id: 'dashboard' as CoachLabNavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendario' as CoachLabNavTab, label: 'Calendario', icon: Calendar },
    { id: 'squadre' as CoachLabNavTab, label: 'Squadre', icon: Users2 },
    { id: 'giocatori' as CoachLabNavTab, label: 'Giocatori', icon: UserCheck },
    { id: 'esercizi' as CoachLabNavTab, label: 'Esercizi', icon: BookOpen, badge: '72' },
    { id: 'sessioni' as CoachLabNavTab, label: 'Sessioni', icon: Clock },
    { id: 'piani_lavoro' as CoachLabNavTab, label: 'Piani di lavoro', icon: FolderKanban },
    { id: 'statistiche' as CoachLabNavTab, label: 'Statistiche', icon: BarChart3 },
    { id: 'video' as CoachLabNavTab, label: 'Video', icon: Video },
    { id: 'note' as CoachLabNavTab, label: 'Note', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header (Identical to CoachLab screenshot) */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            {/* Hexagonal / Shield Soccer Icon */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 shrink-0 border border-emerald-400/40">
              <span className="text-xl">⚽</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1 leading-none">
                <span>Coach</span>
                <span className="text-emerald-400">Lab</span>
              </div>
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mt-1 font-mono">
                ALLENARE CON METODO
              </div>
            </div>
          </div>

          {/* Quick Access: Interactive Tactical Board */}
          <div className="p-3 border-b border-slate-800/60">
            <button
              onClick={() => {
                onSelectTab('lavagna');
                onCloseMobile();
              }}
              className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                activeTab === 'lavagna'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-400/40'
                  : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers size={16} />
                <span>Lavagna Tattica 2D/3D</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-900/80 text-emerald-200 border border-emerald-700/60">
                PRO
              </span>
            </button>
          </div>

          {/* Navigation Menu (Matches screenshot) */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? 'text-emerald-400' : 'text-slate-400'}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Coach Profile Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700/50 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
              MC
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">Mister Catoni</div>
              <div className="text-[10px] text-slate-400 truncate">UEFA B • Under 13</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
          </div>
        </div>
      </aside>
    </>
  );
};
