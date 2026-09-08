import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  PlacedPlayer,
  PlacedEquipment,
  TacticalDrawing,
  ToolType,
  PitchSection,
  PitchTheme,
  DrawingPoint,
  JerseyStyle,
} from '../types';
import { PlayerPitchNode } from './PlayerPitchNode';
import { EquipmentRenderer } from './EquipmentIcons';

interface TacticalPitchProps {
  players: PlacedPlayer[];
  equipment: PlacedEquipment[];
  drawings: TacticalDrawing[];
  selectedTool: ToolType;
  selectedColor: string;
  strokeWidth: number;
  pitchSection: PitchSection;
  pitchTheme: PitchTheme;
  showHalfSpaces: boolean;
  showDepartmentLines: boolean;
  showPhotos: boolean;
  showNames: boolean;
  showNumbers: boolean;
  showRoles: boolean;
  showOrientation: boolean;
  jerseyStyle: JerseyStyle;
  onUpdatePlayers: (players: PlacedPlayer[]) => void;
  onUpdateEquipment: (equipment: PlacedEquipment[]) => void;
  onUpdateDrawings: (drawings: TacticalDrawing[]) => void;
  onSelectPlayer: (player: PlacedPlayer | null) => void;
  onSelectEquipment: (eq: PlacedEquipment | null) => void;
  onSelectDrawing: (drawing: TacticalDrawing | null) => void;
  onPlayerDoubleClick?: (player: PlacedPlayer) => void;
  onRotatePlayerQuick?: (playerId: string, deltaDeg: number) => void;
  pitchRef?: React.RefObject<SVGSVGElement | null>;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  players,
  equipment,
  drawings,
  selectedTool,
  selectedColor,
  strokeWidth,
  pitchSection,
  pitchTheme,
  showHalfSpaces,
  showDepartmentLines,
  showPhotos,
  showNames,
  showNumbers,
  showRoles,
  showOrientation,
  jerseyStyle,
  onUpdatePlayers,
  onUpdateEquipment,
  onUpdateDrawings,
  onSelectPlayer,
  onSelectEquipment,
  onSelectDrawing,
  onPlayerDoubleClick,
  onRotatePlayerQuick,
  pitchRef: externalPitchRef,
}) => {
  const internalPitchRef = useRef<SVGSVGElement | null>(null);
  const svgRef = externalPitchRef || internalPitchRef;

  // Active interaction states
  const [draggedItem, setDraggedItem] = useState<{
    type: 'player' | 'equipment' | 'drawing_point' | 'curve_control';
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [rotatingPlayerId, setRotatingPlayerId] = useState<string | null>(null);
  const [currentDrawing, setCurrentDrawing] = useState<TacticalDrawing | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Canvas coordinate width & height (standard 1050 x 680)
  const PITCH_W = 1050;
  const PITCH_H = 680;

  // Helper to convert client/touch event to SVG coordinate space
  const getSvgCoordinates = useCallback(
    (e: React.MouseEvent | React.TouchEvent | React.PointerEvent | MouseEvent | TouchEvent | PointerEvent): { x: number; y: number } => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const svg = svgRef.current;

      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && (e as TouchEvent).touches && (e as TouchEvent).touches.length > 0) {
        clientX = (e as TouchEvent).touches[0].clientX;
        clientY = (e as TouchEvent).touches[0].clientY;
      } else if ('changedTouches' in e && (e as TouchEvent).changedTouches && (e as TouchEvent).changedTouches.length > 0) {
        clientX = (e as TouchEvent).changedTouches[0].clientX;
        clientY = (e as TouchEvent).changedTouches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      // 1. Gold standard: SVG ScreenCTM inverse matrix
      try {
        if (svg.getScreenCTM) {
          const ctm = svg.getScreenCTM();
          if (ctm) {
            const pt = svg.createSVGPoint();
            pt.x = clientX;
            pt.y = clientY;
            const svgP = pt.matrixTransform(ctm.inverse());
            return {
              x: Math.max(0, Math.min(PITCH_W, Math.round(svgP.x))),
              y: Math.max(0, Math.min(PITCH_H, Math.round(svgP.y))),
            };
          }
        }
      } catch (_) {}

      // 2. Fallback using getBoundingClientRect
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const x = ((clientX - rect.left) / rect.width) * PITCH_W;
        const y = ((clientY - rect.top) / rect.height) * PITCH_H;
        return {
          x: Math.max(0, Math.min(PITCH_W, Math.round(x))),
          y: Math.max(0, Math.min(PITCH_H, Math.round(y))),
        };
      }

      return { x: 0, y: 0 };
    },
    [svgRef]
  );

  // Trigger light haptic pulse on mobile devices
  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
  }, []);

  // Prevent unwanted page bouncing and scrolling when dragging on touch devices
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleNativeTouchMove = (e: TouchEvent) => {
      // If actively dragging item or drawing, cancel browser default scrolling gesture
      if (draggedItem || rotatingPlayerId || currentDrawing) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    svgEl.addEventListener('touchmove', handleNativeTouchMove, { passive: false });

    return () => {
      svgEl.removeEventListener('touchmove', handleNativeTouchMove);
    };
  }, [draggedItem, rotatingPlayerId, currentDrawing, svgRef]);

  // Global pointer/touch release listener fallback
  useEffect(() => {
    const handleGlobalRelease = () => {
      if (draggedItem) {
        setDraggedItem(null);
      }
      if (rotatingPlayerId) {
        setRotatingPlayerId(null);
      }
    };

    window.addEventListener('pointerup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    window.addEventListener('touchcancel', handleGlobalRelease);

    return () => {
      window.removeEventListener('pointerup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
      window.removeEventListener('touchcancel', handleGlobalRelease);
    };
  }, [draggedItem, rotatingPlayerId]);

  // ViewBox dynamic cropping based on pitchSection
  const getViewBox = (): string => {
    switch (pitchSection) {
      case 'attack_half':
        return `450 0 600 680`; // attacking half (right side)
      case 'defense_half':
        return `0 0 600 680`; // defensive half (left side)
      case 'trequarti':
        return `550 100 500 480`; // zone 3
      case 'right_flank':
        return `300 340 750 340`; // right flank
      case 'left_flank':
        return `300 0 750 340`; // left flank
      case 'penalty_box':
        return `750 140 300 400`; // penalty box right
      case 'full_vertical':
        return `0 0 1050 680`;
      case 'full_horizontal':
      default:
        return `0 0 1050 680`;
    }
  };

  // Keyboard shortcut listener for deleting selected items
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // If focus is in an input or textarea, ignore
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        ) {
          return;
        }

        if (selectedId) {
          // Check player
          if (players.some((p) => p.id === selectedId)) {
            onUpdatePlayers(players.filter((p) => p.id !== selectedId));
            onSelectPlayer(null);
            setSelectedId(null);
          } else if (equipment.some((eq) => eq.id === selectedId)) {
            onUpdateEquipment(equipment.filter((eq) => eq.id !== selectedId));
            onSelectEquipment(null);
            setSelectedId(null);
          } else if (drawings.some((d) => d.id === selectedId)) {
            onUpdateDrawings(drawings.filter((d) => d.id !== selectedId));
            onSelectDrawing(null);
            setSelectedId(null);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, players, equipment, drawings, onUpdatePlayers, onUpdateEquipment, onUpdateDrawings, onSelectPlayer, onSelectEquipment, onSelectDrawing]);

  // Pointer Down on Pitch Background
  const handlePitchPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch (_) {}

    const { x, y } = getSvgCoordinates(e);

    // If eraser tool is selected, clicking on items erases them
    if (selectedTool === 'eraser') {
      return;
    }

    // Drawing tools
    if (selectedTool !== 'select') {
      const newDrawingId = `draw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      let initialDrawing: TacticalDrawing;

      if (selectedTool === 'curve_arrow') {
        initialDrawing = {
          id: newDrawingId,
          type: 'curve_arrow',
          points: [{ x, y }, { x: x + 1, y: y + 1 }],
          controlPoint: { x: x + 10, y: y - 20 },
          color: selectedColor,
          strokeWidth,
        };
      } else if (selectedTool === 'text') {
        const textInput = window.prompt('Inserisci nota o istruzione tattica:', 'Pressione');
        if (textInput && textInput.trim()) {
          const textDrawing: TacticalDrawing = {
            id: newDrawingId,
            type: 'text',
            points: [{ x, y }],
            text: textInput.trim(),
            color: selectedColor,
            strokeWidth,
          };
          const filtered = drawings.filter((d) => d.id !== textDrawing.id);
          onUpdateDrawings([...filtered, textDrawing]);
        }
        return;
      } else if (selectedTool === 'zone_rect') {
        initialDrawing = {
          id: newDrawingId,
          type: 'zone_rect',
          points: [{ x, y }, { x: x + 1, y: y + 1 }],
          color: selectedColor,
          strokeWidth,
          fill: `${selectedColor}22`,
        };
      } else if (selectedTool === 'zone_circle') {
        initialDrawing = {
          id: newDrawingId,
          type: 'zone_circle',
          points: [{ x, y }, { x: x + 1, y: y + 1 }],
          color: selectedColor,
          strokeWidth,
          fill: `${selectedColor}22`,
        };
      } else {
        // Line, run arrow, pass arrow, dribble, press, freehand
        initialDrawing = {
          id: newDrawingId,
          type: selectedTool,
          points: [{ x, y }, { x: x + 1, y: y + 1 }],
          color: selectedColor,
          strokeWidth,
          strokeDash: selectedTool === 'run_arrow' ? '6,6' : undefined,
        };
      }

      setCurrentDrawing(initialDrawing);
    } else {
      // Clicked empty pitch in select mode: deselect all
      setSelectedId(null);
      onSelectPlayer(null);
      onSelectEquipment(null);
      onSelectDrawing(null);
    }
  };

  // Pointer Move (global drag or drawing update)
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x, y } = getSvgCoordinates(e);

    // If currently rotating player
    if (rotatingPlayerId) {
      const targetPlayer = players.find((p) => p.id === rotatingPlayerId);
      if (targetPlayer) {
        const dx = x - targetPlayer.x;
        const dy = y - targetPlayer.y;
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        if (angle < 0) angle += 360;
        onUpdatePlayers(
          players.map((p) => (p.id === rotatingPlayerId ? { ...p, rotation: Math.round(angle) } : p))
        );
      }
      return;
    }

    // If dragging a player
    if (draggedItem?.type === 'player') {
      const newX = Math.round(x - draggedItem.offsetX);
      const newY = Math.round(y - draggedItem.offsetY);
      onUpdatePlayers(
        players.map((p) =>
          p.id === draggedItem.id
            ? { ...p, x: Math.max(15, Math.min(PITCH_W - 15, newX)), y: Math.max(15, Math.min(PITCH_H - 15, newY)) }
            : p
        )
      );
      return;
    }

    // If dragging equipment
    if (draggedItem?.type === 'equipment') {
      const newX = Math.round(x - draggedItem.offsetX);
      const newY = Math.round(y - draggedItem.offsetY);
      onUpdateEquipment(
        equipment.map((eq) =>
          eq.id === draggedItem.id
            ? { ...eq, x: Math.max(10, Math.min(PITCH_W - 10, newX)), y: Math.max(10, Math.min(PITCH_H - 10, newY)) }
            : eq
        )
      );
      return;
    }

    // If dragging a curve control point
    if (draggedItem?.type === 'curve_control') {
      onUpdateDrawings(
        drawings.map((d) => (d.id === draggedItem.id ? { ...d, controlPoint: { x, y } } : d))
      );
      return;
    }

    // If currently drawing with tools
    if (currentDrawing) {
      if (currentDrawing.type === 'freehand') {
        setCurrentDrawing({
          ...currentDrawing,
          points: [...currentDrawing.points, { x, y }],
        });
      } else if (currentDrawing.type === 'curve_arrow') {
        const start = currentDrawing.points[0];
        const midX = (start.x + x) / 2;
        const midY = (start.y + y) / 2 - 40;
        setCurrentDrawing({
          ...currentDrawing,
          points: [start, { x, y }],
          controlPoint: currentDrawing.controlPoint || { x: midX, y: midY },
        });
      } else {
        const start = currentDrawing.points[0];
        setCurrentDrawing({
          ...currentDrawing,
          points: [start, { x, y }],
        });
      }
    }
  };

  // Pointer Up
  const handlePointerUp = (e?: React.PointerEvent<SVGSVGElement>) => {
    if (e && e.currentTarget) {
      try {
        (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    }
    if (draggedItem) {
      setDraggedItem(null);
    }
    if (rotatingPlayerId) {
      setRotatingPlayerId(null);
    }
    if (currentDrawing) {
      const drawingToSave = currentDrawing;
      setCurrentDrawing(null);
      // Save drawing if valid (has at least 2 points)
      if (drawingToSave.points && drawingToSave.points.length >= 2) {
        const filtered = drawings.filter((d) => d.id !== drawingToSave.id);
        onUpdateDrawings([...filtered, drawingToSave]);
      }
    }
  };

  // Select/Drag Player
  const handleSelectPlayer = (player: PlacedPlayer, e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation();

    if (selectedTool === 'eraser') {
      onUpdatePlayers(players.filter((p) => p.id !== player.id));
      return;
    }

    triggerHaptic();
    setSelectedId(player.id);
    onSelectPlayer(player);
    onSelectEquipment(null);
    onSelectDrawing(null);

    // If in drawing mode, do not start dragging player coordinates
    if (selectedTool !== 'select') {
      return;
    }

    const coords = getSvgCoordinates(e);
    setDraggedItem({
      type: 'player',
      id: player.id,
      offsetX: coords.x - player.x,
      offsetY: coords.y - player.y,
    });
  };

  // Start rotating player
  const handleStartRotate = (playerId: string, e: React.PointerEvent | React.TouchEvent) => {
    e.stopPropagation();
    triggerHaptic();
    setRotatingPlayerId(playerId);
  };

  // Select/Drag Equipment
  const handleSelectEquipment = (eq: PlacedEquipment, e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    if (selectedTool === 'eraser') {
      e.stopPropagation();
      onUpdateEquipment(equipment.filter((item) => item.id !== eq.id));
      return;
    }

    // In drawing mode, allow drawing starting from or passing equipment (ball, cone, etc.)!
    if (selectedTool !== 'select') {
      return;
    }

    e.stopPropagation();
    triggerHaptic();
    setSelectedId(eq.id);
    onSelectEquipment(eq);
    onSelectPlayer(null);
    onSelectDrawing(null);

    const coords = getSvgCoordinates(e);
    setDraggedItem({
      type: 'equipment',
      id: eq.id,
      offsetX: coords.x - eq.x,
      offsetY: coords.y - eq.y,
    });
  };

  // Select/Delete Drawing
  const handleSelectDrawing = (drawing: TacticalDrawing, e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    if (selectedTool === 'eraser') {
      e.stopPropagation();
      onUpdateDrawings(drawings.filter((d) => d.id !== drawing.id));
      return;
    }

    // In drawing mode, do not block or select existing drawings
    if (selectedTool !== 'select') {
      return;
    }

    e.stopPropagation();
    triggerHaptic();
    setSelectedId(drawing.id);
    onSelectDrawing(drawing);
    onSelectPlayer(null);
    onSelectEquipment(null);
  };

  // Render Department Lines (Defenders, Midfielders, Forwards)
  const renderDepartmentLines = () => {
    if (!showDepartmentLines) return null;

    const homeDefenders = players.filter(
      (p) => p.team === 'home' && ['DC', 'TD', 'TS', 'DCD', 'DCS', 'LIB'].includes(p.role)
    );
    const homeMidfielders = players.filter(
      (p) => p.team === 'home' && ['MED', 'CC', 'MEZ', 'TRQ', 'ED', 'ES'].includes(p.role)
    );
    const homeAttackers = players.filter(
      (p) => p.team === 'home' && ['ATT', 'P', 'SP', 'AD', 'AS'].includes(p.role)
    );

    const makeLinePath = (items: PlacedPlayer[]) => {
      if (items.length < 2) return '';
      // Sort by Y coordinate so line connects top to bottom smoothly
      const sorted = [...items].sort((a, b) => a.y - b.y);
      return sorted.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    };

    return (
      <g className="pointer-events-none opacity-80" strokeDasharray="5,5">
        {homeDefenders.length >= 2 && (
          <path d={makeLinePath(homeDefenders)} stroke="#38bdf8" strokeWidth="2" fill="none" />
        )}
        {homeMidfielders.length >= 2 && (
          <path d={makeLinePath(homeMidfielders)} stroke="#fbbf24" strokeWidth="2" fill="none" />
        )}
        {homeAttackers.length >= 2 && (
          <path d={makeLinePath(homeAttackers)} stroke="#f87171" strokeWidth="2" fill="none" />
        )}
      </g>
    );
  };

  // Generate SVG Path for a Drawing
  const renderDrawingItem = (drawing: TacticalDrawing, isPreview = false) => {
    const { id, type, points, controlPoint, color, strokeWidth: width, strokeDash, fill } = drawing;
    const isSelected = selectedId === id;

    if (!points || points.length === 0) return null;

    const itemKey = isPreview ? `preview-drawing-${id}` : `drawing-${id}`;
    const markerSuffix = isPreview ? `preview-${id}` : id;

    const isInteractive = !isPreview && (selectedTool === 'select' || selectedTool === 'eraser');
    const interactiveProps = isInteractive
      ? { onPointerDown: (e: React.PointerEvent) => handleSelectDrawing(drawing, e), className: 'cursor-pointer' }
      : { className: 'pointer-events-none' };

    const start = points[0];
    const end = points[points.length - 1] || start;

    switch (type) {
      case 'pass_arrow': {
        return (
          <g
            key={itemKey}
            id={`drawing-${itemKey}`}
            {...interactiveProps}
          >
            <defs>
              <marker
                id={`arrow-head-${markerSuffix}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
              </marker>
            </defs>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={color}
              strokeWidth={width}
              markerEnd={`url(#arrow-head-${markerSuffix})`}
              strokeLinecap="round"
            />
            {isSelected && (
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#38bdf8"
                strokeWidth={width + 3}
                opacity="0.5"
              />
            )}
          </g>
        );
      }

      case 'run_arrow': {
        return (
          <g
            key={itemKey}
            id={`drawing-${itemKey}`}
            {...interactiveProps}
          >
            <defs>
              <marker
                id={`arrow-head-run-${markerSuffix}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
              </marker>
            </defs>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={color}
              strokeWidth={width}
              strokeDasharray={strokeDash || '6,6'}
              markerEnd={`url(#arrow-head-run-${markerSuffix})`}
              strokeLinecap="round"
            />
          </g>
        );
      }

      case 'curve_arrow': {
        const cp = controlPoint || { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 30 };
        return (
          <g
            key={itemKey}
            id={`drawing-${itemKey}`}
            {...interactiveProps}
          >
            <defs>
              <marker
                id={`arrow-head-curve-${markerSuffix}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
              </marker>
            </defs>
            <path
              d={`M ${start.x} ${start.y} Q ${cp.x} ${cp.y} ${end.x} ${end.y}`}
              fill="none"
              stroke={color}
              strokeWidth={width}
              markerEnd={`url(#arrow-head-curve-${markerSuffix})`}
              strokeLinecap="round"
            />
            {/* Draggable control point handle when selected */}
            {isSelected && (
              <g>
                <line x1={start.x} y1={start.y} x2={cp.x} y2={cp.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={end.x} y1={end.y} x2={cp.x} y2={cp.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                <circle
                  cx={cp.x}
                  cy={cp.y}
                  r="8"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="cursor-move touch-none tactical-draggable hover:scale-125 transition-transform"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    triggerHaptic();
                    setDraggedItem({ type: 'curve_control', id, offsetX: 0, offsetY: 0 });
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    triggerHaptic();
                    setDraggedItem({ type: 'curve_control', id, offsetX: 0, offsetY: 0 });
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </g>
            )}
          </g>
        );
      }

      case 'dribble_arrow': {
        // Dribbling wave path
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(3, Math.floor(dist / 25));
        const angle = Math.atan2(dy, dx);
        const perpAngle = angle + Math.PI / 2;

        let pathData = `M ${start.x} ${start.y}`;
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const px = start.x + dx * t;
          const py = start.y + dy * t;
          const amp = i === steps ? 0 : (i % 2 === 0 ? 8 : -8);
          const wx = px + Math.cos(perpAngle) * amp;
          const wy = py + Math.sin(perpAngle) * amp;
          pathData += ` Q ${wx} ${wy} ${px} ${py}`;
        }

        return (
          <g key={itemKey} id={`drawing-${itemKey}`} {...interactiveProps}>
            <defs>
              <marker
                id={`arrow-head-dribble-${markerSuffix}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
              </marker>
            </defs>
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth={width}
              markerEnd={`url(#arrow-head-dribble-${markerSuffix})`}
              strokeLinecap="round"
            />
          </g>
        );
      }

      case 'press_arrow': {
        // High intensity zig-zag pressing arrow
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dist = Math.hypot(dx, dy);
        const segments = Math.max(4, Math.floor(dist / 15));
        const angle = Math.atan2(dy, dx);
        const perpAngle = angle + Math.PI / 2;

        let zigZag = `M ${start.x} ${start.y}`;
        for (let i = 1; i < segments; i++) {
          const t = i / segments;
          const px = start.x + dx * t;
          const py = start.y + dy * t;
          const offset = i % 2 === 0 ? 9 : -9;
          zigZag += ` L ${px + Math.cos(perpAngle) * offset} ${py + Math.sin(perpAngle) * offset}`;
        }
        zigZag += ` L ${end.x} ${end.y}`;

        return (
          <g key={itemKey} id={`drawing-${itemKey}`} {...interactiveProps}>
            <defs>
              <marker
                id={`arrow-head-press-${markerSuffix}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 L 2 5 z" fill={color} />
              </marker>
            </defs>
            <path
              d={zigZag}
              fill="none"
              stroke={color}
              strokeWidth={width}
              markerEnd={`url(#arrow-head-press-${markerSuffix})`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      }

      case 'line': {
        return (
          <line
            key={itemKey}
            id={`drawing-${itemKey}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            {...interactiveProps}
          />
        );
      }

      case 'freehand': {
        const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        return (
          <path
            key={itemKey}
            id={`drawing-${itemKey}`}
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...interactiveProps}
          />
        );
      }

      case 'zone_rect': {
        const minX = Math.min(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const widthRect = Math.abs(end.x - start.x);
        const heightRect = Math.abs(end.y - start.y);
        return (
          <rect
            key={itemKey}
            id={`drawing-${itemKey}`}
            x={minX}
            y={minY}
            width={widthRect}
            height={heightRect}
            fill={fill || `${color}22`}
            stroke={color}
            strokeWidth={width}
            strokeDasharray="4 3"
            rx="4"
            {...interactiveProps}
          />
        );
      }

      case 'zone_circle': {
        const cx = (start.x + end.x) / 2;
        const cy = (start.y + end.y) / 2;
        const rx = Math.abs(end.x - start.x) / 2;
        const ry = Math.abs(end.y - start.y) / 2;
        return (
          <ellipse
            key={itemKey}
            id={`drawing-${itemKey}`}
            cx={cx}
            cy={cy}
            rx={Math.max(5, rx)}
            ry={Math.max(5, ry)}
            fill={fill || `${color}22`}
            stroke={color}
            strokeWidth={width}
            strokeDasharray="4 3"
            {...interactiveProps}
          />
        );
      }

      case 'text': {
        return (
          <g
            key={itemKey}
            id={`drawing-${itemKey}`}
            transform={`translate(${start.x}, ${start.y})`}
            {...interactiveProps}
          >
            <rect
              x="-6"
              y="-14"
              width={((drawing.text?.length || 5) * 8.5) + 12}
              height="20"
              rx="4"
              fill="#0f172a"
              stroke={color}
              strokeWidth="1.2"
              opacity="0.95"
            />
            <text
              x="0"
              y="0"
              fill={color}
              fontSize="12"
              fontWeight="bold"
              className="font-sans select-none"
            >
              {drawing.text}
            </text>
          </g>
        );
      }

      default:
        return null;
    }
  };

  // Grass pitch theme background pattern colors
  const getPitchColors = () => {
    switch (pitchTheme) {
      case 'dark_tactical':
        return {
          bg: '#0a1612',
          stripeA: '#0d1f19',
          stripeB: '#091813',
          line: '#ffffff',
          lineOpacity: 0.85,
        };
      case 'light_turf':
        return {
          bg: '#15803d',
          stripeA: '#16a34a',
          stripeB: '#15803d',
          line: '#ffffff',
          lineOpacity: 0.95,
        };
      case 'classic':
        return {
          bg: '#14532d',
          stripeA: '#14532d',
          stripeB: '#14532d',
          line: '#ffffff',
          lineOpacity: 0.9,
        };
      case 'stripes':
      default:
        return {
          bg: '#047857',
          stripeA: '#059669',
          stripeB: '#047857',
          line: '#ffffff',
          lineOpacity: 0.95,
        };
    }
  };

  const themeColors = getPitchColors();

  // Strictly deduplicate lists before rendering SVG elements to avoid any key collision
  const uniqueDrawings = useMemo(() => {
    const seen = new Set<string>();
    const res: TacticalDrawing[] = [];
    for (const d of drawings) {
      if (d && d.id && !seen.has(d.id)) {
        seen.add(d.id);
        res.push(d);
      }
    }
    return res;
  }, [drawings]);

  const uniqueEquipment = useMemo(() => {
    const seen = new Set<string>();
    const res: PlacedEquipment[] = [];
    for (const eq of equipment) {
      if (eq && eq.id && !seen.has(eq.id)) {
        seen.add(eq.id);
        res.push(eq);
      }
    }
    return res;
  }, [equipment]);

  const uniquePlayers = useMemo(() => {
    const seen = new Set<string>();
    const res: PlacedPlayer[] = [];
    for (const p of players) {
      if (p && p.id && !seen.has(p.id)) {
        seen.add(p.id);
        res.push(p);
      }
    }
    return res;
  }, [players]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden bg-[#03150d] p-0 m-0 touch-none">
      <svg
        ref={svgRef}
        viewBox={getViewBox()}
        preserveAspectRatio="none"
        className="w-full h-full touch-none cursor-crosshair tactical-draggable"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onPointerDown={handlePitchPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchMove={(e) => {
          if (draggedItem || rotatingPlayerId || currentDrawing) {
            e.preventDefault();
          }
        }}
      >
        <defs>
          {/* Subtle field shadow */}
          <filter id="pitch-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* --- 1. Grass Base & Realistic Stripes --- */}
        <rect x="0" y="0" width={PITCH_W} height={PITCH_H} fill={themeColors.bg} />
        {pitchTheme === 'stripes' && (
          <g opacity="0.9">
            {Array.from({ length: 15 }).map((_, i) => (
              <rect
                key={i}
                x={(i * PITCH_W) / 15}
                y="0"
                width={PITCH_W / 15}
                height={PITCH_H}
                fill={i % 2 === 0 ? themeColors.stripeA : themeColors.stripeB}
              />
            ))}
          </g>
        )}

        {/* --- 2. 5 Canali & Half-Spaces Tactical Grid Overlay --- */}
        {showHalfSpaces && (
          <g className="pointer-events-none" opacity="0.45">
            {/* 5 Vertical Corridors */}
            {/* Left Flank (0 to 180), Left Half-space (180 to 380), Center (380 to 670), Right Half-space (670 to 870), Right Flank (870 to 1050) */}
            <line x1="190" y1="35" x2="190" y2="645" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 6" />
            <line x1="390" y1="35" x2="390" y2="645" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 6" />
            <line x1="660" y1="35" x2="660" y2="645" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 6" />
            <line x1="860" y1="35" x2="860" y2="645" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* 3 Horizontal Bands: Difesa (35-235), Centrocampo (235-445), Attacco (445-645) */}
            <line x1="55" y1="235" x2="995" y2="235" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="55" y1="445" x2="995" y2="445" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />

            {/* Half-Space labels */}
            <text x="120" y="55" fill="#facc15" fontSize="10" fontWeight="bold" opacity="0.8" textAnchor="middle">Fascia Sx</text>
            <text x="290" y="55" fill="#facc15" fontSize="10" fontWeight="bold" opacity="0.8" textAnchor="middle">Half-Space Sx</text>
            <text x="525" y="55" fill="#facc15" fontSize="10" fontWeight="bold" opacity="0.8" textAnchor="middle">Corridoio Centrale</text>
            <text x="760" y="55" fill="#facc15" fontSize="10" fontWeight="bold" opacity="0.8" textAnchor="middle">Half-Space Dx</text>
            <text x="930" y="55" fill="#facc15" fontSize="10" fontWeight="bold" opacity="0.8" textAnchor="middle">Fascia Dx</text>
          </g>
        )}

        {/* --- 3. Standard Football Pitch Markings --- */}
        {/* Pitch boundary: 55 to 995 (width 940), 35 to 645 (height 610) */}
        <g stroke={themeColors.line} strokeWidth="2.5" fill="none" opacity={themeColors.lineOpacity}>
          {/* Main Pitch Border */}
          <rect x="55" y="35" width="940" height="610" />

          {/* Halfway Line */}
          <line x1="525" y1="35" x2="525" y2="645" />

          {/* Center Circle & Center Spot */}
          <circle cx="525" cy="340" r="91.5" />
          <circle cx="525" cy="340" r="3.5" fill={themeColors.line} />

          {/* Left Penalty Area */}
          <rect x="55" y="139" width="165" height="402" />
          {/* Left Goal Area */}
          <rect x="55" y="240" width="55" height="200" />
          {/* Left Penalty Spot (11m = 110px from line) */}
          <circle cx="165" cy="340" r="3" fill={themeColors.line} />
          {/* Left Penalty Arc */}
          <path d="M 220 286 A 91.5 91.5 0 0 1 220 394" />

          {/* Right Penalty Area */}
          <rect x="830" y="139" width="165" height="402" />
          {/* Right Goal Area */}
          <rect x="940" y="240" width="55" height="200" />
          {/* Right Penalty Spot */}
          <circle cx="885" cy="340" r="3" fill={themeColors.line} />
          {/* Right Penalty Arc */}
          <path d="M 830 286 A 91.5 91.5 0 0 0 830 394" />

          {/* Goal Net Postings */}
          {/* Left Goal */}
          <rect x="25" y="303" width="30" height="74" strokeWidth="2" strokeDasharray="3,3" />
          <line x1="55" y1="303" x2="55" y2="377" strokeWidth="4" strokeLinecap="round" />
          {/* Right Goal */}
          <rect x="995" y="303" width="30" height="74" strokeWidth="2" strokeDasharray="3,3" />
          <line x1="995" y1="303" x2="995" y2="377" strokeWidth="4" strokeLinecap="round" />

          {/* 4 Corner Arcs */}
          <path d="M 55 45 A 10 10 0 0 0 65 35" />
          <path d="M 55 635 A 10 10 0 0 1 65 645" />
          <path d="M 995 45 A 10 10 0 0 1 985 35" />
          <path d="M 995 635 A 10 10 0 0 0 985 645" />
        </g>

        {/* --- 4. Tactical Department Lines --- */}
        {renderDepartmentLines()}

        {/* --- 5. Completed Tactical Drawings --- */}
        {uniqueDrawings.map((drawing) => renderDrawingItem(drawing))}

        {/* --- 6. Active Drawing Preview (in-progress) --- */}
        {currentDrawing && renderDrawingItem(currentDrawing, true)}

        {/* --- 7. Placed Equipment Items --- */}
        {uniqueEquipment.map((eq) => {
          const isSelected = selectedId === eq.id;
          const isDragging = draggedItem?.type === 'equipment' && draggedItem?.id === eq.id;
          return (
            <g
              key={eq.id}
              id={`equipment-${eq.id}`}
              transform={`translate(${eq.x}, ${eq.y}) rotate(${eq.rotation || 0}) ${isDragging ? 'scale(1.2)' : 'scale(1)'}`}
              className={`cursor-grab active:cursor-grabbing select-none touch-none tactical-draggable transition-transform duration-75 ${
                isDragging ? 'tactical-dragging-node' : ''
              }`}
              onPointerDown={(e) => handleSelectEquipment(eq, e)}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleSelectEquipment(eq, e as any);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Dynamic Ground Elevation Shadow when Dragging */}
              {isDragging && (
                <ellipse
                  cx="16"
                  cy="32"
                  rx="18"
                  ry="6"
                  fill="#000000"
                  opacity="0.55"
                  className="pointer-events-none"
                />
              )}

              {/* Selection Ring */}
              {isSelected && !isDragging && (
                <circle
                  cx="16"
                  cy="16"
                  r="20"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              )}

              {/* Active Touch Drag Glow Ring */}
              {isDragging && (
                <circle
                  cx="16"
                  cy="16"
                  r="23"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
              )}
              <EquipmentRenderer type={eq.type} isSelected={isSelected} />
            </g>
          );
        })}

        {/* --- 8. Placed Players --- */}
        {uniquePlayers.map((player) => (
          <PlayerPitchNode
            key={player.id}
            player={player}
            isSelected={selectedId === player.id}
            isDragging={draggedItem?.type === 'player' && draggedItem?.id === player.id}
            showPhotos={showPhotos}
            showNames={showNames}
            showNumbers={showNumbers}
            showRoles={showRoles}
            showOrientation={showOrientation}
            jerseyStyle={jerseyStyle}
            onSelect={handleSelectPlayer}
            onStartRotate={handleStartRotate}
            onRotateQuick={(id, delta) => {
              if (onRotatePlayerQuick) {
                onRotatePlayerQuick(id, delta);
              } else {
                const updated = players.map((p) => {
                  if (p.id !== id) return p;
                  const newRot = (((p.rotation || 0) + delta) % 360 + 360) % 360;
                  return { ...p, rotation: Math.round(newRot) };
                });
                onUpdatePlayers(updated);
              }
            }}
            onDoubleClick={onPlayerDoubleClick}
          />
        ))}
      </svg>
    </div>
  );
};
