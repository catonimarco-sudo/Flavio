import React from 'react';
import { PlacedPlayer, JerseyStyle } from '../types';
import { getKitVisuals } from '../utils/kitVisuals';

interface PlayerPitchNodeProps {
  player: PlacedPlayer;
  isSelected: boolean;
  isDragging?: boolean;
  showPhotos: boolean;
  showNames: boolean;
  showNumbers: boolean;
  showRoles: boolean;
  showOrientation: boolean;
  jerseyStyle: JerseyStyle;
  onSelect: (player: PlacedPlayer, e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => void;
  onStartRotate?: (playerId: string, e: React.PointerEvent | React.TouchEvent) => void;
  onRotateQuick?: (playerId: string, deltaDeg: number) => void;
  onDeletePlayer?: (playerId: string) => void;
  onDoubleClick?: (player: PlacedPlayer) => void;
}

export const PlayerPitchNode: React.FC<PlayerPitchNodeProps> = ({
  player,
  isSelected,
  isDragging = false,
  showPhotos,
  showNames,
  showNumbers,
  showRoles,
  showOrientation,
  jerseyStyle,
  onSelect,
  onStartRotate,
  onRotateQuick,
  onDeletePlayer,
  onDoubleClick,
}) => {
  const { team, role, number, name, photoUrl, rotation = 0 } = player;

  // Normalize rotation angle 0..360 & determine perspective
  const normRot = ((rotation % 360) + 360) % 360;
  const isFacingRight = normRot >= 35 && normRot < 145;
  const isFacingBack = normRot >= 145 && normRot < 215;
  const isFacingLeft = normRot >= 215 && normRot < 325;
  const isFacingFront = !isFacingRight && !isFacingBack && !isFacingLeft;

  // Determine team colors and broadcast accents
  let primaryColor = '#801424'; // AS Roma imperial bordeaux by default for home team!
  let secondaryColor = '#facc15'; // Golden yellow accent
  let trimColor = '#fbbf24';
  let roleBadgeBg = '#facc15';
  let roleBadgeText = '#0f172a';
  let skinTone = '#f3c49a';
  let hairColor = '#1c1917';

  if (team === 'home') {
    primaryColor = player.customColor || '#861726'; // Deep bordeaux / Roma red
    secondaryColor = player.secondaryColor || '#facc15'; // Yellow / gold
    trimColor = '#fbbf24';
    roleBadgeBg = '#facc15';
    roleBadgeText = '#0f172a';
  } else if (team === 'away') {
    primaryColor = player.customColor || '#f8fafc'; // White away kit
    secondaryColor = player.secondaryColor || '#861726';
    trimColor = '#861726';
    roleBadgeBg = '#ef4444';
    roleBadgeText = '#ffffff';
  } else if (team === 'jolly') {
    primaryColor = player.customColor || '#eab308'; // Amber yellow (Jolly)
    secondaryColor = '#0f172a';
    trimColor = '#0f172a';
    roleBadgeBg = '#facc15';
    roleBadgeText = '#0f172a';
  } else if (team === 'keeper' || role === 'POR') {
    primaryColor = player.customColor || (team === 'away' ? '#ea580c' : '#059669'); // Emerald or orange keeper
    secondaryColor = '#ffffff';
    trimColor = '#10b981';
    roleBadgeBg = '#10b981';
    roleBadgeText = '#022c22';
  } else if (team === 'referee' || role === 'ARB') {
    primaryColor = player.customColor || '#0f172a';
    secondaryColor = '#facc15';
    trimColor = '#facc15';
    roleBadgeBg = '#020617';
    roleBadgeText = '#facc15';
  }

  // If customColor was directly provided
  if (player.customColor) {
    primaryColor = player.customColor;
  }

  // Adjust role badge color for tactical readability
  if (role === 'TRQ' || role === 'TRE') {
    roleBadgeBg = '#facc15';
    roleBadgeText = '#0f172a';
  } else if (role === 'ATT' || role === 'P' || role === 'SP' || role === 'AD' || role === 'AS') {
    roleBadgeBg = '#ef4444';
    roleBadgeText = '#ffffff';
  } else if (role === 'DC' || role === 'TD' || role === 'TS' || role === 'DCD' || role === 'DCS') {
    roleBadgeBg = '#2563eb';
    roleBadgeText = '#ffffff';
  } else if (role === 'CC' || role === 'MED' || role === 'MEZ' || role === 'REG') {
    roleBadgeBg = '#0284c7';
    roleBadgeText = '#ffffff';
  } else if (role === 'POR') {
    roleBadgeBg = '#10b981';
    roleBadgeText = '#022c22';
  }

  const hasPhoto = showPhotos && !!photoUrl;

  // Clean formatted name in bold uppercase (like TV broadcast lineups in reference photo)
  // Remove trailing initials e.g. "Dybala P." -> "DYBALA", "Jorginho F." -> "JORGINHO F."
  const cleanLastName = name.replace(/\s+[A-Z]\.?$/i, '').trim().toUpperCase();
  const displayName = cleanLastName.length > 15 ? cleanLastName.substring(0, 14) + '…' : cleanLastName;

  // TV Broadcast Nameplate dimensions (High visibility and legibility as in TV broadcast)
  const hasNumOrRole = showNumbers || showRoles;
  const numBoxWidth = hasNumOrRole ? 20 : 0;
  const charWidth = displayName.length > 11 ? 6.2 : 7.2;
  const nameBoxWidth = showNames ? Math.max(50, displayName.length * charWidth + 14) : 0;
  const totalPlateWidth = numBoxWidth + nameBoxWidth;
  const plateHalf = totalPlateWidth / 2;
  const plateHeight = 17;

  // Ultra-clear contrast for shirt number visibility
  const getContrastNumberColor = (hex: string) => {
    if (!hex || !hex.startsWith('#') || hex.length < 7) return '#ffffff';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return lum > 155 ? '#0f172a' : '#ffffff';
  };
  const contrastNumberColor = getContrastNumberColor(primaryColor);
  const numberOutlineColor = contrastNumberColor === '#ffffff' ? '#000000' : '#ffffff';

  // Derive realistic skin and hair based on player characteristics matching reference graphics
  if (name.includes('Lukaku') || name.includes('Ndicka') || name.includes('Koné') || name.includes('Kone')) {
    skinTone = '#3d2516';
    hairColor = '#0a0a0a';
  } else if (name.includes('Wesley')) {
    skinTone = '#452a18';
    hairColor = '#fef08a'; // Bleached blonde hair as in reference lineup
  } else if (name.includes('Rensch')) {
    skinTone = '#9a6338';
    hairColor = '#18181b';
  } else if (name.includes('Ferguson')) {
    skinTone = '#fce7d2';
    hairColor = '#b48238'; // Light brown/blonde swept hair
  } else if (name.includes('Gasperini')) {
    skinTone = '#fae2ce';
    hairColor = '#e2e8f0'; // Silver white
  } else if (name.includes('Dybala') || name.includes('Soulé') || name.includes('Soule')) {
    skinTone = '#fce2c8';
    hairColor = '#151413';
  } else if (name.includes('Pellegrini') || name.includes('Mancini') || name.includes('Cristante') || name.includes('Hermoso')) {
    skinTone = '#eed2b6';
    hairColor = '#332211';
  } else if (name.includes('Celik')) {
    skinTone = '#e4be9b';
    hairColor = '#18181b';
  } else if (name.includes('Svilar')) {
    skinTone = '#fae1cd';
    hairColor = '#4a3321';
  }

  const gradId = `jersey-grad-${player.id}`;
  const collarId = `collar-grad-${player.id}`;
  const skinGradId = `skin-grad-${player.id}`;

  const lastTapTimeRef = React.useRef<number>(0);

  return (
    <g
      id={`player-node-${player.id}`}
      transform={`translate(${player.x}, ${player.y}) ${isDragging ? 'scale(1.15)' : 'scale(1)'}`}
      className={`cursor-grab active:cursor-grabbing select-none group touch-none tactical-draggable transition-transform duration-75 ${
        isDragging ? 'tactical-dragging-node' : ''
      }`}
      onPointerDown={(e) => {
        e.stopPropagation();
        const now = Date.now();
        if (now - lastTapTimeRef.current < 320) {
          onDoubleClick?.(player);
          lastTapTimeRef.current = 0;
        } else {
          lastTapTimeRef.current = now;
        }
        onSelect(player, e);
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDoubleClick={() => onDoubleClick?.(player)}
    >
      <defs>
        {/* Realistic Jersey 3D Fabric Lighting Gradient */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="18%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="70%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
        </linearGradient>

        {/* Inner Collar Depth Gradient */}
        <linearGradient id={collarId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#262626" stopOpacity="0.4" />
        </linearGradient>

        {/* Realistic Skin Lighting Gradient */}
        <radialGradient id={skinGradId} cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="50%" stopColor={skinTone} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </radialGradient>

        {/* Sky Sport Tactical Football Jersey Clip Path */}
        <clipPath id={`clip-jersey-${player.id}`}>
          <path
            d="
              M -6.5,-4
              L -17.5,-1.5
              C -20.5,1.5 -23,5 -24.5,9.5
              L -17,13
              L -13,7.5
              L -12.5,24
              Q 0,25.5 12.5,24
              L 13,7.5
              L 17,13
              L 24.5,9.5
              C 23,5 20.5,1.5 17.5,-1.5
              L 6.5,-4
              Z
            "
          />
        </clipPath>

        {/* Torso Clip Path for Classic Shirt Mode */}
        <clipPath id={`clip-shirt-${player.id}`}>
          <path
            d="
              M -6.5,-4
              L -17.5,-1.5
              C -20.5,1.5 -23,5 -24.5,9.5
              L -17,13
              L -13,7.5
              L -12.5,24
              Q 0,25.5 12.5,24
              L 13,7.5
              L 17,13
              L 24.5,9.5
              C 23,5 20.5,1.5 17.5,-1.5
              L 6.5,-4
              Z
            "
          />
        </clipPath>

        {/* TV Broadcast Nameplate Gradient (Deep TV glass) */}
        <linearGradient id={`plate-grad-${player.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.98" />
          <stop offset="60%" stopColor="#0f172a" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
        </linearGradient>

        {/* TV Broadcast Number Box Gradient */}
        <linearGradient id={`plate-num-grad-${player.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={team === 'away' ? '#0284c7' : primaryColor} stopOpacity="1" />
          <stop offset="100%" stopColor={team === 'away' ? '#0369a1' : '#090d16'} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Dynamic Ground Elevation Shadow when Dragging */}
      {isDragging && (
        <ellipse
          cx="0"
          cy="28"
          rx="26"
          ry="8"
          fill="#000000"
          opacity="0.65"
          className="pointer-events-none"
        />
      )}

      {/* Active Touch Drag Glow Ring */}
      {isDragging && (
        <circle
          cx="0"
          cy="8"
          r="40"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
          opacity="0.9"
          className="animate-pulse"
        />
      )}

      {/* Selection Ring / Highlight */}
      {isSelected && !isDragging && (
        <circle
          cx="0"
          cy="8"
          r="38"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.8"
          strokeDasharray="6 4"
          className="animate-spin-slow origin-center"
        />
      )}

      {/* Sight / Orientation Indicator (Tactical Arrow) */}
      {showOrientation && (
        <g transform={`rotate(${rotation})`}>
          <polygon
            points="0,-35 7,-26 -7,-26"
            fill={isSelected ? '#38bdf8' : '#f8fafc'}
            stroke="#0f172a"
            strokeWidth="1"
            className="filter drop-shadow"
          />
          <line
            x1="0"
            y1="-25"
            x2="0"
            y2="-33"
            stroke={isSelected ? '#38bdf8' : '#ffffff'}
            strokeWidth="2"
          />
        </g>
      )}

      {/* Interactive Rotation Handle when selected */}
      {isSelected && onStartRotate && (
        <g
          transform={`rotate(${rotation})`}
          className="cursor-crosshair touch-none tactical-draggable"
          onPointerDown={(e) => {
            e.stopPropagation();
            onStartRotate(player.id, e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onStartRotate(player.id, e as any);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <line x1="0" y1="-35" x2="0" y2="-47" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <circle
            cx="0"
            cy="-48"
            r="8"
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="2"
            className="hover:scale-125 active:scale-135 transition-transform"
          />
        </g>
      )}

      {/* Quick Orientation & 3D Studio Floating Buttons when Selected */}
      {isSelected && (
        <g className="cursor-pointer select-none" transform="translate(0, -58)">
          {/* Quick Rotate Left (-45°) */}
          <g
            onClick={(e) => {
              e.stopPropagation();
              onRotateQuick?.(player.id, -45);
            }}
            transform="translate(-32, 0)"
            className="hover:scale-115 active:scale-95 transition-transform"
            title="Gira a Sinistra (-45°)"
          >
            <rect x="-12" y="-8.5" width="24" height="17" rx="4" fill="#0b1120" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="0" y="3.8" textAnchor="middle" fontSize="10.5" fill="#38bdf8" fontWeight="bold">◀</text>
          </g>

          {/* Invert Orientation (180°) */}
          <g
            onClick={(e) => {
              e.stopPropagation();
              onRotateQuick?.(player.id, 180);
            }}
            transform="translate(0, 0)"
            className="hover:scale-115 active:scale-95 transition-transform"
            title="Inverti Orientamento (180°)"
          >
            <rect x="-14" y="-8.5" width="28" height="17" rx="4" fill="#0b1120" stroke="#f59e0b" strokeWidth="1.2" />
            <text x="0" y="3.8" textAnchor="middle" fontSize="9" fill="#f59e0b" fontWeight="black">180°</text>
          </g>

          {/* Quick Rotate Right (+45°) */}
          <g
            onClick={(e) => {
              e.stopPropagation();
              onRotateQuick?.(player.id, 45);
            }}
            transform="translate(32, 0)"
            className="hover:scale-115 active:scale-95 transition-transform"
            title="Gira a Destra (+45°)"
          >
            <rect x="-12" y="-8.5" width="24" height="17" rx="4" fill="#0b1120" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="0" y="3.8" textAnchor="middle" fontSize="10.5" fill="#38bdf8" fontWeight="bold">▶</text>
          </g>

          {/* Quick Delete Player Button (Cestino) */}
          {onDeletePlayer && (
            <g
              id={`btn-delete-player-${player.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDeletePlayer(player.id);
              }}
              transform="translate(60, 0)"
              className="hover:scale-115 active:scale-95 transition-transform"
              title="Elimina questo singolo giocatore"
            >
              <rect x="-12" y="-8.5" width="24" height="17" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1.2" />
              <text x="0" y="3.8" textAnchor="middle" fontSize="10" fill="#fca5a5" fontWeight="bold">✕</text>
            </g>
          )}
        </g>
      )}

      {/* ========================================================
          VISUAL MODE 1: REALISTIC TACTICAL JERSEY & TV BROADCAST
          ======================================================== */}
      {jerseyStyle === 'broadcast' || jerseyStyle === 'realistic' ? (
        <g className="filter drop-shadow-xl select-none" transform={isFacingLeft ? 'scale(-1, 1)' : undefined}>
          {/* --- 0. TV Selection Highlight Outline --- */}
          {isSelected && (
            <path
              d="
                M -6.5,-4
                L -17.5,-1.5
                C -20.5,1.5 -23,5 -24.5,9.5
                L -17,13
                L -13,7.5
                L -12.5,24
                Q 0,25.5 12.5,24
                L 13,7.5
                L 17,13
                L 24.5,9.5
                C 23,5 20.5,1.5 17.5,-1.5
                L 6.5,-4
                Z
              "
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.2"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.9"
            />
          )}

          {/* --- 1. Athletic Neck connecting head & jersey --- */}
          <path
            d="M -3.6,-8.5 L -4,-3 L 4,-3 L 3.6,-8.5 Z"
            fill={skinTone}
          />
          {/* Subtle Neck Throat Shadow */}
          <path
            d="M -3,-7.5 Q 0,-5.5 3,-7.5 L 3.5,-3 L -3.5,-3 Z"
            fill="#000000"
            opacity="0.2"
          />

          {/* --- 2. Head & Vector Face (Compact, Scaled with Shoulders) --- */}
          <g transform="translate(0, -14.5)">
            {hasPhoto ? (
              <g>
                <clipPath id={`clip-realhead-${player.id}`}>
                  <circle cx="0" cy="0" r="11" />
                </clipPath>
                {/* Outer metallic frame ring */}
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="#0b1120"
                  stroke={isSelected ? '#38bdf8' : '#ffffff'}
                  strokeWidth="1.5"
                />
                <image
                  href={photoUrl}
                  x="-12"
                  y="-12"
                  width="24"
                  height="24"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#clip-realhead-${player.id})`}
                />
              </g>
            ) : (
              /* Stylized Vector Face (Matching photo illustration) */
              <g>
                {/* Ears */}
                <ellipse cx="-6.8" cy="-0.2" rx="1.5" ry="2.2" fill={skinTone} />
                <ellipse cx="6.8" cy="-0.2" rx="1.5" ry="2.2" fill={skinTone} />

                {/* Head Base with 3D Light */}
                <path
                  d="
                    M 0,-7.8
                    C 4.8,-7.8 6.8,-4.2 6.8,0.5
                    C 6.8,4.5 4.5,7.6 0,8.4
                    C -4.5,7.6 -6.8,4.5 -6.8,0.5
                    C -6.8,-4.2 -4.8,-7.8 0,-7.8
                    Z
                  "
                  fill={`url(#${skinGradId})`}
                  stroke="#000000"
                  strokeWidth="0.4"
                  strokeOpacity="0.3"
                />

                {/* Eyebrows */}
                <path d="M -4.8,-2.2 Q -3,-3.2 -1.2,-2.2" stroke={hairColor} strokeWidth="1" strokeLinecap="round" fill="none" />
                <path d="M 1.2,-2.2 Q 3,-3.2 4.8,-2.2" stroke={hairColor} strokeWidth="1" strokeLinecap="round" fill="none" />

                {/* Eyes with pupil & white glint */}
                <ellipse cx="-3" cy="-0.3" rx="1.2" ry="0.85" fill="#ffffff" />
                <circle cx="-2.9" cy="-0.3" r="0.65" fill="#1c1917" />
                <circle cx="-2.6" cy="-0.6" r="0.25" fill="#ffffff" />

                <ellipse cx="3" cy="-0.3" rx="1.2" ry="0.85" fill="#ffffff" />
                <circle cx="2.9" cy="-0.3" r="0.65" fill="#1c1917" />
                <circle cx="3.2" cy="-0.6" r="0.25" fill="#ffffff" />

                {/* Nose bridge */}
                <path d="M 0,-1.2 L -0.4,1.6 L 0.5,1.6" stroke="#000000" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.3" />

                {/* Lips & smile */}
                <path d="M -1.8,3.8 Q 0,4.8 1.8,3.8" stroke="#993d3d" strokeWidth="0.8" strokeLinecap="round" fill="none" />

                {/* Facial Hair / Beard / Stubble */}
                {(name.includes('Pellegrini') || name.includes('Mancini') || name.includes('Cristante') || name.includes('Hermoso') || name.includes('Celik') || name.includes('Rensch') || name.includes('Svilar')) && (
                  name.includes('Svilar') || name.includes('Rensch') ? (
                    /* Mustache + Goatee */
                    <g>
                      <path d="M -2,2.8 Q 0,3.6 2,2.8" stroke={hairColor} strokeWidth="1" strokeLinecap="round" fill="none" />
                      <path d="M -1.2,5.2 Q 0,6.8 1.2,5.2 Z" fill={hairColor} />
                    </g>
                  ) : (
                    /* Full / Stubble Beard along jaw */
                    <path
                      d="M -5.5,1.5 C -5,5.5 -3,7.5 0,7.8 C 3,7.5 5,5.5 5.5,1.5 C 4.5,4.5 2.8,6.2 0,6.5 C -2.8,6.2 -4.5,4.5 -5.5,1.5 Z"
                      fill={hairColor}
                      opacity="0.6"
                    />
                  )
                )}

                {/* Modern Hairstyle (Distinctive for players) */}
                {name.includes('Wesley') ? (
                  /* Bleached blonde buzzed crop */
                  <path
                    d="M -6.5,-1 C -6.5,-5.5 -2.5,-8 0,-8 C 2.5,-8 6.5,-5.5 6.5,-1 C 5.5,-3.5 3,-5 0,-5 C -3,-5 -5.5,-3.5 -6.5,-1 Z"
                    fill={hairColor}
                  />
                ) : name.includes('Koné') || name.includes('Kone') || name.includes('Ndicka') ? (
                  /* Dreads / Cornrows */
                  <g>
                    <path
                      d="M -6.8,-1 C -6.8,-6 -2.5,-8.5 0,-8.5 C 2.5,-8.5 6.8,-6 6.8,-1 C 6,-4 3,-6 0,-6 C -3,-6 -6,-4 -6.8,-1 Z"
                      fill={hairColor}
                    />
                    <path d="M -6,-0.5 L -5,3" stroke={hairColor} strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M -4.5,-2 L -3.5,2.5" stroke={hairColor} strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 6,-0.5 L 5,3" stroke={hairColor} strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 4.5,-2 L 3.5,2.5" stroke={hairColor} strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                ) : name.includes('Svilar') ? (
                  /* Longer wavy parted hair */
                  <g>
                    <path
                      d="M -7.2,1 C -7,-5 -2.5,-8.2 0,-8.2 C 2.5,-8.2 7,-5 7.2,1 C 6.5,-2 4,-5.5 0,-5 C -4,-5.5 -6.5,-2 -7.2,1 Z"
                      fill={hairColor}
                    />
                    <path d="M -0.2,-8 L -0.5,-5" stroke={skinTone} strokeWidth="0.8" />
                  </g>
                ) : (
                  /* Standard clean modern fade */
                  <g>
                    <path
                      d="
                        M -6.8,-2
                        C -6.8,-6.8 -2.5,-9 0,-9
                        C 2.5,-9 6.8,-6.8 6.8,-2
                        C 6,-4.5 3.8,-6.2 0,-6.2
                        C -3.8,-6.2 -6,-4.5 -6.8,-2
                        Z
                      "
                      fill={hairColor}
                    />
                    <path d="M -6.8,-2 Q -4.8,-5.5 -3.5,-1.5 Q -4.8,0.8 -6.8,0.8 Z" fill={hairColor} opacity="0.4" />
                    <path d="M 6.8,-2 Q 4.8,-5.5 3.5,-1.5 Q 4.8,0.8 6.8,0.8 Z" fill={hairColor} opacity="0.4" />
                    <path d="M -3.8,-7 Q 0,-8.8 3.8,-7" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.25" />
                  </g>
                )}
              </g>
            )}
          </g>

          {/* --- 3. Sky Sport Football Kit Jersey (Clean Silhouette, NO Bare Arms) --- */}
          {player.jerseyImageUrl ? (
            /* Custom Uploaded Jersey Texture */
            <g clipPath={`url(#clip-jersey-${player.id})`}>
              <rect x="-26" y="-6" width="52" height="34" fill={primaryColor} />
              <image
                href={player.jerseyImageUrl}
                x="-25"
                y="-5"
                width="50"
                height="32"
                preserveAspectRatio="xMidYMid slice"
              />
              {/* 3D Fabric Lighting */}
              <path
                d="
                  M -6.5,-4
                  L -17.5,-1.5
                  C -20.5,1.5 -23,5 -24.5,9.5
                  L -17,13
                  L -13,7.5
                  L -12.5,24
                  Q 0,25.5 12.5,24
                  L 13,7.5
                  L 17,13
                  L 24.5,9.5
                  C 23,5 20.5,1.5 17.5,-1.5
                  L 6.5,-4
                  Z
                "
                fill={`url(#${gradId})`}
                opacity="0.32"
              />
            </g>
          ) : (
            <>
              {/* Base Football Jersey Kit */}
              <path
                d="
                  M -6.5,-4
                  L -17.5,-1.5
                  C -20.5,1.5 -23,5 -24.5,9.5
                  L -17,13
                  L -13,7.5
                  L -12.5,24
                  Q 0,25.5 12.5,24
                  L 13,7.5
                  L 17,13
                  L 24.5,9.5
                  C 23,5 20.5,1.5 17.5,-1.5
                  L 6.5,-4
                  Z
                "
                fill={primaryColor}
              />
              {/* 3D Fabric Lighting Overlay */}
              <path
                d="
                  M -6.5,-4
                  L -17.5,-1.5
                  C -20.5,1.5 -23,5 -24.5,9.5
                  L -17,13
                  L -13,7.5
                  L -12.5,24
                  Q 0,25.5 12.5,24
                  L 13,7.5
                  L 17,13
                  L 24.5,9.5
                  C 23,5 20.5,1.5 17.5,-1.5
                  L 6.5,-4
                  Z
                "
                fill={`url(#${gradId})`}
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeOpacity="0.35"
              />

              {/* Natural Shoulder Light Reflection */}
              <path
                d="M -17.5,-1.5 L -6.5,-4 Q 0,-3.5 6.5,-4 L 17.5,-1.5"
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeOpacity="0.4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Modern Raglan Seams along Shoulders to Underarms */}
              <path
                d="M -6.5,-4 Q -9.5,1 -13,7.5"
                stroke={secondaryColor}
                strokeWidth="1.2"
                strokeOpacity="0.65"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 6.5,-4 Q 9.5,1 13,7.5"
                stroke={secondaryColor}
                strokeWidth="1.2"
                strokeOpacity="0.65"
                fill="none"
                strokeLinecap="round"
              />

              {/* Sleeve Cuffs - Contrasting Trim Bands */}
              <line
                x1="-24.5"
                y1="9.5"
                x2="-17"
                y2="13"
                stroke={secondaryColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="24.5"
                y1="9.5"
                x2="17"
                y2="13"
                stroke={secondaryColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Breathable Mesh Side Seams */}
              <path
                d="M -13,8.5 L -12.5,23.5"
                stroke="#000000"
                strokeWidth="1.6"
                strokeOpacity="0.25"
                fill="none"
              />
              <path
                d="M 13,8.5 L 12.5,23.5"
                stroke="#000000"
                strokeWidth="1.6"
                strokeOpacity="0.25"
                fill="none"
              />

              {/* Club Crest on Left Chest (Heart) */}
              <g transform="translate(-6.8, 5) scale(0.8)">
                <path
                  d="M -3,-2.2 L 3,-2.2 L 3,2 C 3,4.5 0,6 0,6 C 0,6 -3,4.5 -3,2 Z"
                  fill={secondaryColor}
                  stroke="#0f172a"
                  strokeWidth="0.6"
                />
                <path
                  d="M -1.8,-1.2 L 1.8,-1.2 L 1.8,1.8 C 1.8,3.5 0,4.8 0,4.8 C 0,4.8 -1.8,3.5 -1.8,1.8 Z"
                  fill={primaryColor}
                />
              </g>

              {/* Technical Brand Logo on Right Chest */}
              <path
                d="M 5.8,5.5 Q 8,7 9.5,4.8"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Optional Sponsor text if defined */}
              {player.sponsorText && (
                <text
                  x="0"
                  y="9.5"
                  transform={isFacingLeft ? 'scale(-1, 1)' : undefined}
                  textAnchor="middle"
                  fontSize="3.8"
                  fontWeight="900"
                  fill={secondaryColor}
                  opacity="0.85"
                  className="tracking-widest font-sans select-none"
                >
                  {player.sponsorText}
                </text>
              )}
            </>
          )}

          {/* Inner Back Collar Depth */}
          <ellipse cx="0" cy="-3.8" rx="6" ry="2" fill="#0b0f19" opacity="0.8" />
          {/* V-neck / Crew Collar Ribbing */}
          <path
            d="M -6.5,-4 Q 0,2.5 6.5,-4"
            stroke={secondaryColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 0,0.5 L 0,3.5"
            stroke={secondaryColor}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Jersey Clean Outer Contour */}
          <path
            d="
              M -6.5,-4
              L -17.5,-1.5
              C -20.5,1.5 -23,5 -24.5,9.5
              L -17,13
              L -13,7.5
              L -12.5,24
              Q 0,25.5 12.5,24
              L 13,7.5
              L 17,13
              L 24.5,9.5
              C 23,5 20.5,1.5 17.5,-1.5
              L 6.5,-4
              Z
            "
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.35"
          />

          {/* Big Bold Athletic Jersey Number on Chest (Centered, Counter-flipped if Facing Left) */}
          {showNumbers && (
            <g
              className="pointer-events-none select-none"
              transform={isFacingLeft ? 'scale(-1, 1)' : undefined}
            >
              <text
                x="0"
                y="18"
                textAnchor="middle"
                fontSize="15.5"
                fontWeight="900"
                fill={contrastNumberColor}
                stroke={numberOutlineColor}
                strokeWidth="3.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ paintOrder: 'stroke fill' }}
                className="font-sans select-none font-black tracking-tight"
              >
                {number}
              </text>
            </g>
          )}
        </g>
      ) : jerseyStyle === 'shirt' ? (
        /* ========================================================
            VISUAL MODE 2: CLASSIC SHIRT (IMPROVED)
            ======================================================== */
        <g className="filter drop-shadow-lg select-none">
          <g transform="translate(0, -17)">
            <circle
              cx="0"
              cy="0"
              r="12.5"
              fill="#f1f5f9"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {hasPhoto ? (
              <>
                <clipPath id={`clip-head-${player.id}`}>
                  <circle cx="0" cy="0" r="11.5" />
                </clipPath>
                <image
                  href={photoUrl}
                  x="-12"
                  y="-12"
                  width="24"
                  height="24"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#clip-head-${player.id})`}
                />
              </>
            ) : (
              <g opacity="0.85">
                <path d="M -9,-2 Q 0,-13 9,-2 Q 9,-7 0,-11 Q -9,-7 -9,-2 Z" fill="#334155" />
                <circle cx="-3.5" cy="-0.5" r="1.3" fill="#1e293b" />
                <circle cx="3.5" cy="-0.5" r="1.3" fill="#1e293b" />
                <path d="M -3,4 Q 0,7 3,4" fill="none" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
              </g>
            )}
          </g>

          {player.jerseyImageUrl ? (
            /* Custom Jersey in Shirt Mode */
            <g clipPath={`url(#clip-shirt-${player.id})`}>
              <rect x="-26" y="-6" width="52" height="34" fill={primaryColor} />
              <image
                href={player.jerseyImageUrl}
                x="-25"
                y="-5"
                width="50"
                height="32"
                preserveAspectRatio="xMidYMid slice"
              />
              <path
                d="
                  M -6.5,-4
                  L -17.5,-1.5
                  C -20.5,1.5 -23,5 -24.5,9.5
                  L -17,13
                  L -13,7.5
                  L -12.5,24
                  Q 0,25.5 12.5,24
                  L 13,7.5
                  L 17,13
                  L 24.5,9.5
                  C 23,5 20.5,1.5 17.5,-1.5
                  L 6.5,-4
                  Z
                "
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </g>
          ) : (
            <path
              d="
                M -6.5,-4
                L -17.5,-1.5
                C -20.5,1.5 -23,5 -24.5,9.5
                L -17,13
                L -13,7.5
                L -12.5,24
                Q 0,25.5 12.5,24
                L 13,7.5
                L 17,13
                L 24.5,9.5
                C 23,5 20.5,1.5 17.5,-1.5
                L 6.5,-4
                Z
              "
              fill={primaryColor}
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          )}

          {/* Collar & Seams */}
          <ellipse cx="0" cy="-3.8" rx="6" ry="2" fill="#0b0f19" opacity="0.8" />
          <path
            d="M -6.5,-4 Q 0,2.5 6.5,-4"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 0,0.5 L 0,3.5"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Sleeve Cuffs */}
          <line x1="-24.5" y1="9.5" x2="-17" y2="13" stroke={secondaryColor} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="24.5" y1="9.5" x2="17" y2="13" stroke={secondaryColor} strokeWidth="2.2" strokeLinecap="round" />

          {showNumbers && (
            <text
              x="0"
              y="18"
              textAnchor="middle"
              fontSize="15.5"
              fontWeight="900"
              fill={contrastNumberColor}
              stroke={numberOutlineColor}
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ paintOrder: 'stroke fill' }}
              className="font-sans select-none tracking-tight font-black pointer-events-none"
            >
              {number}
            </text>
          )}
        </g>
      ) : jerseyStyle === 'vest' ? (
        /* ========================================================
            VISUAL MODE 3: TRAINING BIBS / PETTORINA
            ======================================================== */
        <g className="filter drop-shadow-md select-none">
          <circle cx="0" cy="-14" r="10" fill={skinTone} stroke="#0f172a" strokeWidth="1.2" />
          {/* Sleeveless bib */}
          <path
            d="
              M -6,-4 L -11,-2 L -10,18 L 10,18 L 11,-2 L 6,-4
              Q 0,1 -6,-4 Z
            "
            fill={primaryColor}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {showNumbers && (
            <text
              x="0"
              y="11.5"
              textAnchor="middle"
              fontSize="13.5"
              fontWeight="900"
              fill={contrastNumberColor}
              stroke={numberOutlineColor}
              strokeWidth="2.8"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ paintOrder: 'stroke fill' }}
              className="font-sans font-black pointer-events-none"
            >
              {number}
            </text>
          )}
        </g>
      ) : (
        /* ========================================================
            VISUAL MODE 4: MINIMALIST MODERN BADGE
            ======================================================== */
        <g className="filter drop-shadow-lg select-none">
          <circle
            cx="0"
            cy="0"
            r="18"
            fill={primaryColor}
            stroke={isSelected ? '#38bdf8' : '#ffffff'}
            strokeWidth={isSelected ? '3' : '2'}
          />
          {hasPhoto ? (
            <>
              <clipPath id={`clip-circle-${player.id}`}>
                <circle cx="0" cy="0" r="16" />
              </clipPath>
              <image
                href={photoUrl}
                x="-16"
                y="-16"
                width="32"
                height="32"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-circle-${player.id})`}
              />
            </>
          ) : player.jerseyImageUrl ? (
            <>
              <clipPath id={`clip-circle-jersey-${player.id}`}>
                <circle cx="0" cy="0" r="16" />
              </clipPath>
              <image
                href={player.jerseyImageUrl}
                x="-16"
                y="-16"
                width="32"
                height="32"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-circle-jersey-${player.id})`}
              />
              {showNumbers && (
                <text
                  x="0"
                  y="5.5"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="900"
                  fill={contrastNumberColor}
                  stroke={numberOutlineColor}
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ paintOrder: 'stroke fill' }}
                  className="font-sans select-none font-black pointer-events-none"
                >
                  {number}
                </text>
              )}
            </>
          ) : (
            showNumbers && (
              <text
                x="0"
                y="5.5"
                textAnchor="middle"
                fontSize="15"
                fontWeight="900"
                fill={contrastNumberColor}
                stroke={numberOutlineColor}
                strokeWidth="3.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ paintOrder: 'stroke fill' }}
                className="font-sans select-none font-black pointer-events-none"
              >
                {number}
              </text>
            )
          )}
        </g>
      )}

      {/* ========================================================
          TV BROADCAST NAMEPLATE PLAQUE (BELOW THE PLAYER)
          Ultra-visible, high-contrast, broadcast TV graphic
          matching the reference photo!
          ======================================================== */}
      {(showRoles || showNames || showNumbers) && (
        <g
          transform={`translate(0, ${jerseyStyle === 'circle' ? 19 : 26})`}
          className="pointer-events-none filter drop-shadow-md select-none"
        >
          {/* Main Background Frame - Sky Sport High-Contrast White Plaque */}
          <rect
            x={-plateHalf}
            y="0"
            width={totalPlateWidth}
            height={plateHeight}
            rx="3.5"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="0.9"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.65))' }}
          />

          {/* Left Number / Role Box */}
          {hasNumOrRole && (
            <g>
              <rect
                x={-plateHalf}
                y="0"
                width={numBoxWidth}
                height={plateHeight}
                rx="3.5"
                fill={primaryColor}
                stroke="#94a3b8"
                strokeWidth="0.9"
              />
              {/* Divider between Number Box and Name Box */}
              <line
                x1={-plateHalf + numBoxWidth}
                y1="0"
                x2={-plateHalf + numBoxWidth}
                y2={plateHeight}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              {showNumbers ? (
                <text
                  x={-plateHalf + numBoxWidth / 2}
                  y="12.2"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="900"
                  fill="#ffffff"
                  className="font-mono tracking-tight font-black"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))' }}
                >
                  {number}
                </text>
              ) : showRoles ? (
                <text
                  x={-plateHalf + numBoxWidth / 2}
                  y="12"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="900"
                  fill="#ffffff"
                  className="font-mono tracking-tight font-black"
                >
                  {role}
                </text>
              ) : null}
            </g>
          )}

          {/* Right Player Surname - Bold, crisp, dark navy (#0f172a), ultra-visible */}
          {showNames && (
            <g>
              <text
                x={-plateHalf + numBoxWidth + nameBoxWidth / 2}
                y="12.2"
                textAnchor="middle"
                fontSize={displayName.length > 11 ? "9.5" : "10.5"}
                fontWeight="900"
                fill="#0f172a"
                letterSpacing="0.04em"
                className="font-sans font-black tracking-wider select-none uppercase"
              >
                {displayName}
              </text>
            </g>
          )}
        </g>
      )}
    </g>
  );
};
