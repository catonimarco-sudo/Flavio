import { PresetTactic } from '../types';
import { INITIAL_SQUAD } from './defaultPlayers';

export const PRESET_TACTICS: PresetTactic[] = [
  {
    id: 'tactic-1',
    name: 'Costruzione Tattica e Sviluppo per Reparti (4-2-3-1)',
    category: 'Tattica Collettiva',
    description: 'Costruzione dal basso con i due mediani scaglionati, trequartista che viene incontro tra le linee e terzini in ampiezza massima.',
    formationHome: '4-2-3-1',
    players: [
      {
        ...INITIAL_SQUAD[0], // Catoni M. 10 TRQ
        x: 441,
        y: 340,
        rotation: 0,
      },
      {
        ...INITIAL_SQUAD[1], // Donnarumma G. 1 POR
        x: 73,
        y: 340,
        rotation: 0,
      },
      {
        ...INITIAL_SQUAD[2], // Di Lorenzo G. 2 TD
        x: 252,
        y: 571,
        rotation: 350,
      },
      {
        ...INITIAL_SQUAD[3], // Bastoni A. 95 DC
        x: 189,
        y: 428,
        rotation: 0,
      },
      {
        ...INITIAL_SQUAD[4], // Calafiori R. 5 DC
        x: 189,
        y: 252,
        rotation: 0,
      },
      {
        ...INITIAL_SQUAD[5], // Dimarco F. 3 TS
        x: 252,
        y: 109,
        rotation: 10,
      },
      {
        ...INITIAL_SQUAD[7], // Jorginho F. 8 MED
        x: 326,
        y: 388,
        rotation: 0,
      },
      {
        ...INITIAL_SQUAD[6], // Barella N. 23 CC/MED
        x: 368,
        y: 258,
        rotation: 20,
      },
      {
        ...INITIAL_SQUAD[8], // Chiesa F. 7 AD/ED
        x: 452,
        y: 558,
        rotation: 345,
      },
      {
        ...INITIAL_SQUAD[9], // Zaccagni M. 20 AS/ES
        x: 452,
        y: 122,
        rotation: 15,
      },
      {
        ...INITIAL_SQUAD[10], // Retegui M. 9 ATT
        x: 504,
        y: 340,
        rotation: 0,
      },
    ],
    equipment: [
      { id: 'eq-1', type: 'ball', x: 205, y: 415, rotation: 0 },
    ],
    drawings: [
      {
        id: 'dr-1',
        type: 'pass_arrow',
        points: [{ x: 205, y: 415 }, { x: 326, y: 388 }],
        color: '#38bdf8',
        strokeWidth: 2.5,
      },
      {
        id: 'dr-2',
        type: 'run_arrow',
        points: [{ x: 441, y: 340 }, { x: 399, y: 326 }],
        color: '#facc15',
        strokeWidth: 2,
        strokeDash: '5,5',
      },
      {
        id: 'dr-3',
        type: 'curve_arrow',
        points: [{ x: 252, y: 571 }, { x: 378, y: 585 }],
        controlPoint: { x: 305, y: 625 },
        color: '#4ade80',
        strokeWidth: 2.5,
      }
    ],
    drillSheet: {
      title: 'Costruzione Tattica e Sviluppo per Reparti (4-2-3-1)',
      category: 'Tattica Collettiva',
      durationMinutes: 25,
      playersCount: '11 vs 10 + 2 Portieri',
      pitchDimensions: 'Campo Intero (105 x 68 m)',
      objectivesPrimary: 'Uscita pulita dal pressing avversario tramite scaglionamento dei 2 mediani e ricezione del TRQ.',
      objectivesSecondary: 'Sfruttare l ampiezza dei terzini per isolare gli esterni in 1v1 offensivo.',
      description: 'Si avvia l azione dal portiere o dal centrale di destra. Il mediano di parte abbassa la linea per offrire scarico sicuro, mentre il TRQ si posiziona alle spalle del centrocampo rivale.',
      rulesAndVariations: 'Massimo 2 tocchi nella propria metà campo; gol valido solo se la palla transita per almeno 2 corridoi diversi prima della finalizzazione.',
      coachingPoints: 'Postura aperta del corpo prima della ricezione; tempi di smarcamento del trequartista sul tempo di passaggio del difensore.',
      author: 'Mister Catoni',
      date: '2026-09-01'
    }
  },
  {
    id: 'tactic-2',
    name: 'Rondo Posizionale 4v4 + 3 Jolly',
    category: 'Possesso Palla',
    description: 'Esercitazione classica di possesso in gabbia delimitata da cinesini con 3 Jolly (2 sui lati corti + 1 play centrale).',
    formationHome: 'Rondo',
    players: [
      { ...INITIAL_SQUAD[0], id: 'rp-1', x: 262, y: 238, role: 'CC', team: 'home', rotation: 0 },
      { ...INITIAL_SQUAD[2], id: 'rp-2', x: 472, y: 238, role: 'TD', team: 'home', rotation: 0 },
      { ...INITIAL_SQUAD[6], id: 'rp-3', x: 472, y: 442, role: 'CC', team: 'home', rotation: 0 },
      { ...INITIAL_SQUAD[8], id: 'rp-4', x: 262, y: 442, role: 'AD', team: 'home', rotation: 0 },
      // Jolly
      { ...INITIAL_SQUAD[7], id: 'rp-j1', x: 367, y: 340, role: 'JOL', team: 'jolly', rotation: 0 },
      { ...INITIAL_SQUAD[15], id: 'rp-j2', x: 367, y: 204, role: 'JOL', team: 'jolly', rotation: 0 },
      { ...INITIAL_SQUAD[13], id: 'rp-j3', x: 367, y: 476, role: 'JOL', team: 'jolly', rotation: 0 },
    ],
    equipment: [
      { id: 'eq-c1', type: 'disc_yellow', x: 231, y: 190, rotation: 0 },
      { id: 'eq-c2', type: 'disc_yellow', x: 504, y: 190, rotation: 0 },
      { id: 'eq-c3', type: 'disc_yellow', x: 504, y: 490, rotation: 0 },
      { id: 'eq-c4', type: 'disc_yellow', x: 231, y: 490, rotation: 0 },
      { id: 'eq-ball', type: 'ball', x: 273, y: 245, rotation: 0 },
    ],
    drawings: [
      {
        id: 'dr-box',
        type: 'zone_rect',
        points: [{ x: 231, y: 190 }, { x: 504, y: 490 }],
        color: '#facc15',
        strokeWidth: 1.5,
        fill: 'rgba(250, 204, 21, 0.1)',
      }
    ],
    drillSheet: {
      title: 'Rondo Posizionale 4v4 + 3 Jolly',
      category: 'Possesso Palla',
      durationMinutes: 18,
      playersCount: '11 Giocatori (4 vs 4 + 3 Jolly)',
      pitchDimensions: 'Rettangolo 20 x 25 metri',
      objectivesPrimary: 'Mantenimento del possesso e ricerca del terzo uomo attraverso il Jolly centrale.',
      objectivesSecondary: 'Transizione difensiva rapida nei primi 5 secondi dopo la perdita del possesso (Gegenpressing).',
      description: 'I 4 blu giocano con i 3 gialli per mantenere il possesso. I 4 rossi pressano a coppie coordinate.',
      rulesAndVariations: '10 passaggi consecutivi valgono 1 punto. I Jolly giocano a 1 tocco obbligatorio.',
      coachingPoints: 'Orientamento del corpo in ricezione, passaggio sul piede forte del compagno, comunicazione vocale.',
      author: 'Mister Catoni',
      date: '2026-09-01'
    }
  },
  {
    id: 'tactic-3',
    name: 'Circuito Agilità, Scaletta & 1v1 con Sagoma',
    category: '1v1 & 2v2',
    description: 'Percorso atletico e coordinativo con scaletta, birilli di slalom, dribbling su sagoma e conclusione in porta.',
    formationHome: 'Circuito',
    players: [
      { ...INITIAL_SQUAD[1], id: 'dr-p1', x: 976, y: 340, role: 'POR', team: 'home', rotation: 180 },
      { ...INITIAL_SQUAD[8], id: 'dr-p2', x: 651, y: 170, role: 'AD', team: 'home', rotation: 0 },
      { ...INITIAL_SQUAD[10], id: 'dr-p3', x: 630, y: 510, role: 'ATT', team: 'home', rotation: 0 },
    ],
    equipment: [
      { id: 'eq-lad', type: 'ladder', x: 672, y: 170, rotation: 90 },
      { id: 'eq-hur1', type: 'hurdle', x: 735, y: 170, rotation: 0 },
      { id: 'eq-man1', type: 'mannequin', x: 840, y: 258, rotation: 0 },
      { id: 'eq-man2', type: 'mannequin', x: 840, y: 422, rotation: 0 },
      { id: 'eq-pole1', type: 'pole', x: 714, y: 476, rotation: 0 },
      { id: 'eq-pole2', type: 'pole', x: 756, y: 517, rotation: 0 },
      { id: 'eq-pole3', type: 'pole', x: 798, y: 476, rotation: 0 },
      { id: 'eq-b1', type: 'ball', x: 777, y: 170, rotation: 0 },
      { id: 'eq-b2', type: 'ball', x: 819, y: 476, rotation: 0 },
    ],
    drawings: [
      {
        id: 'dr-run-lad',
        type: 'run_arrow',
        points: [{ x: 630, y: 170 }, { x: 766, y: 170 }],
        color: '#facc15',
        strokeWidth: 2,
        strokeDash: '4,4',
      },
      {
        id: 'dr-drib-man',
        type: 'dribble_arrow',
        points: [{ x: 777, y: 170 }, { x: 882, y: 299 }],
        color: '#38bdf8',
        strokeWidth: 2.5,
      },
      {
        id: 'dr-shot',
        type: 'pass_arrow',
        points: [{ x: 882, y: 299 }, { x: 987, y: 326 }],
        color: '#ef4444',
        strokeWidth: 3,
      }
    ],
    drillSheet: {
      title: 'Circuito Agilità, Scaletta & 1v1 con Sagoma',
      category: '1v1 & 2v2',
      durationMinutes: 20,
      playersCount: 'Tutta la rosa a gruppi di 4',
      pitchDimensions: 'Metà Campo Attacco (50 x 68 m)',
      objectivesPrimary: 'Rapidità di frequenza degli appoggi, coordinazione oculo-podalica e reattività al tiro.',
      objectivesSecondary: 'Scelta del tempo di finta e superamento della sagoma/difensore.',
      description: 'I giocatori eseguono skip rapido su scaletta, superano l ostacolo basso, raccolgono il pallone, finta sulla sagoma e tiro di precisione.',
      rulesAndVariations: 'Tiro obbligatorio prima dell ingresso nell area piccola; variante con difensore attivo al posto della sagoma.',
      coachingPoints: 'Baricentro basso nei cambi di direzione; testa alta prima della conclusione.',
      author: 'Mister Catoni',
      date: '2026-09-01'
    }
  }
];
