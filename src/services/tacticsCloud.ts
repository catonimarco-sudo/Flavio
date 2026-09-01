import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  PlacedPlayer,
  PlacedEquipment,
  TacticalDrawing,
  DrillSheet,
  Player,
  AnimationStep,
  PitchSection,
  PitchTheme,
} from '../types';

export interface CloudTacticData {
  id: string;
  title: string;
  squad: Player[];
  players: PlacedPlayer[];
  equipment: PlacedEquipment[];
  drawings: TacticalDrawing[];
  drillSheet: DrillSheet;
  animationSteps?: AnimationStep[];
  pitchSection?: PitchSection;
  pitchTheme?: PitchTheme;
  jerseyStyle?: 'shirt' | 'circle' | 'vest';
  updatedAt?: Timestamp | ReturnType<typeof serverTimestamp>;
  deviceOrigin?: string;
}

export const TACTICS_COLLECTION = 'tactics';

/**
 * Generate a random memorable tactic ID or short slug
 */
export function generateTacticId(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `tactic-${result}`;
}

/**
 * Save complete whiteboard tactic to Firestore
 */
export async function saveTacticToCloud(
  tacticId: string,
  data: Omit<CloudTacticData, 'id' | 'updatedAt'>
): Promise<string> {
  const docRef = doc(db, TACTICS_COLLECTION, tacticId);
  const payload = {
    ...data,
    id: tacticId,
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, payload, { merge: true });
  return tacticId;
}

/**
 * Load tactic directly once by ID
 */
export async function fetchTacticFromCloud(tacticId: string): Promise<CloudTacticData | null> {
  const docRef = doc(db, TACTICS_COLLECTION, tacticId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as CloudTacticData;
  }
  return null;
}

/**
 * Subscribe in real-time to changes on the current tactic doc
 */
export function subscribeToTactic(
  tacticId: string,
  onUpdate: (data: CloudTacticData) => void,
  onError?: (err: Error) => void
): () => void {
  const docRef = doc(db, TACTICS_COLLECTION, tacticId);
  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as CloudTacticData;
        onUpdate(data);
      }
    },
    (error) => {
      console.error('Real-time sync error on tactic:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}
