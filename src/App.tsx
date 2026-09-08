import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlacedPlayer,
  PlacedEquipment,
  TacticalDrawing,
  ToolType,
  PitchSection,
  PitchTheme,
  Player,
  Role,
  DrillSheet,
  PresetTactic,
  AnimationStep,
  EquipmentType,
  JerseyStyle,
} from './types';
import { INITIAL_SQUAD, INITIAL_AWAY_SQUAD } from './data/defaultPlayers';
import { PRESET_TACTICS } from './data/presetTactics';
import { FORMATIONS_HORIZONTAL, OPPONENT_FORMATIONS, createPlacedPlayersFromSquad } from './data/presetFormations';
import { FACE_PRESETS, generateFaceSvg } from './data/avatarPresets';
import { TacticalPitch } from './components/TacticalPitch';
import { ToolbarTactics } from './components/ToolbarTactics';
import { ToolbarEquipment } from './components/ToolbarEquipment';
import { ToolbarPitchSettings } from './components/ToolbarPitchSettings';
import { Header } from './components/Header';
import { SquadModal } from './components/SquadModal';
import { DrillSheetModal } from './components/DrillSheetModal';
import { PresetsModal } from './components/PresetsModal';
import { ExportModal } from './components/ExportModal';
import { PlayerEditPopover } from './components/PlayerEditPopover';
import { AnimationControls } from './components/AnimationControls';
import { X, Sparkles, Layers, Eye, Trash2, RotateCw, Copy, Settings } from 'lucide-react';
import { CloudSyncStatus } from './components/Header';
import {
  saveTacticToCloud,
  fetchTacticFromCloud,
  subscribeToTactic,
  generateTacticId,
  CloudTacticData,
} from './services/tacticsCloud';

const getEquipmentInfo = (type: EquipmentType) => {
  switch (type) {
    case 'ball': return { name: 'Pallone', icon: '⚽' };
    case 'cone_orange': return { name: 'Cono Arancione', icon: '🔺' };
    case 'disc_yellow': return { name: 'Cinesino Giallo', icon: '🟡' };
    case 'disc_red': return { name: 'Cinesino Rosso', icon: '🔴' };
    case 'disc_blue': return { name: 'Cinesino Blu', icon: '🔵' };
    case 'disc_green': return { name: 'Cinesino Verde', icon: '🟢' };
    case 'mini_goal': return { name: 'Porticina', icon: '🥅' };
    case 'pole': return { name: 'Paletto Slalom', icon: '🦯' };
    case 'ladder': return { name: 'Scaletta Agilità', icon: '🪜' };
    case 'mannequin': return { name: 'Sagoma Barriera', icon: '🧍' };
    case 'hurdle': return { name: 'Ostacolo Basso', icon: '🚧' };
    case 'ring': return { name: 'Cerchio Coordinativo', icon: '⭕' };
    default: return { name: 'Attrezzo', icon: '📦' };
  }
};

const getDrawingInfo = (type: ToolType) => {
  switch (type) {
    case 'pass_arrow': return { name: 'Freccia Passaggio', icon: '➡️' };
    case 'run_arrow': return { name: 'Corsa Tratteggiata', icon: '〰️' };
    case 'dribble_arrow': return { name: 'Dribbling / Conduzione', icon: '⚡' };
    case 'curve_arrow': return { name: 'Traiettoria Curva', icon: '⤴️' };
    case 'press_arrow': return { name: 'Pressing Aggressivo', icon: '🔥' };
    case 'line': return { name: 'Linea Tattica', icon: '📏' };
    case 'freehand': return { name: 'Schizzo a Mano Libera', icon: '✏️' };
    case 'zone_rect': return { name: 'Zona Rettangolare', icon: '🔲' };
    case 'zone_circle': return { name: 'Zona Circolare', icon: '⚪' };
    case 'text': return { name: 'Etichetta Testo', icon: '📝' };
    default: return { name: 'Disegno', icon: '✏️' };
  }
};

const STORAGE_KEY = 'mister_tactics_state_v1';

function sanitizeCoords<T extends { x: number; y: number }>(item: T): T {
  let { x, y } = item;
  // If coordinates look like legacy 0-100 percentage
  if (x <= 100 && y <= 100 && x >= 0 && y >= 0) {
    x = Math.round((x / 100) * 1050);
    y = Math.round((y / 100) * 680);
  }
  return { ...item, x, y };
}

export function deduplicateById<T extends { id: string }>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!item) continue;
    if (!item.id) {
      const generatedId = `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      result.push({ ...item, id: generatedId });
      seen.add(generatedId);
      continue;
    }
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    } else {
      // Duplicate ID detected - reassign unique ID to preserve item and prevent React key collision
      const uniqueId = `${item.id}-${Math.random().toString(36).substring(2, 6)}`;
      seen.add(uniqueId);
      result.push({ ...item, id: uniqueId });
    }
  }
  return result;
}

function sanitizeDrawing(dr: TacticalDrawing): TacticalDrawing {
  const points = (dr.points || []).map((pt) => {
    if (pt.x <= 100 && pt.y <= 100) {
      return {
        x: Math.round((pt.x / 100) * 1050),
        y: Math.round((pt.y / 100) * 680),
      };
    }
    return pt;
  });
  let controlPoint = dr.controlPoint;
  if (controlPoint && controlPoint.x <= 100 && controlPoint.y <= 100) {
    controlPoint = {
      x: Math.round((controlPoint.x / 100) * 1050),
      y: Math.round((controlPoint.y / 100) * 680),
    };
  }
  return { ...dr, points, controlPoint };
}

function sanitizeDrawingsList(drawings: TacticalDrawing[]): TacticalDrawing[] {
  if (!Array.isArray(drawings)) return [];
  return deduplicateById(drawings.map(sanitizeDrawing));
}

function sanitizePlayersList(players: PlacedPlayer[]): PlacedPlayer[] {
  if (!Array.isArray(players)) return [];
  return deduplicateById(players.map(sanitizeCoords));
}

function sanitizeEquipmentList(eq: PlacedEquipment[]): PlacedEquipment[] {
  if (!Array.isArray(eq)) return [];
  return deduplicateById(eq.map(sanitizeCoords));
}

export default function App() {
  // --- Persistent or Initial States ---
  const [squad, setSquad] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_squad`);
      return saved !== null ? JSON.parse(saved) : INITIAL_SQUAD;
    } catch {
      return INITIAL_SQUAD;
    }
  });

  const [tacticTitle, setTacticTitle] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tactic_title`);
      return saved !== null ? saved : 'Costruzione Tattica e Sviluppo per Reparti (4-2-3-1)';
    } catch {
      return 'Costruzione Tattica e Sviluppo per Reparti (4-2-3-1)';
    }
  });

  const [drillSheet, setDrillSheet] = useState<DrillSheet>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_drill_sheet`);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {}
    return (
      (PRESET_TACTICS[0].drillSheet as DrillSheet) || {
        id: 'drill-1',
        title: 'Costruzione Tattica e Sviluppo per Reparti (4-2-3-1)',
        category: 'Tattica Collettiva',
        durationMinutes: 25,
        playersCount: '11 vs 10 + 2 POR',
        pitchDimensions: 'Campo Intero (105 x 68 m)',
        objectivesPrimary: 'Costruzione bassa e scaglionamento dei 2 mediani.',
        objectivesSecondary: 'Ampiezza massima dei terzini e isolamento 1v1.',
        description: 'Avvio azione dal portiere verso il centrale. Mediano offre scarico e TRQ attacca lo spazio tra le linee.',
        rulesAndVariations: 'Massimo 2 tocchi nella metà campo difensiva.',
        coachingPoints: 'Postura aperta del corpo e testa alta.',
        author: 'Mister Catoni',
        date: '2026-09-01',
      }
    );
  });

  // Pitch state with automatic coordinate sanitation and localStorage persistence
  const [players, setPlayers] = useState<PlacedPlayer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_players`);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? sanitizePlayersList(parsed) : [];
      }
    } catch {}
    return sanitizePlayersList(PRESET_TACTICS[0].players || []);
  });

  const [equipment, setEquipment] = useState<PlacedEquipment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_equipment`);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? sanitizeEquipmentList(parsed) : [];
      }
    } catch {}
    return sanitizeEquipmentList(PRESET_TACTICS[0].equipment || []);
  });

  const [drawings, setDrawings] = useState<TacticalDrawing[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_drawings`);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? sanitizeDrawingsList(parsed) : [];
      }
    } catch {}
    return sanitizeDrawingsList(PRESET_TACTICS[0].drawings || []);
  });

  // Active Tool & Settings
  const [selectedTool, setSelectedTool] = useState<ToolType>('select');
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);

  const [pitchSection, setPitchSection] = useState<PitchSection>('full_horizontal');
  const [pitchTheme, setPitchTheme] = useState<PitchTheme>('stripes');
  const [showHalfSpaces, setShowHalfSpaces] = useState<boolean>(false);
  const [showDepartmentLines, setShowDepartmentLines] = useState<boolean>(false);

  // Player Display Toggles
  const [showPhotos, setShowPhotos] = useState<boolean>(true);
  const [showNames, setShowNames] = useState<boolean>(true);
  const [showNumbers, setShowNumbers] = useState<boolean>(true);
  const [showRoles, setShowRoles] = useState<boolean>(true);
  const [showOrientation, setShowOrientation] = useState<boolean>(true);
  const [jerseyStyle, setJerseyStyle] = useState<JerseyStyle>('broadcast');

  // Layout toggles (Default closed for maximized pitch view)
  const [showSquadSidebar, setShowSquadSidebar] = useState<boolean>(false);
  const [showSessionSidebar, setShowSessionSidebar] = useState<boolean>(false);

  // Selected Pitch Node
  const [selectedPlayer, setSelectedPlayer] = useState<PlacedPlayer | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<PlacedPlayer | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<PlacedEquipment | null>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<TacticalDrawing | null>(null);

  // Modals
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<
    { players: PlacedPlayer[]; equipment: PlacedEquipment[]; drawings: TacticalDrawing[] }[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    { players: PlacedPlayer[]; equipment: PlacedEquipment[]; drawings: TacticalDrawing[] }[]
  >([]);

  // Animation Controls State
  const [showAnimationBar, setShowAnimationBar] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  // Animation Steps state with localStorage persistence
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_animation_steps`);
      if (saved !== null) {
        const parsed: AnimationStep[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((step) => ({
            ...step,
            players: sanitizePlayersList(step.players || []),
            equipment: sanitizeEquipmentList(step.equipment || []),
            drawings: sanitizeDrawingsList(step.drawings || []),
          }));
        }
      }
    } catch {}

    return [
      {
        id: 'step-1',
        name: 'Fase 1 (Inizio)',
        players: sanitizePlayersList(PRESET_TACTICS[0].players || []),
        equipment: sanitizeEquipmentList(PRESET_TACTICS[0].equipment || []),
        drawings: sanitizeDrawingsList(PRESET_TACTICS[0].drawings || []),
        durationMs: 1500,
      },
      {
        id: 'step-2',
        name: 'Fase 2 (Sviluppo)',
        players: sanitizePlayersList((PRESET_TACTICS[0].players || []).map((p) => {
          const clean = sanitizeCoords(p);
          return {
            ...clean,
            x: Math.min(1000, clean.x + (clean.team === 'home' ? 80 : -40)),
          };
        })),
        equipment: sanitizeEquipmentList(PRESET_TACTICS[0].equipment || []),
        drawings: sanitizeDrawingsList(PRESET_TACTICS[0].drawings || []),
        durationMs: 1500,
      },
    ];
  });

  const pitchSvgRef = useRef<SVGSVGElement | null>(null);

  // Cloud Sync & Realtime States
  const [currentTacticId, setCurrentTacticId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id');
      if (urlId) return urlId;
    }
    try {
      return localStorage.getItem(`${STORAGE_KEY}_current_cloud_id`) || null;
    } catch {
      return null;
    }
  });

  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('idle');
  const [cloudErrorMessage, setCloudErrorMessage] = useState<string | null>(null);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const isApplyingRemoteUpdateRef = useRef(false);

  // Push state to undo history
  const recordHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-25), // keep last 25 actions
      { players, equipment, drawings },
    ]);
    setRedoStack([]);
  }, [players, equipment, drawings]);

  // Unified State Updaters that auto-sync with active animation step
  const updatePlayersWithStep = useCallback((
    newPlayers: PlacedPlayer[] | ((prev: PlacedPlayer[]) => PlacedPlayer[])
  ) => {
    setPlayers((prev) => {
      const resolved = typeof newPlayers === 'function' ? newPlayers(prev) : newPlayers;
      const cleanPlayers = sanitizePlayersList(resolved);
      setAnimationSteps((steps) =>
        steps.map((step, idx) =>
          idx === activeStepIndex ? { ...step, players: cleanPlayers } : step
        )
      );
      return cleanPlayers;
    });
  }, [activeStepIndex]);

  const updateEquipmentWithStep = useCallback((
    newEq: PlacedEquipment[] | ((prev: PlacedEquipment[]) => PlacedEquipment[])) => {
    setEquipment((prev) => {
      const resolved = typeof newEq === 'function' ? newEq(prev) : newEq;
      const cleanEquipment = sanitizeEquipmentList(resolved);
      setAnimationSteps((steps) =>
        steps.map((step, idx) =>
          idx === activeStepIndex ? { ...step, equipment: cleanEquipment } : step
        )
      );
      return cleanEquipment;
    });
  }, [activeStepIndex]);

  const updateDrawingsWithStep = useCallback((
    newDr: TacticalDrawing[] | ((prev: TacticalDrawing[]) => TacticalDrawing[])) => {
    setDrawings((prev) => {
      const resolved = typeof newDr === 'function' ? newDr(prev) : newDr;
      const cleanDrawings = sanitizeDrawingsList(resolved);
      setAnimationSteps((steps) =>
        steps.map((step, idx) =>
          idx === activeStepIndex ? { ...step, drawings: cleanDrawings } : step
        )
      );
      return cleanDrawings;
    });
  }, [activeStepIndex]);

  // Auto-persist all board states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_squad`, JSON.stringify(squad));
    } catch (e) {
      console.warn('localStorage error for squad:', e);
    }
  }, [squad]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(players));
    } catch (e) {
      console.warn('localStorage error for players:', e);
    }
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_equipment`, JSON.stringify(equipment));
    } catch (e) {
      console.warn('localStorage error for equipment:', e);
    }
  }, [equipment]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_drawings`, JSON.stringify(drawings));
    } catch (e) {
      console.warn('localStorage error for drawings:', e);
    }
  }, [drawings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_animation_steps`, JSON.stringify(animationSteps));
    } catch (e) {
      console.warn('localStorage error for animationSteps:', e);
    }
  }, [animationSteps]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tactic_title`, tacticTitle);
    } catch (e) {}
  }, [tacticTitle]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_drill_sheet`, JSON.stringify(drillSheet));
    } catch (e) {}
  }, [drillSheet]);

  // Persist current cloud tactic ID to localStorage and URL safely
  useEffect(() => {
    if (currentTacticId) {
      try {
        localStorage.setItem(`${STORAGE_KEY}_current_cloud_id`, currentTacticId);
      } catch {}
      // Update URL without full page reload, guarded for sandboxed iframes
      try {
        if (typeof window !== 'undefined' && window.location && window.history) {
          const url = new URL(window.location.href);
          if (url.searchParams.get('id') !== currentTacticId) {
            url.searchParams.set('id', currentTacticId);
            window.history.replaceState({}, '', url.toString());
          }
        }
      } catch {
        // Sandboxed iframes may block history.replaceState
      }
    }
  }, [currentTacticId]);

  // Real-time Firestore onSnapshot listener
  useEffect(() => {
    if (!currentTacticId) return;

    setCloudSyncStatus('live');
    const unsubscribe = subscribeToTactic(
      currentTacticId,
      (cloudData: CloudTacticData) => {
        if (!cloudData) return;

        isApplyingRemoteUpdateRef.current = true;

        if (cloudData.title) setTacticTitle(cloudData.title);
        if (cloudData.squad && Array.isArray(cloudData.squad)) setSquad(cloudData.squad);
        if (cloudData.drillSheet) setDrillSheet(cloudData.drillSheet);
        if (cloudData.pitchSection) setPitchSection(cloudData.pitchSection);
        if (cloudData.pitchTheme) setPitchTheme(cloudData.pitchTheme);
        if (cloudData.jerseyStyle) setJerseyStyle(cloudData.jerseyStyle);

        if (cloudData.players && Array.isArray(cloudData.players)) {
          setPlayers(sanitizePlayersList(cloudData.players));
        }
        if (cloudData.equipment && Array.isArray(cloudData.equipment)) {
          setEquipment(sanitizeEquipmentList(cloudData.equipment));
        }
        if (cloudData.drawings && Array.isArray(cloudData.drawings)) {
          setDrawings(sanitizeDrawingsList(cloudData.drawings));
        }
        if (cloudData.animationSteps && Array.isArray(cloudData.animationSteps)) {
          setAnimationSteps(
            cloudData.animationSteps.map((step) => ({
              ...step,
              players: sanitizePlayersList(step.players || []),
              equipment: sanitizeEquipmentList(step.equipment || []),
              drawings: sanitizeDrawingsList(step.drawings || []),
            }))
          );
        }

        setCloudSyncStatus('saved');
        setTimeout(() => {
          isApplyingRemoteUpdateRef.current = false;
        }, 300);
      },
      (error) => {
        console.error('Firestore sync error:', error);
        setCloudSyncStatus('error');
        setCloudErrorMessage('Errore connessione Firestore');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentTacticId]);

  // Initial Load by URL query param ?id=
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get('id');
        if (urlId && urlId !== currentTacticId) {
          setCurrentTacticId(urlId);
        }
      }
    } catch {
      // Ignore URL access restrictions
    }
  }, []);

  // Save current whiteboard state to Firestore Cloud
  const handleSaveToCloud = async (overrideId?: string) => {
    const idToSave = overrideId || currentTacticId || generateTacticId();
    setCloudSyncStatus('saving');
    setCloudErrorMessage(null);

    try {
      await saveTacticToCloud(idToSave, {
        title: tacticTitle,
        squad,
        players,
        equipment,
        drawings,
        drillSheet,
        animationSteps,
        pitchSection,
        pitchTheme,
        jerseyStyle,
        deviceOrigin: typeof navigator !== 'undefined' ? navigator.userAgent : 'web',
      });

      if (currentTacticId !== idToSave) {
        setCurrentTacticId(idToSave);
      }
      setCloudSyncStatus('saved');
    } catch (err: any) {
      console.error('Error saving tactic to Firestore:', err);
      setCloudSyncStatus('error');
      setCloudErrorMessage(err?.message || 'Errore durante il salvataggio Firestore');
    }
  };

  // Copy shareable link to clipboard (?id=...)
  const handleCopyShareLink = () => {
    if (!currentTacticId) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const shareUrl = `${origin}${pathname}?id=${encodeURIComponent(currentTacticId)}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setIsCopiedLink(true);
        setTimeout(() => setIsCopiedLink(false), 2500);
      }).catch(() => {
        prompt('Copia questo link per condividere lo schema:', shareUrl);
      });
    } else {
      prompt('Copia questo link per condividere lo schema:', shareUrl);
    }
  };

  // Undo / Redo handlers
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [{ players, equipment, drawings }, ...prev]);
    updatePlayersWithStep(previous.players);
    updateEquipmentWithStep(previous.equipment);
    updateDrawingsWithStep(previous.drawings);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, { players, equipment, drawings }]);
    updatePlayersWithStep(next.players);
    updateEquipmentWithStep(next.equipment);
    updateDrawingsWithStep(next.drawings);
    setRedoStack((prev) => prev.slice(1));
  };

  // Clear Board Actions (Svuota Tutto)
  const handleClearAll = (type: 'all' | 'drawings' | 'equipment' | 'opponents' = 'all') => {
    recordHistory();
    if (type === 'all') {
      updateDrawingsWithStep([]);
      updateEquipmentWithStep([]);
      updatePlayersWithStep([]);
      setSelectedPlayer(null);
      setSelectedEquipment(null);
      setSelectedDrawing(null);
    } else if (type === 'drawings') {
      updateDrawingsWithStep([]);
      setSelectedDrawing(null);
    } else if (type === 'equipment') {
      updateEquipmentWithStep([]);
      setSelectedEquipment(null);
    } else if (type === 'opponents') {
      updatePlayersWithStep((prev) => prev.filter((p) => p.team !== 'away'));
    }
  };

  // Delete individual items with history
  const handleDeletePlayer = (id: string) => {
    recordHistory();
    updatePlayersWithStep((prev) => prev.filter((p) => p.id !== id));
    if (selectedPlayer?.id === id) setSelectedPlayer(null);
    if (editingPlayer?.id === id) setEditingPlayer(null);
  };

  const handleDeleteEquipment = (id: string) => {
    recordHistory();
    updateEquipmentWithStep((prev) => prev.filter((e) => e.id !== id));
    if (selectedEquipment?.id === id) setSelectedEquipment(null);
  };

  const handleDeleteDrawing = (id: string) => {
    recordHistory();
    updateDrawingsWithStep((prev) => prev.filter((d) => d.id !== id));
    if (selectedDrawing?.id === id) setSelectedDrawing(null);
  };

  const handleDeleteSelectedObject = () => {
    if (selectedPlayer) {
      handleDeletePlayer(selectedPlayer.id);
    } else if (selectedEquipment) {
      handleDeleteEquipment(selectedEquipment.id);
    } else if (selectedDrawing) {
      handleDeleteDrawing(selectedDrawing.id);
    }
  };

  const handleDuplicateEquipment = (eq: PlacedEquipment) => {
    recordHistory();
    const copy: PlacedEquipment = {
      ...eq,
      id: `eq-${Date.now()}`,
      x: Math.min(1000, eq.x + 30),
      y: Math.min(640, eq.y + 30),
    };
    updateEquipmentWithStep((prev) => [...prev, copy]);
    setSelectedEquipment(copy);
  };

  const handleRotateEquipment = (id: string, deltaDeg = 45) => {
    recordHistory();
    updateEquipmentWithStep((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextRot = (((item.rotation || 0) + deltaDeg) % 360 + 360) % 360;
        return { ...item, rotation: nextRot };
      })
    );
    if (selectedEquipment && selectedEquipment.id === id) {
      const nextRot = (((selectedEquipment.rotation || 0) + deltaDeg) % 360 + 360) % 360;
      setSelectedEquipment({ ...selectedEquipment, rotation: nextRot });
    }
  };

  // Add Equipment to pitch center
  const handleAddEquipment = (type: EquipmentType) => {
    recordHistory();
    const newEq: PlacedEquipment = {
      id: `eq-${Date.now()}`,
      type,
      x: 525 + (Math.random() * 60 - 30),
      y: 340 + (Math.random() * 60 - 30),
      rotation: 0,
    };
    updateEquipmentWithStep((prev) => [...prev, newEq]);
    setSelectedTool('select');
  };

  // Add Player to Pitch (quick button or squad modal)
  const handleAddPlayer = (
    team: 'home' | 'away' | 'jolly' | 'keeper' | 'referee',
    role: Role = 'CC'
  ) => {
    recordHistory();
    const newNumber = players.filter((p) => p.team === team).length + 1;
    const randomFace = FACE_PRESETS[Math.floor(Math.random() * FACE_PRESETS.length)];
    const newPlayer: PlacedPlayer = {
      id: `player-${Date.now()}`,
      name: team === 'home' ? `Giocatore ${newNumber}` : team === 'away' ? `Avversario ${newNumber}` : team === 'jolly' ? 'Jolly' : team === 'referee' ? 'Arbitro' : 'Portiere',
      number: role === 'POR' ? 1 : newNumber,
      role,
      team,
      avatarType: 'photo',
      photoUrl: generateFaceSvg(randomFace),
      x: 525 + (Math.random() * 80 - 40),
      y: 340 + (Math.random() * 80 - 40),
      rotation: team === 'away' ? 180 : 0,
    };
    updatePlayersWithStep((prev) => [...prev, newPlayer]);
    setSelectedPlayer(newPlayer);
    setSelectedTool('select');
  };

  // Spawn specific player from Squad list to pitch
  const handleSpawnPlayerFromSquad = (squadPlayer: Player, team: 'home' | 'away' = 'home') => {
    recordHistory();
    // check if already placed
    const existingIndex = players.findIndex((p) => p.id === squadPlayer.id || p.squadPlayerId === squadPlayer.id);
    if (existingIndex >= 0) {
      // Just select and focus
      setSelectedPlayer(players[existingIndex]);
      return;
    }

    const placed: PlacedPlayer = {
      ...squadPlayer,
      squadPlayerId: squadPlayer.id,
      team,
      x: 525 + (Math.random() * 60 - 30),
      y: 340 + (Math.random() * 60 - 30),
      rotation: team === 'away' ? 180 : 0,
    };
    updatePlayersWithStep((prev) => [...prev, placed]);
    setSelectedPlayer(placed);
  };

  // Apply Formation to Home (or Opponents)
  const handleApplyFormation = (formationKey: string) => {
    recordHistory();
    const newPlaced = createPlacedPlayersFromSquad(squad, formationKey);
    updatePlayersWithStep(newPlaced);
    setTacticTitle(`Schema Tattico ${formationKey}`);
  };

  // Apply Preset from Library
  const handleApplyPreset = (preset: PresetTactic) => {
    recordHistory();
    setTacticTitle(preset.name);
    const cleanP = (preset.players || []).map(sanitizeCoords);
    const cleanE = (preset.equipment || []).map(sanitizeCoords);
    const cleanD = (preset.drawings || []).map(sanitizeDrawing);

    setPlayers(cleanP);
    setEquipment(cleanE);
    setDrawings(cleanD);

    setAnimationSteps([
      {
        id: `step-1-${Date.now()}`,
        name: 'Fase 1 (Inizio)',
        players: cleanP,
        equipment: cleanE,
        drawings: cleanD,
        durationMs: 1500,
      },
      {
        id: `step-2-${Date.now()}`,
        name: 'Fase 2 (Sviluppo)',
        players: cleanP.map((p) => ({
          ...p,
          x: Math.min(1000, p.x + (p.team === 'home' ? 80 : -40)),
        })),
        equipment: cleanE,
        drawings: cleanD,
        durationMs: 1500,
      },
    ]);
    setActiveStepIndex(0);

    if (preset.drillSheet) {
      setDrillSheet((prev) => ({ ...prev, ...preset.drillSheet }));
    }
  };

  // Import JSON Data
  const handleImportData = (data: any) => {
    recordHistory();
    if (data.tacticTitle) setTacticTitle(data.tacticTitle);
    if (data.drillSheet) setDrillSheet(data.drillSheet);
    if (data.players) updatePlayersWithStep((data.players || []).map(sanitizeCoords));
    if (data.equipment) updateEquipmentWithStep((data.equipment || []).map(sanitizeCoords));
    if (data.drawings) updateDrawingsWithStep((data.drawings || []).map(sanitizeDrawing));
    if (data.animationSteps && Array.isArray(data.animationSteps)) {
      setAnimationSteps(data.animationSteps);
      setActiveStepIndex(0);
    }
  };

  // Animation Step Snapshot Manual Trigger
  const handleUpdateActiveStepSnapshot = () => {
    setAnimationSteps((prev) =>
      prev.map((step, idx) =>
        idx === activeStepIndex
          ? { ...step, players, equipment, drawings }
          : step
      )
    );
  };

  // Add new animation step (clones current board state smoothly)
  const handleAddAnimationStep = () => {
    // 1. Save current active step state
    const updatedSteps = animationSteps.map((step, idx) =>
      idx === activeStepIndex
        ? { ...step, players, equipment, drawings }
        : step
    );

    const newStepIndex = updatedSteps.length + 1;
    // 2. Clone current board state into the new phase
    const newStep: AnimationStep = {
      id: `step-${Date.now()}`,
      name: `Fase ${newStepIndex}`,
      players: JSON.parse(JSON.stringify(players)),
      equipment: JSON.parse(JSON.stringify(equipment)),
      drawings: JSON.parse(JSON.stringify(drawings)),
      durationMs: 1500,
    };

    const nextSteps = [...updatedSteps, newStep];
    setAnimationSteps(nextSteps);
    setActiveStepIndex(nextSteps.length - 1);
  };

  // Delete animation step
  const handleDeleteAnimationStep = (index: number) => {
    if (animationSteps.length <= 1) return;
    const filtered = animationSteps.filter((_, idx) => idx !== index);
    setAnimationSteps(filtered);
    const nextIdx = Math.max(0, Math.min(activeStepIndex >= index ? activeStepIndex - 1 : activeStepIndex, filtered.length - 1));
    setActiveStepIndex(nextIdx);
    if (filtered[nextIdx]) {
      const step = filtered[nextIdx];
      setPlayers((step.players || []).map(sanitizeCoords));
      setEquipment((step.equipment || []).map(sanitizeCoords));
      setDrawings((step.drawings || []).map(sanitizeDrawing));
    }
  };

  // Select / Switch Animation Step (with complete state preservation)
  const handleSelectAnimationStep = (index: number) => {
    if (index === activeStepIndex || index < 0 || index >= animationSteps.length) return;

    // 1. Save current active step before leaving
    const updatedSteps = animationSteps.map((step, idx) =>
      idx === activeStepIndex
        ? { ...step, players, equipment, drawings }
        : step
    );
    setAnimationSteps(updatedSteps);

    // 2. Switch to target step and load its snapshot
    setActiveStepIndex(index);
    const targetStep = updatedSteps[index];
    if (targetStep) {
      const cleanPlayers = (targetStep.players || []).map(sanitizeCoords);
      const cleanEquipment = (targetStep.equipment || []).map(sanitizeCoords);
      const cleanDrawings = (targetStep.drawings || []).map(sanitizeDrawing);

      setPlayers(cleanPlayers);
      setEquipment(cleanEquipment);
      setDrawings(cleanDrawings);
      setSelectedPlayer(null);
      setSelectedEquipment(null);
      setSelectedDrawing(null);
    }
  };

  // Animation Playback Engine
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingAnimation && animationSteps.length > 1) {
      interval = setInterval(() => {
        setActiveStepIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % animationSteps.length;
          const nextStep = animationSteps[nextIndex];
          if (nextStep) {
            setPlayers(nextStep.players);
            setEquipment(nextStep.equipment);
            setDrawings(nextStep.drawings);
          }
          return nextIndex;
        });
      }, (1600 / animationSpeed));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingAnimation, animationSteps, animationSpeed]);

  // Keyboard shortcut: Delete / Backspace removes currently selected item
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }

        if (selectedPlayer || selectedEquipment || selectedDrawing) {
          e.preventDefault();
          handleDeleteSelectedObject();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlayer, selectedEquipment, selectedDrawing, players, equipment, drawings]);

  // Compute label for currently selected element
  const selectedItemLabel = selectedPlayer
    ? `Giocatore ${selectedPlayer.name} #${selectedPlayer.number}`
    : selectedEquipment
    ? getEquipmentInfo(selectedEquipment.type).name
    : selectedDrawing
    ? getDrawingInfo(selectedDrawing.type).name
    : null;

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-x-hidden">
      {/* 1. Header with brand, tactic title & main action buttons */}
      <Header
        tacticTitle={tacticTitle}
        onUpdateTitle={setTacticTitle}
        squadCount={squad.length}
        onOpenSquadModal={() => setIsSquadModalOpen(true)}
        onOpenDrillModal={() => setIsDrillModalOpen(true)}
        onOpenPresetsModal={() => setIsPresetsModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        showAnimationBar={showAnimationBar}
        onToggleAnimationBar={() => setShowAnimationBar(!showAnimationBar)}
        showSquadSidebar={showSquadSidebar}
        onToggleSquadSidebar={() => setShowSquadSidebar(!showSquadSidebar)}
        showSessionSidebar={showSessionSidebar}
        onToggleSessionSidebar={() => setShowSessionSidebar(!showSessionSidebar)}
        currentTacticId={currentTacticId}
        cloudSyncStatus={cloudSyncStatus}
        cloudErrorMessage={cloudErrorMessage}
        onSaveToCloud={() => handleSaveToCloud()}
        onCopyShareLink={handleCopyShareLink}
        isCopiedLink={isCopiedLink}
      />

      {/* Slide-out Left Sidebar Drawer: Rosa Squadra */}
      {showSquadSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowSquadSidebar(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-xs select-none shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-mono uppercase text-[11px] tracking-wider">Rosa Titolari</span>
                <span className="text-[10px] text-slate-400 font-mono">({squad.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSquadModalOpen(true)}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
                >
                  Gestisci
                </button>
                <button
                  onClick={() => setShowSquadSidebar(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Chiudi pannello"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* High Density Player List */}
            <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
              {squad.map((player) => {
                const isPlaced = players.some((p) => p.squadPlayerId === player.id);
                return (
                  <div
                    key={player.id}
                    onClick={() => {
                      handleSpawnPlayerFromSquad(player, 'home');
                    }}
                    className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer group ${
                      isPlaced
                        ? 'bg-blue-950/30 border-blue-900/60 text-slate-200'
                        : 'bg-slate-950/50 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                    title="Clicca per schierare sul campo"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-[10px] text-blue-400">
                            {player.number}
                          </span>
                        )}
                      </div>

                      <div className="truncate">
                        <div className="font-semibold text-xs text-white truncate leading-tight group-hover:text-emerald-400 transition-colors">
                          {player.name}
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">
                          N° {player.number}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                        {player.role}
                      </span>
                      <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 font-bold">
                        +
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Station Status */}
            <div className="p-2 border-t border-slate-800 bg-slate-950/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Schierati: {players.filter((p) => p.team === 'home').length} Blu</span>
              <span>{players.filter((p) => p.team === 'away').length} Rossi</span>
            </div>
          </aside>
        </>
      )}

      {/* Slide-out Right Sidebar Drawer: Seduta Allenamento */}
      {showSessionSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowSessionSidebar(false)}
          />
          <aside className="fixed inset-y-0 right-0 z-50 w-80 max-w-[88vw] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 text-xs select-none shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono uppercase text-[11px] tracking-wider">Seduta Allenamento</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDrillModalOpen(true)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
                >
                  Modifica
                </button>
                <button
                  onClick={() => setShowSessionSidebar(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Chiudi pannello"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-bold">
                  {drillSheet.category}
                </span>
                <h4 className="font-bold text-sm text-white mt-1.5 leading-snug">
                  {drillSheet.title}
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400">
                  <div>⏱ {drillSheet.durationMinutes} min</div>
                  <div>👥 {drillSheet.playersCount}</div>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
                <div className="text-[10px] font-bold text-emerald-400 uppercase font-mono mb-0.5">
                  Obiettivo Primario
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {drillSheet.objectivesPrimary || 'Nessun obiettivo primario impostato.'}
                </p>
              </div>

              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
                <div className="text-[10px] font-bold text-amber-400 uppercase font-mono mb-0.5">
                  Punti Chiave per il Mister
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {drillSheet.coachingPoints || 'Postura del corpo aperta e continua comunicazione verbale.'}
                </p>
              </div>

              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
                <div className="text-[10px] font-bold text-blue-400 uppercase font-mono mb-0.5">
                  Regole & Vincoli
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {drillSheet.rulesAndVariations || 'Massimo 2 tocchi.'}
                </p>
              </div>
            </div>

            <div className="p-2 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold text-center border border-slate-700"
              >
                Stampa Scheda PDF
              </button>
            </div>
          </aside>
        </>
      )}

      {/* 2. IL CAMPO DA GIOCO (PITCH WORKSPACE) - POSIZIONATO IN ALTO / SOPRA A TUTTO */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-4 pt-2 sm:pt-3 pb-1 shrink-0 flex flex-col">
        {/* Pitch Bar with Technical Counters & Selected Object Actions */}
        <div className="flex flex-wrap items-center justify-between px-2 sm:px-3 py-1.5 bg-slate-900/90 rounded-t-xl border border-slate-800 text-[10px] sm:text-xs font-mono text-slate-400 select-none gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-bold text-white">
              <Layers size={13} className="text-emerald-400" />
              <span>Lavagna Tattica 2D</span>
            </div>

            {/* Active Selected Player Actions */}
            {selectedPlayer && (
              <div className="flex items-center gap-1.5 bg-blue-950/95 border border-blue-500/70 px-2 py-1 rounded-md text-[11px] text-blue-100 shadow-md animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold text-white truncate max-w-[90px] sm:max-w-[130px]">{selectedPlayer.name}</span>
                <span className="font-mono text-cyan-300 text-[10px]">#{selectedPlayer.number} ({selectedPlayer.role})</span>
                <button
                  type="button"
                  onClick={() => setEditingPlayer(selectedPlayer)}
                  className="px-1.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                  title="Apri scheda per modificare nome, numero, maglia e ruolo"
                >
                  <Settings size={10} />
                  <span>Scheda</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePlayer(selectedPlayer.id)}
                  className="px-1.5 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                  title="Elimina questo singolo giocatore (oppure premi Canc)"
                >
                  <Trash2 size={10} />
                  <span>Elimina</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className="p-0.5 text-slate-400 hover:text-white rounded"
                  title="Deseleziona"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Active Selected Equipment Actions */}
            {selectedEquipment && (
              <div className="flex items-center gap-1.5 bg-amber-950/95 border border-amber-500/70 px-2 py-1 rounded-md text-[11px] text-amber-100 shadow-md animate-in fade-in">
                <span className="text-sm">{getEquipmentInfo(selectedEquipment.type).icon}</span>
                <span className="font-semibold text-white">{getEquipmentInfo(selectedEquipment.type).name}</span>
                <button
                  type="button"
                  onClick={() => handleRotateEquipment(selectedEquipment.id, 45)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="Ruota attrezzo (+45°)"
                >
                  <RotateCw size={10} />
                  <span>Ruota</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicateEquipment(selectedEquipment)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="Duplica attrezzo"
                >
                  <Copy size={10} />
                  <span>Duplica</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteEquipment(selectedEquipment.id)}
                  className="px-1.5 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                  title="Elimina questo singolo attrezzo (oppure premi Canc)"
                >
                  <Trash2 size={10} />
                  <span>Elimina</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEquipment(null)}
                  className="p-0.5 text-slate-400 hover:text-white rounded"
                  title="Deseleziona"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Active Selected Drawing Actions */}
            {selectedDrawing && (
              <div className="flex items-center gap-1.5 bg-purple-950/95 border border-purple-500/70 px-2 py-1 rounded-md text-[11px] text-purple-100 shadow-md animate-in fade-in">
                <span className="text-sm">{getDrawingInfo(selectedDrawing.type).icon}</span>
                <span className="font-semibold text-white">{getDrawingInfo(selectedDrawing.type).name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteDrawing(selectedDrawing.id)}
                  className="px-1.5 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                  title="Elimina questo singolo elemento grafico (oppure premi Canc)"
                >
                  <Trash2 size={10} />
                  <span>Elimina</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDrawing(null)}
                  className="p-0.5 text-slate-400 hover:text-white rounded"
                  title="Deseleziona"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
              GIOCATORI: <b className="text-white">{players.length}</b>
            </span>
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
              ATTREZZI: <b className="text-white">{equipment.length}</b>
            </span>
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80 hidden xs:inline">
              TRACCIATI: <b className="text-white">{drawings.length}</b>
            </span>
          </div>
        </div>

        {/* Pitch Area Container - Edge-to-edge responsiveness on mobile/iPad/PC */}
        <div className="relative w-full rounded-b-xl border-x border-b border-slate-800 overflow-hidden shadow-2xl bg-slate-950 flex items-center justify-center">
          <div className="w-full aspect-[1050/680] max-h-[75vh] landscape:max-h-[66vh] flex items-center justify-center">
            <TacticalPitch
              pitchRef={pitchSvgRef}
              players={players}
              equipment={equipment}
              drawings={drawings}
              selectedTool={selectedTool}
              selectedColor={selectedColor}
              strokeWidth={strokeWidth}
              pitchSection={pitchSection}
              pitchTheme={pitchTheme}
              showHalfSpaces={showHalfSpaces}
              showDepartmentLines={showDepartmentLines}
              showPhotos={showPhotos}
              showNames={showNames}
              showNumbers={showNumbers}
              showRoles={showRoles}
              showOrientation={showOrientation}
              jerseyStyle={jerseyStyle}
              onUpdatePlayers={(updated) => {
                recordHistory();
                updatePlayersWithStep(updated);
              }}
              onUpdateEquipment={(updated) => {
                recordHistory();
                updateEquipmentWithStep(updated);
              }}
              onUpdateDrawings={(updated) => {
                recordHistory();
                updateDrawingsWithStep(updated);
              }}
              onSelectPlayer={(p) => setSelectedPlayer(p)}
              onOpenPlayerEdit={(p) => {
                setSelectedPlayer(p);
                setEditingPlayer(p);
              }}
              onSelectEquipment={(eq) => setSelectedEquipment(eq)}
              onSelectDrawing={(d) => setSelectedDrawing(d)}
              onDeletePlayer={handleDeletePlayer}
              onDeleteEquipment={handleDeleteEquipment}
              onDeleteDrawing={handleDeleteDrawing}
              onPlayerDoubleClick={(p) => {
                setSelectedPlayer(p);
                setEditingPlayer(p);
              }}
              onRotatePlayerQuick={(id, delta) => {
                recordHistory();
                updatePlayersWithStep((prev) =>
                  prev.map((p) => {
                    if (p.id !== id) return p;
                    const newRot = (((p.rotation || 0) + delta) % 360 + 360) % 360;
                    return { ...p, rotation: Math.round(newRot) };
                  })
                );
                if (selectedPlayer && selectedPlayer.id === id) {
                  const newRot = (((selectedPlayer.rotation || 0) + delta) % 360 + 360) % 360;
                  setSelectedPlayer({ ...selectedPlayer, rotation: Math.round(newRot) });
                }
                if (editingPlayer && editingPlayer.id === id) {
                  const newRot = (((editingPlayer.rotation || 0) + delta) % 360 + 360) % 360;
                  setEditingPlayer({ ...editingPlayer, rotation: Math.round(newRot) });
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* 3. TUTTO IL RESTO SOTTO (All Controls, Toolbars, Equipment, Formations & Settings Below the Pitch) */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-3 space-y-2.5 flex-1 shrink-0">
        {/* Optional Animation Bar */}
        {showAnimationBar && (
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
            <AnimationControls
              steps={animationSteps}
              activeStepIndex={activeStepIndex}
              onSelectStepIndex={handleSelectAnimationStep}
              onAddStep={handleAddAnimationStep}
              onDeleteStep={handleDeleteAnimationStep}
              onUpdateActiveStepSnapshot={handleUpdateActiveStepSnapshot}
              isPlaying={isPlayingAnimation}
              onTogglePlay={() => setIsPlayingAnimation(!isPlayingAnimation)}
              speed={animationSpeed}
              onSetSpeed={setAnimationSpeed}
            />
          </div>
        )}

        {/* Toolbar Row 1: Tactical Drawing Tools, Colors, Half-Spaces, Undo */}
        <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900">
          <ToolbarTactics
            selectedTool={selectedTool}
            onSelectTool={setSelectedTool}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            strokeWidth={strokeWidth}
            onSelectStrokeWidth={setStrokeWidth}
            showHalfSpaces={showHalfSpaces}
            onToggleHalfSpaces={() => setShowHalfSpaces(!showHalfSpaces)}
            canUndo={history.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClearAll={handleClearAll}
            hasSelectedItem={!!(selectedPlayer || selectedEquipment || selectedDrawing)}
            selectedItemLabel={selectedItemLabel}
            onDeleteSelected={handleDeleteSelectedObject}
          />
        </div>

        {/* Toolbar Row 2: Equipment & Quick Player Spawning */}
        <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900">
          <ToolbarEquipment
            onAddEquipment={handleAddEquipment}
            onAddPlayer={handleAddPlayer}
          />
        </div>

        {/* Toolbar Row 3: Pitch Section, Formations, Visual Toggles */}
        <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900">
          <ToolbarPitchSettings
            pitchSection={pitchSection}
            onSelectPitchSection={setPitchSection}
            pitchTheme={pitchTheme}
            onSelectPitchTheme={setPitchTheme}
            onApplyFormation={handleApplyFormation}
            showDepartmentLines={showDepartmentLines}
            onToggleDepartmentLines={() => setShowDepartmentLines(!showDepartmentLines)}
            showPhotos={showPhotos}
            onTogglePhotos={() => setShowPhotos(!showPhotos)}
            showNames={showNames}
            onToggleNames={() => setShowNames(!showNames)}
            showNumbers={showNumbers}
            onToggleNumbers={() => setShowNumbers(!showNumbers)}
            showRoles={showRoles}
            onToggleRoles={() => setShowRoles(!showRoles)}
            showOrientation={showOrientation}
            onToggleOrientation={() => setShowOrientation(!showOrientation)}
            jerseyStyle={jerseyStyle}
            onCycleJerseyStyle={() =>
              setJerseyStyle((prev) => {
                if (prev === 'broadcast') return 'realistic';
                if (prev === 'realistic') return 'shirt';
                if (prev === 'shirt') return 'vest';
                if (prev === 'vest') return 'circle';
                return 'broadcast';
              })
            }
          />
        </div>
      </section>

      {/* 7. Modals */}
      {/* Squad Management Modal (Add, Edit, Delete, Photos, Custom Avatars) */}
      <SquadModal
        isOpen={isSquadModalOpen}
        onClose={() => setIsSquadModalOpen(false)}
        squad={squad}
        onUpdateSquad={(newSquad) => {
          setSquad(newSquad);
          // If any squad players were removed, also remove them from the tactical pitch & animation steps
          const remainingIds = new Set(newSquad.map((p) => p.id));
          updatePlayersWithStep((prev) =>
            prev.filter((p) => !p.squadPlayerId || remainingIds.has(p.squadPlayerId))
          );
        }}
        onSpawnPlayerToPitch={handleSpawnPlayerFromSquad}
      />

      {/* Coach Training Exercise Sheet Modal */}
      <DrillSheetModal
        isOpen={isDrillModalOpen}
        onClose={() => setIsDrillModalOpen(false)}
        drillSheet={drillSheet}
        onSaveDrillSheet={setDrillSheet}
        tacticTitle={tacticTitle}
        players={players}
        equipment={equipment}
        drawings={drawings}
        pitchSvgRef={pitchSvgRef}
      />

      {/* Preset Tactics & Drills Library Modal */}
      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onApplyPreset={handleApplyPreset}
      />

      {/* Export & Save Modal (PNG, PDF, JSON) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tacticTitle={tacticTitle}
        drillSheet={drillSheet}
        players={players}
        equipment={equipment}
        drawings={drawings}
        pitchSvgRef={pitchSvgRef}
        onImportData={handleImportData}
      />

      {/* Quick Scroll Helper for Landscape Mobile on iPhone */}
      <div className="fixed bottom-3 right-3 z-40 hidden landscape:flex sm:landscape:hidden items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 backdrop-blur text-slate-200 text-xs px-2.5 py-1.5 rounded-full shadow-lg">
        <button
          type="button"
          onClick={() => {
            window.scrollBy({ top: 260, behavior: 'smooth' });
          }}
          className="flex items-center gap-1 hover:text-white cursor-pointer"
        >
          <span>Strumenti</span>
          <span className="text-blue-400 font-bold">↓</span>
        </button>
        <span className="text-slate-600">|</span>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1 hover:text-white cursor-pointer"
        >
          <span>Campo</span>
          <span className="text-emerald-400 font-bold">↑</span>
        </button>
      </div>

      {/* Floating Comprehensive Player & Jersey Customization Popover */}
      {editingPlayer && (
        <PlayerEditPopover
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onUpdatePlayer={(updated) => {
            recordHistory();
            updatePlayersWithStep((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingPlayer(updated);
            if (selectedPlayer && selectedPlayer.id === updated.id) {
              setSelectedPlayer(updated);
            }
          }}
          onRemovePlayer={(id) => {
            recordHistory();
            updatePlayersWithStep((prev) => prev.filter((p) => p.id !== id));
            setEditingPlayer(null);
            if (selectedPlayer && selectedPlayer.id === id) {
              setSelectedPlayer(null);
            }
          }}
          onApplyJerseyToTeam={(team, jerseyUrl) => {
            recordHistory();
            updatePlayersWithStep((prev) =>
              prev.map((p) => (p.team === team ? { ...p, jerseyImageUrl: jerseyUrl } : p))
            );
            if (editingPlayer && editingPlayer.team === team) {
              setEditingPlayer({ ...editingPlayer, jerseyImageUrl: jerseyUrl });
            }
            if (selectedPlayer && selectedPlayer.team === team) {
              setSelectedPlayer({ ...selectedPlayer, jerseyImageUrl: jerseyUrl });
            }
          }}
          onApplyColorToTeam={(team, color, secondaryColor) => {
            recordHistory();
            updatePlayersWithStep((prev) =>
              prev.map((p) =>
                p.team === team
                  ? {
                      ...p,
                      customColor: color,
                      ...(secondaryColor ? { secondaryColor } : {}),
                    }
                  : p
              )
            );
            if (editingPlayer && editingPlayer.team === team) {
              setEditingPlayer({
                ...editingPlayer,
                customColor: color,
                ...(secondaryColor ? { secondaryColor } : {}),
              });
            }
            if (selectedPlayer && selectedPlayer.team === team) {
              setSelectedPlayer({
                ...selectedPlayer,
                customColor: color,
                ...(secondaryColor ? { secondaryColor } : {}),
              });
            }
          }}
        />
      )}
    </div>
  );
}
