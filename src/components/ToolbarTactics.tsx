import React, { useState } from 'react';
import { ToolType } from '../types';
import {
  MousePointer,
  ArrowRight,
  MoveUpRight,
  Activity,
  CornerUpRight,
  Flame,
  Minus,
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Grid,
  ChevronDown,
} from 'lucide-react';

interface ToolbarTacticsProps {
  selectedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  strokeWidth: number;
  onSelectStrokeWidth: (w: number) => void;
  showHalfSpaces: boolean;
  onToggleHalfSpaces: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: (type?: 'all' | 'drawings' | 'equipment' | 'opponents') => void;
}

const COLORS = [
  { hex: '#ffffff', label: 'Bianco' },
  { hex: '#facc15', label: 'Giallo Fluo' },
  { hex: '#38bdf8', label: 'Ciano' },
  { hex: '#2563eb', label: 'Blu' },
  { hex: '#22c55e', label: 'Verde' },
  { hex: '#ef4444', label: 'Rosso' },
  { hex: '#f97316', label: 'Arancione' },
  { hex: '#c084fc', label: 'Viola' },
];

const STROKE_WIDTHS = [
  { label: 'Sottile', value: 1.5 },
  { label: 'Fine', value: 2.5 },
  { label: 'Medio', value: 4 },
  { label: 'Spesso', value: 6 },
];

export const ToolbarTactics: React.FC<ToolbarTacticsProps> = ({
  selectedTool,
  onSelectTool,
  selectedColor,
  onSelectColor,
  strokeWidth,
  onSelectStrokeWidth,
  showHalfSpaces,
  onToggleHalfSpaces,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearAll,
}) => {
  const [showClearMenu, setShowClearMenu] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-1 px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-200">
      {/* Group 1: Drawing & Action Tools */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* Sposta / Select */}
        <button
          id="tool-select"
          onClick={() => onSelectTool('select')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
            selectedTool === 'select'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
          }`}
          title="Sposta e seleziona giocatori o oggetti"
        >
          <MousePointer size={12} />
          <span>Sposta</span>
        </button>

        <div className="h-3.5 w-px bg-slate-800 mx-0.5" />

        {/* Corsa (freccia tratteggiata) */}
        <button
          id="tool-run"
          onClick={() => onSelectTool('run_arrow')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'run_arrow'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Corsa senza palla (tratteggiata)"
        >
          <MoveUpRight size={11} className="stroke-[2.5]" />
          <span>Corsa</span>
        </button>

        {/* Passaggio (freccia continua) */}
        <button
          id="tool-pass"
          onClick={() => onSelectTool('pass_arrow')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'pass_arrow'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Passaggio o tiro (linea con freccia)"
        >
          <ArrowRight size={11} className="stroke-[2.5]" />
          <span>Passaggio</span>
        </button>

        {/* Dribbling (linea ondulata) */}
        <button
          id="tool-dribble"
          onClick={() => onSelectTool('dribble_arrow')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'dribble_arrow'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Conduzione palla e Dribbling"
        >
          <Activity size={11} />
          <span>Dribbling</span>
        </button>

        {/* Curva */}
        <button
          id="tool-curve"
          onClick={() => onSelectTool('curve_arrow')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'curve_arrow'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Traiettoria curva (con punto di flesso regolabile)"
        >
          <CornerUpRight size={11} />
          <span>Curva</span>
        </button>

        {/* Pressing */}
        <button
          id="tool-press"
          onClick={() => onSelectTool('press_arrow')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'press_arrow'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Pressing / Pressione aggressiva"
        >
          <Flame size={11} />
          <span>Pressing</span>
        </button>

        {/* Linea */}
        <button
          id="tool-line"
          onClick={() => onSelectTool('line')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'line'
              ? 'bg-slate-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Linea retta di reparto o congiunzione"
        >
          <Minus size={11} />
          <span>Linea</span>
        </button>

        {/* Schizzo libero */}
        <button
          id="tool-freehand"
          onClick={() => onSelectTool('freehand')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'freehand'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Schizzo a mano libera"
        >
          <Pencil size={11} />
          <span>Schizzo</span>
        </button>

        {/* Zona */}
        <button
          id="tool-zone"
          onClick={() => onSelectTool('zone_rect')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'zone_rect'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Rettangolo / Zona di campo evidenziata"
        >
          <Square size={11} />
          <span>Zona</span>
        </button>

        {/* Cerchio */}
        <button
          id="tool-circle"
          onClick={() => onSelectTool('zone_circle')}
          className={`p-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'zone_circle'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Cerchio / Zona d'ombra"
        >
          <Circle size={12} />
        </button>

        {/* Testo */}
        <button
          id="tool-text"
          onClick={() => onSelectTool('text')}
          className={`p-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'text'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Aggiungi etichetta di testo"
        >
          <Type size={12} />
        </button>

        {/* Gomma */}
        <button
          id="tool-eraser"
          onClick={() => onSelectTool('eraser')}
          className={`p-1 rounded text-[11px] font-medium transition-colors ${
            selectedTool === 'eraser'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/40'
          }`}
          title="Gomma per cancellare singoli elementi"
        >
          <Eraser size={12} />
        </button>

        <div className="h-3.5 w-px bg-slate-800 mx-0.5" />

        {/* Undo / Redo */}
        <button
          id="btn-undo"
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-slate-700/50"
          title="Annulla ultima azione (Ctrl+Z)"
        >
          <Undo2 size={12} />
        </button>
        <button
          id="btn-redo"
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-slate-700/50"
          title="Ripeti azione (Ctrl+Y)"
        >
          <Redo2 size={12} />
        </button>

        {/* Svuota Tutto Dropdown */}
        <div className="relative">
          <button
            id="btn-clear-all"
            onClick={() => setShowClearMenu(!showClearMenu)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 text-[11px] font-semibold"
          >
            <Trash2 size={11} />
            <span>Svuota</span>
            <ChevronDown size={10} />
          </button>

          {showClearMenu && (
            <div className="absolute left-0 top-full mt-1 w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 text-[11px]">
              <button
                onClick={() => {
                  onClearAll('all');
                  setShowClearMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-900/50 text-red-300"
              >
                Svuota Tutto
              </button>
              <button
                onClick={() => {
                  onClearAll('drawings');
                  setShowClearMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300"
              >
                Cancella Solo Disegni
              </button>
              <button
                onClick={() => {
                  onClearAll('equipment');
                  setShowClearMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300"
              >
                Cancella Solo Attrezzatura
              </button>
              <button
                onClick={() => {
                  onClearAll('opponents');
                  setShowClearMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300"
              >
                Rimuovi Avversari
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Group 2: Half-Spaces, Color Palette, Stroke Width */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Toggle 5 Canali & Half-Spaces */}
        <button
          id="btn-toggle-halfspaces"
          onClick={onToggleHalfSpaces}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border font-medium transition-all ${
            showHalfSpaces
              ? 'bg-amber-950/70 border-amber-500/80 text-amber-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Mostra i 5 corridoi tattici verticali e le zone orizzontali"
        >
          <Grid size={11} className={showHalfSpaces ? 'text-amber-400' : ''} />
          <span>5 Canali</span>
        </button>

        {/* Color Palette */}
        <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded-full border border-slate-800">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => onSelectColor(c.hex)}
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                selectedColor === c.hex
                  ? 'ring-2 ring-white scale-110 shadow-sm'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>

        {/* Stroke Width Selector */}
        <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
          <span className="text-slate-400 pr-0.5">Spessore:</span>
          {STROKE_WIDTHS.map((sw) => (
            <button
              key={sw.value}
              onClick={() => onSelectStrokeWidth(sw.value)}
              className={`px-1 py-0.2 rounded font-medium transition-colors ${
                strokeWidth === sw.value
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sw.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
