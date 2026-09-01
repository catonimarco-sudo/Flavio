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
import { X } from 'lucide-react';

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
        return Array.isArray(parsed) ? parsed.map(sanitizeCoords) : [];
      }
    } catch {}
    return (PRESET_TACTICS[0].players || []).map(sanitizeCoords);
  });

  const [equipment, setEquipment] = useState<PlacedEquipment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_equipment`);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(sanitizeCoords) : [];
      }
    } catch {}
    return (PRESET_TACTICS[0].equipment || []).map(sanitizeCoords);
  });

  const [drawings, setDrawings] = useState<TacticalDrawing[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_drawings`);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(sanitizeDrawing) : [];
      }
    } catch {}
    return (PRESET_TACTICS[0].drawings || []).map(sanitizeDrawing);
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
  const [jerseyStyle, setJerseyStyle] = useState<'shirt' | 'circle' | 'vest'>('shirt');

  // Layout toggles (Default closed for maximized pitch view)
  const [showSquadSidebar, setShowSquadSidebar] = useState<boolean>(false);
  const [showSessionSidebar, setShowSessionSidebar] = useState<boolean>(false);

  // Selected Pitch Node for edit popover
  const [selectedPlayer, setSelectedPlayer] = useState<PlacedPlayer | null>(null);
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
            players: (step.players || []).map(sanitizeCoords),
            equipment: (step.equipment || []).map(sanitizeCoords),
            drawings: (step.drawings || []).map(sanitizeDrawing),
          }));
        }
      }
    } catch {}

    return [
      {
        id: 'step-1',
        name: 'Fase 1 (Inizio)',
        players: (PRESET_TACTICS[0].players || []).map(sanitizeCoords),
        equipment: (PRESET_TACTICS[0].equipment || []).map(sanitizeCoords),
        drawings: (PRESET_TACTICS[0].drawings || []).map(sanitizeDrawing),
        durationMs: 1500,
      },
      {
        id: 'step-2',
        name: 'Fase 2 (Sviluppo)',
        players: (PRESET_TACTICS[0].players || []).map((p) => {
          const clean = sanitizeCoords(p);
          return {
            ...clean,
            x: Math.min(1000, clean.x + (clean.team === 'home' ? 80 : -40)),
          };
        }),
        equipment: (PRESET_TACTICS[0].equipment || []).map(sanitizeCoords),
        drawings: (PRESET_TACTICS[0].drawings || []).map(sanitizeDrawing),
        durationMs: 1500,
      },
    ];
  });

  const pitchSvgRef = useRef<SVGSVGElement | null>(null);

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
      setAnimationSteps((steps) =>
        steps.map((step, idx) =>
          idx === activeStepIndex ? { ...step, players: resolved } : step
        )
      );
      return resolved;
    });
  }, [activeStepIndex]);

  const updateEquipmentWithStep = useCallback((
    newEq: PlacedEquipment[] | ((prev: PlacedEquipment[]) => PlacedEquipment[])) => {
    setEquipment((prev) => {
      const resolved = typeof newEq === 'function' ? newEq(prev) : newEq;
      setAnimationSteps((steps) =>
        steps.map((step, idx) =>
          idx === activeStepIndex ? { ...step, equipment: resolved } : step
        )
      );
      return resolved;
    });
  }, [activeStepIndex]);

  const updateDrawingsWithStep = useCallback((
    newDr: TacticalDrawing[] | ((prev: TacticalDrawing[]) => TacticalDrawing[])) => {
    setDrawings((prev) => {
      const resolved = typeof newDr === 'function' ? newDr(prev) : newDr;
      setAnimationSteps((steps) =>
        steps.map((step, idx) =>
          idx === activeStepIndex ? { ...step, drawings: resolved } : step
        )
      );
      return resolved;
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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 font-sans">
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
      />

      {/* 2. Optional Animation Bar */}
      {showAnimationBar && (
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
      )}

      {/* 3. Toolbar Row 1: Tactical Tools, Colors, Half-Spaces, Undo */}
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
      />

      {/* 4. Toolbar Row 2: Equipment & Quick Player Spawning */}
      <ToolbarEquipment
        onAddEquipment={handleAddEquipment}
        onAddPlayer={handleAddPlayer}
      />

      {/* 5. Toolbar Row 3: Pitch Section, Formations, Player Visual Toggles */}
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
          setJerseyStyle((prev) => (prev === 'shirt' ? 'circle' : 'shirt'))
        }
      />

      {/* 6. Main Interactive Workspace (Sidebars + Pitch) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Backdrop on Mobile */}
        {showSquadSidebar && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
            onClick={() => setShowSquadSidebar(false)}
          />
        )}

        {/* Left Docked Sidebar / Mobile Drawer: Rosa Squadra */}
        {showSquadSidebar && (
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] md:relative md:inset-auto md:w-60 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-xs select-none shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
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
                      // On small screens, keep drawer open or let user place multiple
                    }}
                    className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer group ${
                      isPlaced
                        ? 'bg-blue-950/30 border-blue-900/60 text-slate-200'
                        : 'bg-slate-950/50 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                    title="Clicca per schierare sul campo"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Mini Avatar / Number */}
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
        )}

        {/* Central Tactical Pitch Canvas - Edge-to-Edge Length with Overflow Scrolling */}
        <main className="flex-1 relative overflow-hidden flex flex-col p-0 bg-slate-950 min-w-0">
          {/* Top Canvas Technical Badge */}
          <div className="flex flex-wrap items-center justify-between px-2 sm:px-3 py-1 bg-slate-950/80 border-b border-slate-800/80 text-[9px] sm:text-[10px] font-mono text-slate-400 select-none gap-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-emerald-400 font-bold">// WORKSTATION ACTIVE</span>
              <span className="text-slate-600 hidden xs:inline">•</span>
              <span className="hidden xs:inline">CAMPO: {pitchSection.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span>GIOCATORI: {players.length}</span>
              <span className="text-slate-600">•</span>
              <span>ATTREZZI: {equipment.length}</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="hidden sm:inline">TRACCIATI: {drawings.length}</span>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-x-auto overflow-y-hidden w-full h-full min-w-0 overscroll-contain">
            <div className="w-full h-full min-w-[480px] sm:min-w-[620px] md:min-w-0 flex items-center justify-center relative touch-none select-none">
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
                onSelectEquipment={(eq) => setSelectedEquipment(eq)}
                onSelectDrawing={(d) => setSelectedDrawing(d)}
                onPlayerDoubleClick={(p) => setSelectedPlayer(p)}
              />

              {/* Quick Player Edit Popover on selection */}
              {selectedPlayer && (
                <PlayerEditPopover
                  player={selectedPlayer}
                  onClose={() => setSelectedPlayer(null)}
                  onUpdatePlayer={(updated) => {
                    recordHistory();
                    updatePlayersWithStep((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                    setSelectedPlayer(updated);
                  }}
                  onRemovePlayer={(id) => {
                    recordHistory();
                    updatePlayersWithStep((prev) => prev.filter((p) => p.id !== id));
                    setSelectedPlayer(null);
                  }}
                />
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar Backdrop on Mobile */}
        {showSessionSidebar && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
            onClick={() => setShowSessionSidebar(false)}
          />
        )}

        {/* Right Docked Sidebar / Mobile Drawer: Sessione Allenamento & Obiettivi */}
        {showSessionSidebar && (
          <aside className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] md:relative md:inset-auto md:w-64 lg:w-72 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 text-xs select-none shadow-2xl md:shadow-none animate-in slide-in-from-right duration-200">
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
              {/* Drill Meta Header */}
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

              {/* Primary Objective */}
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
                <div className="text-[10px] font-bold text-emerald-400 uppercase font-mono mb-0.5">
                  Obiettivo Primario
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {drillSheet.objectivesPrimary || 'Nessun obiettivo primario impostato.'}
                </p>
              </div>

              {/* Coaching Points */}
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
                <div className="text-[10px] font-bold text-amber-400 uppercase font-mono mb-0.5">
                  Punti Chiave per il Mister
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {drillSheet.coachingPoints || 'Postura del corpo aperta e continua comunicazione verbale.'}
                </p>
              </div>

              {/* Rules & Variations */}
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
                <div className="text-[10px] font-bold text-blue-400 uppercase font-mono mb-0.5">
                  Regole & Vincoli
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {drillSheet.rulesAndVariations || 'Massimo 2 tocchi.'}
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="p-2 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold text-center border border-slate-700"
              >
                Stampa Scheda PDF
              </button>
            </div>
          </aside>
        )}
      </div>

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
    </div>
  );
}
