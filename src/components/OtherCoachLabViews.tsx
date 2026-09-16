import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  Plus,
  ChevronRight,
  Shield,
  Award,
  Video as VideoIcon,
  FileText,
  BarChart3,
  FolderKanban,
  CheckCircle,
  AlertCircle,
  Play,
  Share2,
  Trash2,
  Edit,
} from 'lucide-react';
import { Player } from '../types';
import { COACHLAB_EXERCISES } from '../data/coachLabExercises';

// ==================== 1. CALENDARIO VIEW ====================
export const CalendarioView: React.FC<{ onOpenTacticalBoard: () => void }> = ({ onOpenTacticalBoard }) => {
  const [activeWeekDay, setActiveWeekDay] = useState<'Mar' | 'Gio' | 'Sab'>('Mar');

  const scheduleData = [
    {
      day: 'Martedì 16 Settembre',
      shortDay: 'Mar',
      time: '18:30 - 20:00',
      title: 'Seduta Tattica & Possesso Palla',
      field: 'Campo Principale 1 (Erba Sintetica)',
      intensity: 'Alta',
      drills: [
        { name: 'Attivazione con mobilità e tecnica', duration: '12 min', cat: 'Riscaldamento' },
        { name: 'Possesso in superiorità con jolly', duration: '20 min', cat: 'Possesso palla' },
        { name: 'Transizione positiva 5vs3 + 2 jolly', duration: '25 min', cat: 'Transizioni' },
        { name: 'Partita 7vs7 a tema', duration: '30 min', cat: 'Partita a tema' },
      ],
      attendance: '16 convocati',
    },
    {
      day: 'Giovedì 18 Settembre',
      shortDay: 'Gio',
      time: '18:30 - 20:00',
      title: 'Velocità, Cross e Finalizzazione',
      field: 'Campo Ridotto B',
      intensity: 'Media-Alta',
      drills: [
        { name: 'Rondo dinamico con cambi di posizione', duration: '10 min', cat: 'Riscaldamento' },
        { name: '1vs1 + conclusione in porta', duration: '20 min', cat: 'Finalizzazione' },
        { name: 'Finalizzazione con cross e inserimento', duration: '25 min', cat: 'Finalizzazione' },
        { name: 'Schemi su Palle Inattive', duration: '20 min', cat: 'Palle inattive' },
      ],
      attendance: '18 convocati',
    },
    {
      day: 'Sabato 20 Settembre',
      shortDay: 'Sab',
      time: '15:30',
      title: 'CAMPIONATO: San Luigi vs Academy FC',
      field: 'Stadio Comunale',
      intensity: 'Massima (Gara Ufficiale)',
      drills: [
        { name: 'Riscaldamento pre-gara codificato', duration: '25 min', cat: 'Riscaldamento' },
        { name: 'Gara Ufficiale 1° e 2° Tempo', duration: '70 min', cat: 'Partita a tema' },
      ],
      attendance: '18 convocati ufficiali',
    },
  ];

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="text-emerald-400" />
            <span>Calendario Allenamenti & Gare</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Programmazione settimanale, convocazioni e schede collegate alla categoria Under 13.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer">
          <Plus size={16} />
          <span>+ Nuova Seduta</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {scheduleData.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-950/70 border border-emerald-600/50 text-emerald-400">
                  {item.shortDay}
                </span>
                <span className="text-xs font-mono text-slate-400">{item.time}</span>
              </div>

              <h3 className="text-base font-bold text-white mt-3 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{item.field}</p>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                  Esercizi Programmati:
                </span>
                {item.drills.map((d, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-200 font-medium truncate max-w-[180px]">{d.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0">{d.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">👥 {item.attendance}</span>
              <button
                onClick={onOpenTacticalBoard}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Visualizza Lavagna</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 2. SQUADRE VIEW ====================
export const SquadreView: React.FC<{ onOpenTacticalBoard: () => void }> = ({ onOpenTacticalBoard }) => {
  const teams = [
    { name: 'Under 13 - Esordienti', players: 22, formation: '4-3-3', mister: 'Marco Catoni', color: '#2563eb' },
    { name: 'Under 15 - Giovanissimi', players: 24, formation: '4-2-3-1', mister: 'Roberto Rossi', color: '#16a34a' },
    { name: 'Under 17 - Allievi Regionali', players: 21, formation: '3-5-2', mister: 'Andrea Bianchi', color: '#9333ea' },
    { name: 'Prima Squadra - Eccellenza', players: 26, formation: '4-3-3', mister: 'Stefano Ferri', color: '#ea580c' },
  ];

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
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

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer">
          <Plus size={16} />
          <span>+ Aggiungi Categoria</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((t, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md"
                    style={{ backgroundColor: t.color }}
                  >
                    ⚽
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{t.name}</h3>
                    <p className="text-xs text-slate-400">Allenatore: {t.mister}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                  {t.formation}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center text-xs">
                <div className="p-2 bg-slate-950 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Tesserati</div>
                  <div className="font-bold text-white mt-0.5">{t.players}</div>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Presenze</div>
                  <div className="font-bold text-emerald-400 mt-0.5">94%</div>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Stato</div>
                  <div className="font-bold text-blue-400 mt-0.5">Attivo</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Modulo consigliato sulla lavagna</span>
              <button
                onClick={onOpenTacticalBoard}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold cursor-pointer"
              >
                Schiera 11 su Lavagna
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 3. GIOCATORI VIEW ====================
export const GiocatoriView: React.FC<{
  squad: Player[];
  onOpenSquadModal: () => void;
  onOpenTacticalBoard: () => void;
}> = ({ squad, onOpenSquadModal, onOpenTacticalBoard }) => {
  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="text-emerald-400" />
            <span>Anagrafica & Rosa Giocatori</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestisci schede individuali, numeri di maglia, ruoli, volti e caratteristiche atletiche.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSquadModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Gestisci / Modifica Rosa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {squad.map((player) => (
          <div
            key={player.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-lg hover:border-emerald-500/50 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-emerald-500 overflow-hidden flex items-center justify-center mb-2.5 shadow-inner">
              {player.photoUrl ? (
                <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-extrabold text-lg text-emerald-400">
                  {player.number}
                </span>
              )}
            </div>

            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950 text-amber-300 border border-slate-800 mb-1">
              {player.role}
            </span>

            <div className="text-xs font-bold text-white truncate max-w-full group-hover:text-emerald-400 transition-colors">
              {player.name}
            </div>
            <div className="text-[10px] font-mono text-slate-400">N° {player.number}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 4. SESSIONI VIEW ====================
export const SessioniView: React.FC<{ onOpenTacticalBoard: () => void }> = ({ onOpenTacticalBoard }) => {
  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Clock className="text-emerald-400" />
            <span>Sedute di Allenamento Complete</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Costruisci la seduta assemblando attivazione, possesso, situazione e partita con minutaggio totale.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer">
          <Plus size={16} />
          <span>+ Nuova Seduta (90 min)</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-xs font-mono font-bold border border-emerald-800">
              SEDUTA TIPO #4 - MICRO-CICLO COMPETITIVO
            </span>
            <h2 className="text-xl font-bold text-white mt-2">
              Costruzione dal basso, mobilità e transizione positiva rapida
            </h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-400">90 MIN</div>
            <div className="text-xs text-slate-400">Carico: Alto</div>
          </div>
        </div>

        {/* Phase breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono text-amber-400 font-bold uppercase">1. Attivazione (15m)</div>
            <div className="text-sm font-semibold text-white mt-1">Riscaldamento dinamico & Rondo 5v2</div>
            <p className="text-xs text-slate-400 mt-1">Mobilità articolare e frequenza degli appoggi.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">2. Possesso (20m)</div>
            <div className="text-sm font-semibold text-white mt-1">Possesso in superiorità con jolly</div>
            <p className="text-xs text-slate-400 mt-1">Creazione linee di passaggio e terzo uomo.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono text-blue-400 font-bold uppercase">3. Tattica (25m)</div>
            <div className="text-sm font-semibold text-white mt-1">Finalizzazione con cross e inserimento</div>
            <p className="text-xs text-slate-400 mt-1">Tempi di attacco all'area e conclusione.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono text-purple-400 font-bold uppercase">4. Partita (30m)</div>
            <div className="text-sm font-semibold text-white mt-1">Partita a tema con sponde esterne</div>
            <p className="text-xs text-slate-400 mt-1">Applicazione dei principi in partita vera.</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            Stampa Scheda PDF Seduta
          </button>
          <button
            onClick={onOpenTacticalBoard}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Play size={14} fill="currentColor" />
            <span>Simula su Lavagna Tattica</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 5. PIANI DI LAVORO ====================
export const PianiLavoroView: React.FC = () => {
  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <FolderKanban className="text-emerald-400" />
          <span>Piani di Lavoro & Mesocicli</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pianificazione a medio e lungo termine: obiettivi tattici, carichi fisici e progressione didattica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
            MESOCICLO 1 (SETTEMBRE)
          </span>
          <h3 className="text-base font-bold text-white">Fase di Costruzione & Transizioni</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Consolidamento dei principi di possesso a due tocchi e riaggressione immediata nei primi 5 secondi dalla perdita del pallone.
          </p>
          <div className="pt-2 text-[11px] font-mono text-emerald-400">12 Sedute programmate (4 completate)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
            MESOCICLO 2 (OTTOBRE)
          </span>
          <h3 className="text-base font-bold text-white">Sviluppo Ampiezza e Catene Laterali</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Meccanismi di sovrapposizione terzino-ala, cross dal fondo e occupazione dell'area di rigore con 3-4 uomini.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-400">In attesa di avvio</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
            MESOCICLO 3 (NOVEMBRE)
          </span>
          <h3 className="text-base font-bold text-white">Palle Inattive & Gestione del Risultato</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Schemi da corner, punizioni laterali con barriera e gestione della fase difensiva negli ultimi 15 minuti di gara.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-400">In attesa di avvio</div>
        </div>
      </div>
    </div>
  );
};

// ==================== 6. STATISTICHE ====================
export const StatisticheView: React.FC = () => {
  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="text-emerald-400" />
          <span>Statistiche & Metriche Tattiche</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Ripartizione dei carichi tecnici e monitoraggio dell'attività sul campo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            Ripartizione Esercizi per Categoria
          </h3>
          <div className="space-y-2.5 pt-2">
            {[
              { cat: 'Possesso Palla', pct: 35, color: 'bg-emerald-500' },
              { cat: 'Finalizzazione & Tiri', pct: 25, color: 'bg-blue-500' },
              { cat: 'Transizioni & Pressing', pct: 20, color: 'bg-purple-500' },
              { cat: 'Tattica & Palle Inattive', pct: 12, color: 'bg-cyan-500' },
              { cat: 'Riscaldamento & Fisico', pct: 8, color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>{item.cat}</span>
                  <span className="font-mono font-bold">{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            Metriche Rosa & Presenze
          </h3>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-emerald-400">94.2%</div>
              <div className="text-[11px] text-slate-400 mt-1">Presenze Allenamento</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-blue-400">18.5 ore</div>
              <div className="text-[11px] text-slate-400 mt-1">Tempo Totale Allenato</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-amber-400">72</div>
              <div className="text-[11px] text-slate-400 mt-1">Esercizi in Libreria</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-purple-400">22</div>
              <div className="text-[11px] text-slate-400 mt-1">Atleti Registrati</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 7. VIDEO VIEW ====================
export const VideoView: React.FC = () => {
  const clips = [
    { title: 'Analisi Uscita dal Basso vs Pressione Alta', duration: '03:42', tags: ['Costruzione', 'Under 13'] },
    { title: 'Contropressing Immediato nei 5 Secondi', duration: '02:15', tags: ['Transizione', 'Pressing'] },
    { title: 'Tempi di Inserimento sul Secondo Palo', duration: '04:10', tags: ['Finalizzazione', 'Cross'] },
  ];

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <VideoIcon className="text-emerald-400" />
            <span>Video Analisi & Clip Tattiche</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Archivio di spezzoni video delle partite con annotazioni grafiche e collegamenti agli esercizi.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer">
          <Plus size={16} />
          <span>+ Carica Clip Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {clips.map((c, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-slate-950 relative flex items-center justify-center border-b border-slate-800">
              <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Play size={20} fill="currentColor" className="ml-1" />
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                {c.duration}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-white">{c.title}</h3>
              <div className="flex gap-1.5 flex-wrap">
                {c.tags.map((t, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 8. NOTE VIEW ====================
export const NoteView: React.FC = () => {
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Feedback Seduta di Giovedì: tempi di gioco',
      date: '14 Settembre 2026',
      content: 'I difensori centrali tendono a tenere la palla per 3 tocchi. Nel rondo insistere sulla postura aperta prima del controllo e sul passaggio di prima intenzione.',
    },
    {
      id: '2',
      title: 'Scouting Avversario: San Luigi Under 13',
      date: '12 Settembre 2026',
      content: 'Giocano con un 3-4-3 molto aggressivo. Il loro numero 10 calcia bene con entrambi i piedi. Sfruttare lo spazio alle spalle dei loro esterni nei cambi di gioco.',
    },
    {
      id: '3',
      title: 'Promemoria: convocazioni sabato',
      date: '10 Settembre 2026',
      content: 'Confermare 18 atleti entro venerdì sera. Portare 3 palloni supplementari per il riscaldamento pre-gara.',
    },
  ]);

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="text-emerald-400" />
            <span>Taccuino & Note del Mister</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Appunti veloci di campo, promemoria tattici e relazioni sulle prestazioni della squadra.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer">
          <Plus size={16} />
          <span>+ Nuova Nota</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {notes.map((n) => (
          <div key={n.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2.5">
            <div className="text-[10px] font-mono text-emerald-400">{n.date}</div>
            <h3 className="text-sm font-bold text-white leading-snug">{n.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
