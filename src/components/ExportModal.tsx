import React, { useState } from 'react';
import { PlacedPlayer, PlacedEquipment, TacticalDrawing, DrillSheet } from '../types';
import { Download, FileImage, FileText, FileCode, Check, X, Upload, Printer, FileDown } from 'lucide-react';
import { generateTacticalPDF } from '../utils/pdfExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tacticTitle: string;
  drillSheet: DrillSheet;
  players: PlacedPlayer[];
  equipment: PlacedEquipment[];
  drawings: TacticalDrawing[];
  pitchSvgRef: React.RefObject<SVGSVGElement | null>;
  onImportData: (data: {
    tacticTitle?: string;
    drillSheet?: DrillSheet;
    players?: PlacedPlayer[];
    equipment?: PlacedEquipment[];
    drawings?: TacticalDrawing[];
  }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  tacticTitle,
  drillSheet,
  players,
  equipment,
  drawings,
  pitchSvgRef,
  onImportData,
}) => {
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen) return null;

  // Export Direct PDF
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await generateTacticalPDF({
        tacticTitle,
        drillSheet,
        players,
        equipment,
        drawings,
        pitchSvgElement: pitchSvgRef.current,
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF export failed:', err);
      // fallback to browser print if needed
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Export as PNG Image
  const handleExportPng = async () => {
    if (!pitchSvgRef.current) return;
    setIsExportingPng(true);
    try {
      const svgElement = pitchSvgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1240;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill background
          ctx.fillStyle = '#0b111e';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw Pitch
          ctx.drawImage(image, 60, 60, 1800, 1120);

          // Title watermark
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 36px sans-serif';
          ctx.fillText(tacticTitle, 70, 100);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px sans-serif';
          ctx.fillText(`MisterTactics • ${drillSheet.category} • ${players.length} Giocatori`, 70, 135);

          const pngData = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngData;
          downloadLink.download = `${tacticTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Tattica.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        setIsExportingPng(false);
      };
      image.src = blobURL;
    } catch (err) {
      console.error('PNG export failed:', err);
      setIsExportingPng(false);
    }
  };

  // Export JSON File
  const handleExportJson = () => {
    const data = {
      tacticTitle,
      drillSheet,
      players,
      equipment,
      drawings,
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `${tacticTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Schema.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON File
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          onImportData(parsed);
          onClose();
        } catch (err) {
          alert('Errore nel caricamento del file JSON. Assicurati che sia un file valido.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131d33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Esporta & Salva Tattica</h2>
              <p className="text-xs text-slate-400">
                Salva in PDF professionale, scarica in alta risoluzione o esporta il file tattico.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Options */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Option 1: Direct Save to PDF (PRIMARY FOCUS) */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-800/60 hover:border-red-500 transition-all shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-900/60 border border-red-600/60 flex items-center justify-center text-red-400 shadow-md">
                <FileDown size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Salva in PDF (Dossier Tattico & Scheda)</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase tracking-wider">PDF</span>
                </div>
                <p className="text-xs text-slate-300">
                  Crea e scarica direttamente il PDF A4 con grafica del campo, parametri, obiettivi e giocatori.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg transition-transform active:scale-95 whitespace-nowrap"
              >
                {isExportingPdf ? (
                  <span>Generazione...</span>
                ) : pdfSuccess ? (
                  <>
                    <Check size={14} />
                    <span>Scaricato!</span>
                  </>
                ) : (
                  <>
                    <FileDown size={14} />
                    <span>Salva in PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Stampa diretta con stampante"
              >
                <Printer size={15} />
              </button>
            </div>
          </div>

          {/* Option 2: PNG High Res */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <FileImage size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Immagine PNG ad Alta Risoluzione</h4>
                <p className="text-xs text-slate-400">
                  Esporta l'intero campo tattico in formato 1920x1240 per WhatsApp, slide e presentazioni.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportPng}
              disabled={isExportingPng}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-transform active:scale-95 whitespace-nowrap"
            >
              {isExportingPng ? 'Generazione...' : 'Scarica PNG'}
            </button>
          </div>

          {/* Option 3: JSON Backup & Save */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                <FileCode size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">File Tattico JSON (Salva / Carica)</h4>
                <p className="text-xs text-slate-400">
                  Salva tutti i giocatori, linee e attrezzature per ricaricarli in futuro o scambiarli con altri mister.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700">
                <Upload size={13} className="inline mr-1" />
                <span>Importa</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportJson}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-transform active:scale-95 whitespace-nowrap"
              >
                Esporta JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
