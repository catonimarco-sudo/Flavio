import React, { useState, useEffect } from 'react';
import { TeamCategory } from '../types';
import { X, Check, Users, Shield, Palette, Sparkles, Trash2 } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit: TeamCategory | null;
  onSaveCategory: (category: TeamCategory) => void;
  onDeleteCategory?: (id: string) => void;
}

const COLOR_PRESETS = [
  { name: 'Azzurro Reale', hex: '#2563eb' },
  { name: 'Verde Smeraldo', hex: '#16a34a' },
  { name: 'Viola Tattico', hex: '#9333ea' },
  { name: 'Arancione Carota', hex: '#ea580c' },
  { name: 'Rosso Fuoco', hex: '#dc2626' },
  { name: 'Giallo Oro', hex: '#ca8a04' },
  { name: 'Turchese Cyan', hex: '#0891b2' },
  { name: 'Rosa Magenta', hex: '#db2777' },
  { name: 'Nero Antracite', hex: '#334155' },
  { name: 'Verde Oliva', hex: '#65a30d' },
];

const FORMATION_PRESETS = [
  '4-3-3',
  '4-2-3-1',
  '3-5-2',
  '4-4-2',
  '3-4-3',
  '4-3-1-2',
  '3-4-2-1',
  '4-1-4-1',
  '5-3-2',
  '5-4-1',
  '4-4-1-1',
  '3-4-1-2',
];

const AGE_GROUP_PRESETS = [
  'Piccoli Amici (5-6 anni)',
  'Primi Calci (7-8 anni)',
  'Pulcini (9-10 anni)',
  'Esordienti (11-12 anni)',
  'Giovanissimi Under 14',
  'Giovanissimi Under 15',
  'Allievi Under 16',
  'Allievi Under 17',
  'Juniores Under 19',
  'Prima Squadra (Senior)',
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('Esordienti (11-12 anni)');
  const [formation, setFormation] = useState('4-3-3');
  const [mister, setMister] = useState('');
  const [assistantMister, setAssistantMister] = useState('');
  const [players, setPlayers] = useState(20);
  const [attendanceRate, setAttendanceRate] = useState(94);
  const [status, setStatus] = useState<'Attivo' | 'In Pausa' | 'Concluso'>('Attivo');
  const [color, setColor] = useState('#2563eb');
  const [notes, setNotes] = useState('');
  const [season, setSeason] = useState('2025/2026');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setAgeGroup(categoryToEdit.ageGroup || 'Esordienti (11-12 anni)');
      setFormation(categoryToEdit.formation || '4-3-3');
      setMister(categoryToEdit.mister || '');
      setAssistantMister(categoryToEdit.assistantMister || '');
      setPlayers(categoryToEdit.players || 20);
      setAttendanceRate(categoryToEdit.attendanceRate ?? 94);
      setStatus(categoryToEdit.status || 'Attivo');
      setColor(categoryToEdit.color || '#2563eb');
      setNotes(categoryToEdit.notes || '');
      setSeason(categoryToEdit.season || '2025/2026');
    } else {
      setName('');
      setAgeGroup('Esordienti (11-12 anni)');
      setFormation('4-3-3');
      setMister('');
      setAssistantMister('');
      setPlayers(22);
      setAttendanceRate(94);
      setStatus('Attivo');
      setColor('#2563eb');
      setNotes('');
      setSeason('2025/2026');
    }
    setErrorMessage(null);
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Inserisci il nome della categoria (es. Under 14 - Giovanissimi)');
      return;
    }

    const categoryData: TeamCategory = {
      id: categoryToEdit ? categoryToEdit.id : `cat-${Date.now()}`,
      name: name.trim(),
      ageGroup: ageGroup.trim(),
      formation,
      mister: mister.trim() || 'Da Assegnare',
      assistantMister: assistantMister.trim(),
      players: Math.max(1, Number(players) || 11),
      attendanceRate: Math.min(100, Math.max(0, Number(attendanceRate) || 90)),
      status,
      color,
      notes: notes.trim(),
      season: season.trim() || '2025/2026',
    };

    onSaveCategory(categoryData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md text-lg"
              style={{ backgroundColor: color }}
            >
              ⚽
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {categoryToEdit ? 'Modifica Categoria / Squadra' : 'Aggiungi Nuova Categoria'}
              </h2>
              <p className="text-xs text-slate-400">
                {categoryToEdit
                  ? `Aggiorna i dettagli e i parametri di ${categoryToEdit.name}`
                  : 'Configura una nuova fascia di età o squadra per il tuo club'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold animate-in shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Row 1: Name & Age Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome Squadra / Categoria <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="es. Under 14 - Giovanissimi B"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none placeholder-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fascia d'Età / Categoria FIGC
              </label>
              <input
                list="age-group-suggestions"
                type="text"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                placeholder="es. Esordienti (2013-2014)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none placeholder-slate-500"
              />
              <datalist id="age-group-suggestions">
                {AGE_GROUP_PRESETS.map((ag) => (
                  <option key={ag} value={ag} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Row 2: Staff Tecnico (Mister & Vice) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Allenatore Responsabile (Mister)
              </label>
              <input
                type="text"
                value={mister}
                onChange={(e) => setMister(e.target.value)}
                placeholder="es. Marco Catoni"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Vice Allenatore / Collaboratore Tecnico
              </label>
              <input
                type="text"
                value={assistantMister}
                onChange={(e) => setAssistantMister(e.target.value)}
                placeholder="es. Luca Moretti (opzionale)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          {/* Row 3: Modulo, Tesserati & Presenze */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Modulo di Riferimento
              </label>
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
              >
                {FORMATION_PRESETS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Numero Giocatori Tesserati
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={players}
                onChange={(e) => setPlayers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Media Presenze (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={attendanceRate}
                  onChange={(e) => setAttendanceRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-400">%</span>
              </div>
            </div>
          </div>

          {/* Row 4: Stato Categoria & Stagione */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Stato Operativo Categoria
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Attivo', 'In Pausa', 'Concluso'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      status === st
                        ? st === 'Attivo'
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : st === 'In Pausa'
                          ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                          : 'bg-slate-800 border-slate-600 text-slate-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Stagione Sportiva
              </label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="es. 2025/2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Colore Distintivo */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Palette size={14} className="text-emerald-400" />
                <span>Colore Sociale / Maglia Distintiva</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">{color}</span>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`w-8 h-8 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center ${
                    color.toLowerCase() === c.hex.toLowerCase()
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {color.toLowerCase() === c.hex.toLowerCase() && (
                    <Check size={14} className="text-white drop-shadow" />
                  )}
                </button>
              ))}

              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                />
                <span className="text-[10px] font-mono text-slate-400">Personalizza</span>
              </div>
            </div>
          </div>

          {/* Row 6: Note & Linee Guida Tattiche */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Note Tecniche & Obiettivi Stagionali
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="es. Obiettivo primario: sviluppo della costruzione dal basso, gestione del possesso a 2 tocchi e scalate difensive."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none placeholder-slate-500"
            />
          </div>

          {/* Footer Actions inside Form */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            {categoryToEdit && onDeleteCategory ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Sei sicuro di voler eliminare la categoria "${categoryToEdit.name}"?`)) {
                    onDeleteCategory(categoryToEdit.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Elimina Categoria</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check size={16} />
                <span>{categoryToEdit ? 'Salva Modifiche' : 'Crea Categoria'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
