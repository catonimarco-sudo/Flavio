import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { PlacedPlayer, Role, TeamColor } from '../types';
import {
  stadiumBgImg,
  backViewImg,
  frontViewImg,
  sideViewImg,
  getTransparent3DPlayerImage,
} from '../utils/player3DTextures';
import { RotateCcw, RotateCw, Sparkles, User, Move, Eye, Layers, Palette, Users, Settings } from 'lucide-react';
import { getKitVisuals, KIT_COLOR_PRESETS } from '../utils/kitVisuals';

interface Broadcast3DPitchProps {
  players: PlacedPlayer[];
  selectedPlayer: PlacedPlayer | null;
  onSelectPlayer: (player: PlacedPlayer | null) => void;
  onUpdatePlayer: (player: PlacedPlayer) => void;
  onUpdatePlayers: (players: PlacedPlayer[]) => void;
  onOpen3DStudio?: (player: PlacedPlayer) => void;
  homeTeamColor?: TeamColor | string;
  awayTeamColor?: TeamColor | string;
}

export const Broadcast3DPitch: React.FC<Broadcast3DPitchProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer,
  onUpdatePlayer,
  onUpdatePlayers,
  onOpen3DStudio,
  homeTeamColor = '#eab308',
  awayTeamColor = '#1d4ed8',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cached transparent 3D character URLs
  const [backUrl, setBackUrl] = useState<string>(backViewImg);
  const [frontUrl, setFrontUrl] = useState<string>(frontViewImg);
  const [sideUrl, setSideUrl] = useState<string>(sideViewImg);

  // Perspective camera direction: 'home' (attacking toward top goal) or 'away'
  const [viewPerspective, setViewPerspective] = useState<'home' | 'away'>('home');

  // Dragging & Click discrimination state
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null);
  const dragStartPos = useRef<{ x: number; y: number; origPlayerX: number; origPlayerY: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  // Quick Team Kit Color picker popover state
  const [showKitColorPicker, setShowKitColorPicker] = useState<'home' | 'away' | null>(null);

  // Pre-process chroma green to transparent on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getTransparent3DPlayerImage(backViewImg),
      getTransparent3DPlayerImage(frontViewImg),
      getTransparent3DPlayerImage(sideViewImg),
    ]).then(([b, f, s]) => {
      if (isMounted) {
        setBackUrl(b);
        setFrontUrl(f);
        setSideUrl(s);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Perspective Projector:
   * Maps 2D tactical pitch coordinates (x: 0..1050, y: 0..680)
   * to 3D Broadcast Stadium screen percentages (left %, top %, scale, zIndex)
   */
  const projectedPlayers = useMemo(() => {
    return players.map((p) => {
      let normProgression = p.x / 1050; // 0 = defense/own goal, 1 = opponent goal
      let normLateral = (p.y - 340) / 340; // -1 = left touchline, 0 = center, +1 = right touchline

      if (viewPerspective === 'away') {
        normProgression = 1 - normProgression;
        normLateral = -normLateral;
      }

      const depthFactor = Math.max(0, Math.min(1, normProgression));
      const topPct = 83 - depthFactor * 55;
      const lateralSpread = 0.92 - depthFactor * 0.54;
      const leftPct = 50 + normLateral * 45 * lateralSpread;
      const scale = 1.35 - depthFactor * 0.88;
      const zIndex = Math.round((1 - depthFactor) * 1000) + 10;
      const rot = ((p.rotation || 0) % 360 + 360) % 360;

      const kitStyle = getKitVisuals(p);

      return {
        player: p,
        leftPct: Math.max(4, Math.min(96, leftPct)),
        topPct: Math.max(22, Math.min(88, topPct)),
        scale: Math.max(0.42, Math.min(1.5, scale)),
        zIndex,
        rotation: rot,
        kitStyle,
      };
    }).sort((a, b) => a.zIndex - b.zIndex);
  }, [players, viewPerspective]);

  // Handle Quick Rotation on pitch
  const handleRotateQuick = (playerId: string, delta: number) => {
    const target = players.find((p) => p.id === playerId);
    if (!target) return;
    const newRot = (((target.rotation || 0) + delta) % 360 + 360) % 360;
    const updated = { ...target, rotation: Math.round(newRot) };
    onUpdatePlayer(updated);
  };

  // Change individual player kit color
  const handleSetPlayerColor = (playerId: string, colorHex: string) => {
    const target = players.find((p) => p.id === playerId);
    if (!target) return;
    const updated = { ...target, customColor: colorHex };
    onUpdatePlayer(updated);
  };

  // Apply a jersey color to an entire team (home or away)
  const handleApplyTeamColor = (team: 'home' | 'away', colorHex: string) => {
    const updated = players.map((p) => {
      if (p.team === team) {
        return { ...p, customColor: colorHex };
      }
      return p;
    });
    onUpdatePlayers(updated);
    if (selectedPlayer && selectedPlayer.team === team) {
      onSelectPlayer({ ...selectedPlayer, customColor: colorHex });
    }
  };

  // Drag handlers in 3D perspective space with move-distance threshold
  const handlePointerDown = (p: PlacedPlayer, e: React.PointerEvent) => {
    e.stopPropagation();
    hasMovedRef.current = false;
    setDraggingPlayerId(p.id);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      origPlayerX: p.x,
      origPlayerY: p.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingPlayerId || !dragStartPos.current || !containerRef.current) return;

      const dist = Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
      if (dist > 4) {
        hasMovedRef.current = true;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const dx = (e.clientX - dragStartPos.current.x) / rect.width;
      const dy = (e.clientY - dragStartPos.current.y) / rect.height;

      // Map screen delta back to pitch coordinates (1050 x 680)
      let deltaPitchX = -dy * 1050 * 1.5;
      let deltaPitchY = dx * 680 * 1.5;

      if (viewPerspective === 'away') {
        deltaPitchX = -deltaPitchX;
        deltaPitchY = -deltaPitchY;
      }

      const newX = Math.max(30, Math.min(1020, dragStartPos.current.origPlayerX + deltaPitchX));
      const newY = Math.max(30, Math.min(650, dragStartPos.current.origPlayerY + deltaPitchY));

      const updated = players.map((p) => (p.id === draggingPlayerId ? { ...p, x: newX, y: newY } : p));
      onUpdatePlayers(updated);
    },
    [draggingPlayerId, players, onUpdatePlayers, viewPerspective]
  );

  const handlePointerUp = (p: PlacedPlayer) => {
    // If the pointer didn't move significantly, it was an explicit click to select!
    if (!hasMovedRef.current) {
      onSelectPlayer(p);
    }
    setDraggingPlayerId(null);
    dragStartPos.current = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onClick={(e) => {
        // Deselect only when clicking on the stadium grass/background directly
        if (e.target === containerRef.current || (e.target as HTMLElement).getAttribute('data-pitch-bg') === 'true') {
          onSelectPlayer(null);
          setShowKitColorPicker(null);
        }
      }}
      className="relative w-full aspect-[16/9] max-h-[82vh] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none bg-slate-950 flex items-center justify-center"
      style={{
        backgroundImage: `url(${stadiumBgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 45%',
      }}
    >
      {/* Pitch grass click target backdrop */}
      <div data-pitch-bg="true" className="absolute inset-0 pointer-events-auto" />

      {/* Stadium Atmospheric Lighting Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

      {/* Top Floating Control Bar: Matchday Live & Quick Kit Color Controls */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between pointer-events-auto z-40 gap-2">
        {/* Left: Stadium Badge & Matchday Live Tag */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-white tracking-wider uppercase font-sans">
            Stadio 3D Broadcast
          </span>
          <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            EA FC Style
          </span>
        </div>

        {/* Center: Team Kit Color Quick Switchers */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80 shadow-lg">
          {/* Home Kit Color */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowKitColorPicker((prev) => (prev === 'home' ? null : 'home'));
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
              title="Cambia colore divisa Squadra Casa"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                style={{
                  backgroundColor:
                    players.find((p) => p.team === 'home')?.customColor || '#eab308',
                }}
              />
              <span>Maglia Casa</span>
            </button>

            {showKitColorPicker === 'home' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full mt-2 left-0 z-50 bg-slate-950/95 border border-amber-500/50 rounded-xl p-2.5 shadow-2xl backdrop-blur-md w-56 space-y-2"
              >
                <div className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Palette size={11} /> Colore Divisa Casa
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {KIT_COLOR_PRESETS.map((k) => (
                    <button
                      key={k.id}
                      onClick={() => {
                        handleApplyTeamColor('home', k.hex);
                        setShowKitColorPicker(null);
                      }}
                      className="w-7 h-7 rounded-full border border-white/40 hover:scale-110 active:scale-95 transition-transform shadow-xs"
                      style={{ backgroundColor: k.hex }}
                      title={k.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-slate-600">|</span>

          {/* Away Kit Color */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowKitColorPicker((prev) => (prev === 'away' ? null : 'away'));
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
              title="Cambia colore divisa Squadra Ospite"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                style={{
                  backgroundColor:
                    players.find((p) => p.team === 'away')?.customColor || '#1d4ed8',
                }}
              />
              <span>Maglia Ospite</span>
            </button>

            {showKitColorPicker === 'away' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full mt-2 right-0 z-50 bg-slate-950/95 border border-blue-500/50 rounded-xl p-2.5 shadow-2xl backdrop-blur-md w-56 space-y-2"
              >
                <div className="text-[10.5px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Palette size={11} /> Colore Divisa Ospite
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {KIT_COLOR_PRESETS.map((k) => (
                    <button
                      key={k.id}
                      onClick={() => {
                        handleApplyTeamColor('away', k.hex);
                        setShowKitColorPicker(null);
                      }}
                      className="w-7 h-7 rounded-full border border-white/40 hover:scale-110 active:scale-95 transition-transform shadow-xs"
                      style={{ backgroundColor: k.hex }}
                      title={k.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Perspective Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewPerspective((prev) => (prev === 'home' ? 'away' : 'home'));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 backdrop-blur-md transition-all active:scale-95 shadow-md"
            title="Inverti visuale porta d'attacco"
          >
            <Eye size={13} className="text-amber-400" />
            <span>Visuale: {viewPerspective === 'home' ? 'Fronte Attacco' : 'Difesa'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3D PLAYERS ON PITCH (REAL-TIME SCALED PERSPECTIVE)
          ======================================================== */}
      {projectedPlayers.map(({ player, leftPct, topPct, scale, zIndex, rotation, kitStyle }) => {
        const isSelected = selectedPlayer?.id === player.id;

        // Orientation relative to camera:
        // 0° = facing toward opponent goal -> BACK VIEW (like player #7 in photo!)
        // 180° = facing toward camera -> FRONT VIEW
        // 90° = facing right touchline -> SIDE VIEW (Facing Right)
        // 270° = facing left touchline -> SIDE VIEW (Facing Left, flipped)
        const normRot = ((rotation % 360) + 360) % 360;
        const isFacingBack = normRot >= 315 || normRot < 45;
        const isFacingFront = normRot >= 135 && normRot < 225;
        const isFacingRight = normRot >= 45 && normRot < 135;
        const isFacingLeft = normRot >= 225 && normRot < 315;

        // Choose appropriate 3D model view
        let modelImg = backUrl;
        let isFlipped = false;

        if (isFacingFront) {
          modelImg = frontUrl;
        } else if (isFacingRight) {
          modelImg = sideUrl;
        } else if (isFacingLeft) {
          modelImg = sideUrl;
          isFlipped = true;
        } else {
          modelImg = backUrl;
        }

        // Render dimensions scaled with perspective
        const baseWidth = 140 * scale;
        const baseHeight = 180 * scale;

        return (
          <div
            key={player.id}
            onPointerDown={(e) => handlePointerDown(player, e)}
            onPointerUp={() => handlePointerUp(player)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlayer(player);
            }}
            className="absolute cursor-pointer select-none group"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: 'translate(-50%, -85%)',
              zIndex: isSelected ? zIndex + 200 : zIndex,
              width: `${baseWidth}px`,
              height: `${baseHeight}px`,
            }}
          >
            {/* Ground Contact Shadow (Soft real-time shadow cast on pitch grass) */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-5 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)',
                transform: `translateX(-50%) scale(${scale})`,
              }}
            />

            {/* Selection Halo / Pitch Spotlight */}
            {isSelected && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-6 rounded-full border-2 border-amber-400 bg-amber-400/25 animate-pulse pointer-events-none"
                style={{
                  boxShadow: '0 0 16px rgba(251, 191, 36, 0.7)',
                }}
              />
            )}

            {/* Floating Quick Action Toolbar (Rotation & Color & Details) when selected */}
            {isSelected && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-400/80 shadow-2xl z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Rotate Left */}
                <button
                  onClick={() => handleRotateQuick(player.id, -45)}
                  className="p-1 rounded-md hover:bg-slate-800 text-amber-400 active:scale-90 transition-transform"
                  title="Gira a Sinistra (-45°)"
                >
                  <RotateCcw size={13} />
                </button>

                <span className="text-[10.5px] font-mono font-bold text-white px-1">
                  {rotation}°
                </span>

                {/* Rotate Right */}
                <button
                  onClick={() => handleRotateQuick(player.id, 45)}
                  className="p-1 rounded-md hover:bg-slate-800 text-amber-400 active:scale-90 transition-transform"
                  title="Gira a Destra (+45°)"
                >
                  <RotateCw size={13} />
                </button>

                <span className="text-slate-700">|</span>

                {/* Quick Color Palette Swatches */}
                <div className="flex items-center gap-1">
                  {['#eab308', '#dc2626', '#1d4ed8', '#f8fafc', '#0f172a', '#16a34a'].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleSetPlayerColor(player.id, c)}
                      className="w-4 h-4 rounded-full border border-white/40 hover:scale-125 transition-transform"
                      style={{ backgroundColor: c }}
                      title="Cambia colore maglia"
                    />
                  ))}
                </div>

                {/* Open 3D Studio button if available */}
                {onOpen3DStudio && (
                  <button
                    onClick={() => onOpen3DStudio(player)}
                    className="ml-1 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-tight shadow-sm"
                    title="Apri Studio 3D Completo"
                  >
                    3D HD
                  </button>
                )}
              </div>
            )}

            {/* ========================================================
                NAME & NUMBER WRITTEN ABOVE PLAYER (TV / PHOTO STYLE)
                Clean dimensions, high contrast, positioned right above head!
                ======================================================== */}
            <div
              className={`absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap z-30 flex items-center gap-1.5 px-2 py-0.5 rounded-md shadow-lg border transition-all ${
                isSelected
                  ? 'bg-slate-950 border-amber-400 ring-1 ring-amber-400/50'
                  : 'bg-slate-950/85 border-slate-700/80'
              }`}
              style={{
                transform: `translateX(-50%) scale(${Math.max(0.72, Math.min(1.15, scale))})`,
              }}
            >
              {/* High-Contrast Number Badge */}
              <span
                className="font-mono font-black rounded px-1.5 py-0.2 text-[11px] leading-tight shadow-xs"
                style={{
                  backgroundColor: kitStyle.badgeBg,
                  color: kitStyle.badgeText,
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                {player.number}
              </span>

              {/* Player Name in Crisp Uppercase */}
              <span className="font-sans font-black tracking-wider text-white text-[11px] uppercase drop-shadow-sm">
                {player.name}
              </span>

              {/* Tactical Role Tag */}
              {player.role && (
                <span className="text-[9.5px] font-bold text-amber-400/90 font-mono">
                  {player.role}
                </span>
              )}
            </div>

            {/* 3D CHARACTER FIGURE CONTAINER */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform"
              style={{
                transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              {/* High-Resolution 3D Player Body with Dynamic Kit Color Filter */}
              <img
                src={modelImg}
                alt={player.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
                style={{
                  filter: kitStyle.filter,
                }}
              />

              {/* ========================================================
                  DYNAMIC HIGH-VISIBILITY JERSEY NUMBER ON BACK / CHEST
                  Ultra-bold athletic font with stroke & deep shadow
                  ======================================================== */}
              {(isFacingBack || isFacingFront) && (
                <div
                  className="absolute pointer-events-none select-none text-center"
                  style={{
                    top: isFacingBack ? '33%' : '35%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: '"Impact", "Arial Black", sans-serif',
                    fontSize: `${Math.max(13, Math.round(23 * scale))}px`,
                    fontWeight: 900,
                    color: kitStyle.numberColor,
                    WebkitTextStroke: `1px ${kitStyle.strokeColor}`,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
                  {player.number}
                </div>
              )}

              {/* Player Surname on Jersey Back (under the collar) */}
              {isFacingBack && (
                <div
                  className="absolute pointer-events-none uppercase tracking-wider select-none text-center whitespace-nowrap"
                  style={{
                    top: '22%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: '"Impact", "Arial Black", sans-serif',
                    fontSize: `${Math.max(7, Math.round(9.5 * scale))}px`,
                    fontWeight: 900,
                    color: kitStyle.numberColor,
                    WebkitTextStroke: `0.4px ${kitStyle.strokeColor}`,
                    filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.95))',
                  }}
                >
                  {player.name.split(' ').pop()}
                </div>
              )}

              {/* Custom Photo Face Badge (if user set a personal avatar) */}
              {player.photoUrl && isFacingFront && (
                <div
                  className="absolute rounded-full overflow-hidden border border-white/80 shadow"
                  style={{
                    top: '11%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${Math.round(22 * scale)}px`,
                    height: `${Math.round(22 * scale)}px`,
                  }}
                >
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Bottom Right: Quick Interaction Hint */}
      <div className="absolute bottom-3 right-4 text-[10.5px] font-medium text-white/60 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg pointer-events-none">
        Clicca per selezionare e modificare • Trascina per spostare
      </div>
    </div>
  );
};
