import { PlacedPlayer, Player } from '../types';

export interface FormationTemplate {
  name: string;
  positions: { role: string; x: number; y: number; label: string }[];
}

export const FORMATIONS_HORIZONTAL: Record<string, FormationTemplate> = {
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { role: 'POR', x: 6, y: 50, label: 'POR' },
      { role: 'TD', x: 23, y: 84, label: 'TD' },
      { role: 'DC', x: 20, y: 62, label: 'DCD' },
      { role: 'DC', x: 20, y: 38, label: 'DCS' },
      { role: 'TS', x: 23, y: 16, label: 'TS' },
      { role: 'MED', x: 33, y: 60, label: 'MED' },
      { role: 'MED', x: 33, y: 40, label: 'MED' },
      { role: 'ED', x: 42, y: 82, label: 'ED' },
      { role: 'TRQ', x: 42, y: 50, label: 'TRQ' },
      { role: 'ES', x: 42, y: 18, label: 'ES' },
      { role: 'ATT', x: 48, y: 50, label: 'P' },
    ],
  },
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { role: 'POR', x: 6, y: 50, label: 'POR' },
      { role: 'TD', x: 23, y: 84, label: 'TD' },
      { role: 'DC', x: 20, y: 62, label: 'DCD' },
      { role: 'DC', x: 20, y: 38, label: 'DCS' },
      { role: 'TS', x: 23, y: 16, label: 'TS' },
      { role: 'MED', x: 31, y: 50, label: 'REG' },
      { role: 'CC', x: 37, y: 68, label: 'MEZ' },
      { role: 'CC', x: 37, y: 32, label: 'MEZ' },
      { role: 'AD', x: 44, y: 82, label: 'AD' },
      { role: 'AS', x: 44, y: 18, label: 'AS' },
      { role: 'ATT', x: 48, y: 50, label: 'P' },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { role: 'POR', x: 6, y: 50, label: 'POR' },
      { role: 'DCD', x: 20, y: 72, label: 'DCD' },
      { role: 'DC', x: 19, y: 50, label: 'DC' },
      { role: 'DCS', x: 20, y: 28, label: 'DCS' },
      { role: 'ED', x: 34, y: 88, label: 'ED' },
      { role: 'CC', x: 33, y: 65, label: 'MEZ' },
      { role: 'MED', x: 30, y: 50, label: 'REG' },
      { role: 'CC', x: 33, y: 35, label: 'MEZ' },
      { role: 'ES', x: 34, y: 12, label: 'ES' },
      { role: 'ATT', x: 46, y: 60, label: 'SP' },
      { role: 'ATT', x: 47, y: 40, label: 'P' },
    ],
  },
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { role: 'POR', x: 6, y: 50, label: 'POR' },
      { role: 'TD', x: 23, y: 84, label: 'TD' },
      { role: 'DC', x: 20, y: 62, label: 'DCD' },
      { role: 'DC', x: 20, y: 38, label: 'DCS' },
      { role: 'TS', x: 23, y: 16, label: 'TS' },
      { role: 'ED', x: 36, y: 84, label: 'ED' },
      { role: 'CC', x: 34, y: 62, label: 'CC' },
      { role: 'CC', x: 34, y: 38, label: 'CC' },
      { role: 'ES', x: 36, y: 16, label: 'ES' },
      { role: 'ATT', x: 46, y: 60, label: 'SP' },
      { role: 'ATT', x: 46, y: 40, label: 'P' },
    ],
  },
  '3-4-3': {
    name: '3-4-3',
    positions: [
      { role: 'POR', x: 6, y: 50, label: 'POR' },
      { role: 'DCD', x: 20, y: 72, label: 'DCD' },
      { role: 'DC', x: 19, y: 50, label: 'DC' },
      { role: 'DCS', x: 20, y: 28, label: 'DCS' },
      { role: 'ED', x: 33, y: 86, label: 'ED' },
      { role: 'CC', x: 32, y: 60, label: 'CC' },
      { role: 'CC', x: 32, y: 40, label: 'CC' },
      { role: 'ES', x: 33, y: 14, label: 'ES' },
      { role: 'AD', x: 44, y: 78, label: 'AD' },
      { role: 'AS', x: 44, y: 22, label: 'AS' },
      { role: 'ATT', x: 47, y: 50, label: 'P' },
    ],
  },
};

export const OPPONENT_FORMATIONS: Record<string, FormationTemplate> = {
  '4-3-3': {
    name: '4-3-3 Difensivo',
    positions: [
      { role: 'POR', x: 94, y: 50, label: 'POR' },
      { role: 'TD', x: 77, y: 16, label: 'TD' },
      { role: 'DC', x: 80, y: 38, label: 'DCD' },
      { role: 'DC', x: 80, y: 62, label: 'DCS' },
      { role: 'TS', x: 77, y: 84, label: 'TS' },
      { role: 'MED', x: 69, y: 50, label: 'MED' },
      { role: 'CC', x: 63, y: 32, label: 'CC' },
      { role: 'CC', x: 63, y: 68, label: 'CC' },
      { role: 'AD', x: 56, y: 18, label: 'AD' },
      { role: 'AS', x: 56, y: 82, label: 'AS' },
      { role: 'ATT', x: 52, y: 50, label: 'ATT' },
    ],
  },
  '4-4-2': {
    name: '4-4-2 Blocco Medio',
    positions: [
      { role: 'POR', x: 94, y: 50, label: 'POR' },
      { role: 'TD', x: 77, y: 16, label: 'TD' },
      { role: 'DC', x: 80, y: 38, label: 'DCD' },
      { role: 'DC', x: 80, y: 62, label: 'DCS' },
      { role: 'TS', x: 77, y: 84, label: 'TS' },
      { role: 'ED', x: 64, y: 16, label: 'ED' },
      { role: 'CC', x: 66, y: 38, label: 'CC' },
      { role: 'CC', x: 66, y: 62, label: 'CC' },
      { role: 'ES', x: 64, y: 84, label: 'ES' },
      { role: 'ATT', x: 54, y: 40, label: 'ATT' },
      { role: 'ATT', x: 54, y: 60, label: 'ATT' },
    ],
  }
};

export function createPlacedPlayersFromSquad(
  squad: Player[],
  formationKey: string = '4-2-3-1'
): PlacedPlayer[] {
  const formation = FORMATIONS_HORIZONTAL[formationKey] || FORMATIONS_HORIZONTAL['4-2-3-1'];
  return formation.positions.map((pos, idx) => {
    const squadPlayer = squad[idx] || {
      id: `gen-p-${idx + 1}`,
      name: `Giocatore ${idx + 1}`,
      number: idx + 1,
      role: pos.role as any,
      team: 'home' as const,
      avatarType: 'photo' as const,
    };

    // Convert from percentage (0-100) to SVG canvas coordinates (1050x680)
    const scaledX = Math.round((pos.x / 100) * 1050);
    const scaledY = Math.round((pos.y / 100) * 680);

    return {
      ...squadPlayer,
      id: squadPlayer.id,
      role: (squadPlayer.role || pos.role) as any,
      x: scaledX,
      y: scaledY,
      rotation: 0,
    };
  });
}
