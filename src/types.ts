export type Role =
  | 'POR'
  | 'DC'
  | 'TD'
  | 'TS'
  | 'DCD'
  | 'DCS'
  | 'LIB'
  | 'MED'
  | 'CC'
  | 'MEZ'
  | 'TRQ'
  | 'ED'
  | 'ES'
  | 'AD'
  | 'AS'
  | 'ATT'
  | 'P'
  | 'SP'
  | 'JOL'
  | 'ARB';

export type TeamColor = 'blue' | 'red' | 'yellow' | 'green' | 'black' | 'white' | 'purple' | 'orange';

export interface Player {
  id: string;
  name: string;
  number: number;
  role: Role;
  team: 'home' | 'away' | 'jolly' | 'keeper' | 'referee';
  customColor?: string;
  photoUrl?: string; // photo avatar URL or data URI
  avatarType?: 'photo' | 'initials' | 'number' | 'face_avatar';
  preferredFoot?: 'Destro' | 'Sinistro' | 'Ambidestro';
  age?: number;
  notes?: string;
}

export interface PlacedPlayer extends Player {
  x: number; // pitch width coordinate (0 - 1050)
  y: number; // pitch height coordinate (0 - 680)
  rotation: number; // angle in degrees 0-360
  isSelected?: boolean;
  squadPlayerId?: string;
}

export type EquipmentType =
  | 'ball'
  | 'cone_orange'
  | 'disc_yellow'
  | 'disc_red'
  | 'disc_blue'
  | 'disc_green'
  | 'mini_goal'
  | 'pole'
  | 'ladder'
  | 'mannequin'
  | 'hurdle'
  | 'ring';

export interface PlacedEquipment {
  id: string;
  type: EquipmentType;
  x: number; // 0 - 100
  y: number; // 0 - 100
  rotation: number; // 0 - 360
  scale?: number;
  color?: string;
  label?: string;
  isSelected?: boolean;
}

export type ToolType =
  | 'select'
  | 'run_arrow' // corsa tratteggiata
  | 'pass_arrow' // passaggio linea continua con freccia
  | 'dribble_arrow' // linea a zig zag / ondulata
  | 'curve_arrow' // freccia curva
  | 'press_arrow' // pressing aggressivo
  | 'line' // linea semplice
  | 'freehand' // schizzo libero
  | 'zone_rect' // area rettangolare
  | 'zone_circle' // cerchio / ovale
  | 'text' // casella di testo
  | 'eraser'; // gomma per cancellare

export interface DrawingPoint {
  x: number; // 0 - 100 percentage
  y: number; // 0 - 100 percentage
}

export interface TacticalDrawing {
  id: string;
  type: ToolType;
  points: DrawingPoint[]; // start, end or path points
  controlPoint?: DrawingPoint; // for curves
  color: string;
  strokeWidth: number;
  strokeDash?: string;
  text?: string;
  fill?: string;
  isSelected?: boolean;
}

export type PitchSection =
  | 'full_horizontal'
  | 'full_vertical'
  | 'attack_half'
  | 'defense_half'
  | 'trequarti'
  | 'right_flank'
  | 'left_flank'
  | 'penalty_box';

export type PitchTheme = 'stripes' | 'classic' | 'dark_tactical' | 'light_turf';

export interface AnimationStep {
  id: string;
  name: string;
  players: PlacedPlayer[];
  equipment: PlacedEquipment[];
  drawings: TacticalDrawing[];
  durationMs: number; // transition duration
}

export interface DrillSheet {
  id: string;
  title: string;
  category: 'Riscaldamento' | 'Possesso Palla' | 'Tattica Collettiva' | 'Transizione' | 'Tiri in Porta' | '1v1 & 2v2' | 'Palle Inattive' | 'Fisico & Coordinazione' | 'Portieri';
  durationMinutes: number;
  playersCount: string;
  pitchDimensions: string;
  objectivesPrimary: string;
  objectivesSecondary: string;
  description: string;
  rulesAndVariations: string;
  coachingPoints: string;
  author: string;
  date: string;
}

export interface PresetTactic {
  id: string;
  name: string;
  category: string;
  description: string;
  formationHome?: string;
  formationAway?: string;
  players: PlacedPlayer[];
  equipment: PlacedEquipment[];
  drawings: TacticalDrawing[];
  drillSheet?: Partial<DrillSheet>;
}
