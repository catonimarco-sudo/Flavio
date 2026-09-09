import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  PlacedPlayer,
  PlacedEquipment,
  TacticalDrawing,
  DrillSheet,
  Player,
  AnimationStep,
  PitchSection,
  PitchTheme,
  JerseyStyle,
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
  jerseyStyle?: JerseyStyle;
  updatedAt?: Timestamp | ReturnType<typeof serverTimestamp>;
  deviceOrigin?: string;
}

export const TACTICS_COLLECTION = 'tactics';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Deeply strips all undefined properties from an object or array.
 * Firestore setDoc strictly rejects objects with undefined properties.
 */
export function removeUndefinedFields<T>(value: T): T {
  if (value === undefined) {
    return undefined as unknown as T;
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => removeUndefinedFields(item)) as unknown as T;
  }

  // Preserve Firestore FieldValues or Timestamps
  if ('_methodName' in (value as any) || (value as any) instanceof Timestamp) {
    return value;
  }

  const cleaned: Record<string, any> = {};
  for (const [key, val] of Object.entries(value)) {
    if (val !== undefined) {
      const cleanedVal = removeUndefinedFields(val);
      if (cleanedVal !== undefined) {
        cleaned[key] = cleanedVal;
      }
    }
  }
  return cleaned as unknown as T;
}

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
  const docPath = `${TACTICS_COLLECTION}/${tacticId}`;
  try {
    const docRef = doc(db, TACTICS_COLLECTION, tacticId);
    const cleanedData = removeUndefinedFields(data);
    const payload = {
      ...cleanedData,
      id: tacticId,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload, { merge: true });
    return tacticId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Load tactic directly once by ID
 */
export async function fetchTacticFromCloud(tacticId: string): Promise<CloudTacticData | null> {
  const docPath = `${TACTICS_COLLECTION}/${tacticId}`;
  try {
    const docRef = doc(db, TACTICS_COLLECTION, tacticId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CloudTacticData;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching tactic from Firestore:', error);
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

/**
 * Subscribe in real-time to changes on the current tactic doc
 */
export function subscribeToTactic(
  tacticId: string,
  onUpdate: (data: CloudTacticData) => void,
  onError?: (err: Error) => void
): () => void {
  const docPath = `${TACTICS_COLLECTION}/${tacticId}`;
  try {
    const docRef = doc(db, TACTICS_COLLECTION, tacticId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            const data = docSnap.data() as CloudTacticData;
            onUpdate(data);
          }
        } catch (dataErr) {
          console.error('Error processing tactic snapshot data:', dataErr);
        }
      },
      (error) => {
        console.warn('Real-time sync error on tactic:', error);
        if (onError) {
          try {
            handleFirestoreError(error, OperationType.GET, docPath);
          } catch (wrappedErr) {
            onError(wrappedErr as Error);
          }
        }
      }
    );

    return unsubscribe;
  } catch (subErr) {
    console.warn('Failed to attach onSnapshot listener:', subErr);
    if (onError && subErr instanceof Error) {
      try {
        handleFirestoreError(subErr, OperationType.GET, docPath);
      } catch (wrappedErr) {
        onError(wrappedErr as Error);
      }
    }
    return () => {};
  }
}

