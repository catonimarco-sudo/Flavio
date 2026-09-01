import React, { useState } from 'react';
import { DrillSheet, PlacedPlayer, PlacedEquipment, TacticalDrawing } from '../types';
import { FileText, Printer, Check, X, Sparkles, Clock, Users, Target, FileDown } from 'lucide-react';
import { generateTacticalPDF } from '../utils/pdfExport';

interface DrillSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  drillSheet: DrillSheet;
  onSaveDrillSheet: (sheet: DrillSheet) => void;
  tacticTitle?: string;
  players?: PlacedPlayer[];
  equipment?: PlacedEquipment[];
  drawings?: TacticalDrawing[];
  pitchSvgRef?: React.RefObject<SVGSVGElement | null>;
}

const CATEGORIES: DrillSheet['category'][] = [
  'Tattica Collettiva',
  'Possesso Palla',
  'Riscaldamento',
  'Transizione',
  'Tiri in Porta',
  '1v1 & 2v2',
  'Palle Inattive',
  'Fisico & Coordinazione',
  'Portieri',
];

export const DrillSheetModal: React.FC<DrillSheetModalProps> = ({
  isOpen,
  onClose,
  drillSheet,
  onSaveDrillSheet,
  tacticTitle = '',
  players = [],
  equipment = [],
  drawings = [],
  pitchSvgRef,
}) => {
  const [formData, setFormData] = useState<DrillSheet>({ ...drillSheet });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDrillSheet(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleSavePdf = async () => {
    setIsExportingPdf(true);
    try {
      await generateTacticalPDF({
        tacticTitle: formData.title || tacticTitle,
        drillSheet: formData,
        players,
        equipment,
        drawings,
        pitchSvgElement: pitchSvgRef?.current || null,
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2500);
    } catch (e) {
      console.error('PDF export error:', e);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131d33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Scheda Esercizio & Seduta di Allenamento
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  {formData.category}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Compila i dettagli metodologici dell'esercitazione da salvare o scaricare in PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSavePdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold shadow transition-colors"
              title="Scarica direttamente il file PDF con campo e scheda"
            >
              <FileDown size={14} />
              <span>{isExportingPdf ? 'Creazione PDF...' : pdfSuccess ? 'PDF Scaricato!' : 'Salva in PDF'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              title="Stampa con stampante"
            >
              <Printer size={14} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Titolo Esercitazione
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                placeholder="Es: Costruzione Bassa e Uscita su Terzino"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Categoria / Fase
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Duration, Players, Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Clock size={12} className="text-amber-400" /> Durata (Minuti)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Users size={12} className="text-blue-400" /> Giocatori Coinvolti
              </label>
              <input
                type="text"
                value={formData.playersCount}
                onChange={(e) => setFormData({ ...formData, playersCount: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                placeholder="Es: 11 vs 10 + 2 POR"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Target size={12} className="text-emerald-400" /> Dimensioni Spazio
              </label>
              <input
                type="text"
                value={formData.pitchDimensions}
                onChange={(e) => setFormData({ ...formData, pitchDimensions: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                placeholder="Es: 60 x 50 metri"
              />
            </div>
          </div>

          {/* Row 3: Objectives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Obiettivo Primario
              </label>
              <textarea
                rows={2}
                value={formData.objectivesPrimary}
                onChange={(e) => setFormData({ ...formData, objectivesPrimary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Es: Uscita pulita della palla dal pressing con scaglionamento mediani."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Obiettivo Secondario / Transizione
              </label>
              <textarea
                rows={2}
                value={formData.objectivesSecondary}
                onChange={(e) => setFormData({ ...formData, objectivesSecondary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Es: Riconquista immediata (Gegenpressing) entro 5 secondi."
              />
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Descrizione & Svolgimento
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              placeholder="Descrivi come si avvia l'esercitazione, i compiti dei giocatori e la sequenza delle giocate..."
            />
          </div>

          {/* Row 5: Rules & Coaching Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Regole, Vincoli & Varianti
              </label>
              <textarea
                rows={3}
                value={formData.rulesAndVariations}
                onChange={(e) => setFormData({ ...formData, rulesAndVariations: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Es: Max 2 tocchi; gol valido solo con palla filtrante..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" /> Punti Chiave per il Mister (Coaching Points)
              </label>
              <textarea
                rows={3}
                value={formData.coachingPoints}
                onChange={(e) => setFormData({ ...formData, coachingPoints: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Es: Postura del corpo aperta prima del controllo, comunicazione continua..."
              />
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={handleSavePdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold transition-transform active:scale-95"
            >
              <FileDown size={15} />
              <span>{isExportingPdf ? 'Generazione...' : 'Salva in PDF'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Chiudi
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-transform active:scale-95"
              >
                <Check size={16} />
                <span>{savedSuccess ? 'Salvato!' : 'Salva Scheda Esercizio'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
