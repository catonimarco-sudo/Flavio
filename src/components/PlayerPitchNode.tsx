import React from 'react';
import { PlacedPlayer } from '../types';

interface PlayerPitchNodeProps {
  player: PlacedPlayer;
  isSelected: boolean;
  isDragging?: boolean;
  showPhotos: boolean;
  showNames: boolean;
  showNumbers: boolean;
  showRoles: boolean;
  showOrientation: boolean;
  jerseyStyle: 'shirt' | 'circle' | 'vest';
  onSelect: (player: PlacedPlayer, e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => void;
  onStartRotate?: (playerId: string, e: React.PointerEvent | React.TouchEvent) => void;
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
  onDoubleClick,
}) => {
  const { team, role, number, name, photoUrl, rotation = 0 } = player;

  // Determine team colors
  let primaryColor = '#2563eb'; // vivid royal blue (Home)
  let secondaryColor = '#ffffff';
  let roleBadgeBg = '#3b82f6';
  let roleBadgeText = '#ffffff';

  if (team === 'away') {
    primaryColor = '#dc2626'; // crimson red (Away)
    roleBadgeBg = '#ef4444';
    roleBadgeText = '#ffffff';
  } else if (team === 'jolly') {
    primaryColor = '#eab308'; // amber yellow (Jolly)
    secondaryColor = '#0f172a';
    roleBadgeBg = '#facc15';
    roleBadgeText = '#0f172a';
  } else if (team === 'keeper' || role === 'POR') {
    primaryColor = team === 'away' ? '#ea580c' : '#059669'; // orange or emerald keeper
    secondaryColor = '#ffffff';
    roleBadgeBg = '#10b981';
    roleBadgeText = '#022c22';
  } else if (team === 'referee' || role === 'ARB') {
    primaryColor = '#0f172a';
    secondaryColor = '#facc15';
    roleBadgeBg = '#020617';
    roleBadgeText = '#facc15';
  }

  if (player.customColor) {
    primaryColor = player.customColor;
  }

  // Custom role badge styling (Yellow for TRQ, Blue for DIF, Red for ATT, Green for POR)
  if (role === 'TRQ') {
    roleBadgeBg = '#facc15';
    roleBadgeText = '#0f172a';
  } else if (role === 'ATT' || role === 'P' || role === 'SP' || role === 'AD' || role === 'AS') {
    roleBadgeBg = '#ef4444';
    roleBadgeText = '#ffffff';
  } else if (role === 'DC' || role === 'TD' || role === 'TS' || role === 'DIF') {
    roleBadgeBg = '#3b82f6';
    roleBadgeText = '#ffffff';
  } else if (role === 'CC' || role === 'MED' || role === 'CEN') {
    roleBadgeBg = '#0284c7';
    roleBadgeText = '#ffffff';
  } else if (role === 'POR') {
    roleBadgeBg = '#10b981';
    roleBadgeText = '#022c22';
  }

  const hasPhoto = showPhotos && !!photoUrl;

  // Clean formatted name
  const displayName = name.length > 12 ? name.substring(0, 11) + '.' : name;
  const roleWidth = role.length > 2 ? 30 : 26;
  const nameWidth = Math.max(50, displayName.length * 7.5 + 14);
  const totalTagWidth = (showRoles ? roleWidth : 0) + (showNames ? nameWidth : 0);
  const tagHalf = totalTagWidth / 2;

  return (
    <g
      id={`player-node-${player.id}`}
      transform={`translate(${player.x}, ${player.y}) ${isDragging ? 'scale(1.15)' : 'scale(1)'}`}
      className={`cursor-grab active:cursor-grabbing select-none group touch-none tactical-draggable transition-transform duration-75 ${
        isDragging ? 'tactical-dragging-node' : ''
      }`}
      onPointerDown={(e) => {
        onSelect(player, e);
      }}
      onTouchStart={(e) => {
        // Prevent default browser gestures on mobile
        e.stopPropagation();
        onSelect(player, e);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDoubleClick={() => onDoubleClick?.(player)}
    >
      {/* Dynamic Ground Elevation Shadow when Dragging */}
      {isDragging && (
        <ellipse
          cx="0"
          cy="26"
          rx="22"
          ry="7"
          fill="#000000"
          opacity="0.6"
          className="pointer-events-none"
        />
      )}

      {/* Active Touch Drag Glow Ring */}
      {isDragging && (
        <circle
          cx="0"
          cy="0"
          r="36"
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
          cy="0"
          r="34"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeDasharray="6 4"
          className="animate-spin-slow origin-center"
        />
      )}

      {/* Sight / Orientation Indicator (Arrow) */}
      {showOrientation && (
        <g transform={`rotate(${rotation})`}>
          <polygon
            points="0,-32 7,-23 -7,-23"
            fill={isSelected ? '#38bdf8' : '#f8fafc'}
            stroke="#0f172a"
            strokeWidth="1"
            className="filter drop-shadow"
          />
          <line
            x1="0"
            y1="-22"
            x2="0"
            y2="-30"
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
          <line x1="0" y1="-32" x2="0" y2="-44" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <circle
            cx="0"
            cy="-45"
            r="8"
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="2.5"
            className="hover:scale-125 active:scale-135 transition-transform"
          />
        </g>
      )}

      {/* Main Player Visual: Full Jersey Figure with Head & Shirt */}
      {jerseyStyle === 'shirt' ? (
        <g className="filter drop-shadow-lg">
          {/* 1. Player Head / Face Avatar (Centered at top) */}
          <g transform="translate(0, -17)">
            {/* Outer Head Ring */}
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
              /* Stylized head outline when photo is missing */
              <g opacity="0.85">
                {/* Hair */}
                <path d="M -9,-2 Q 0,-13 9,-2 Q 9,-7 0,-11 Q -9,-7 -9,-2 Z" fill="#334155" />
                {/* Face & Eyes */}
                <circle cx="-3.5" cy="-0.5" r="1.3" fill="#1e293b" />
                <circle cx="3.5" cy="-0.5" r="1.3" fill="#1e293b" />
                {/* Smile */}
                <path d="M -3,4 Q 0,7 3,4" fill="none" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
              </g>
            )}
          </g>

          {/* 2. Football Jersey / Maglietta */}
          {/* Main Jersey Outline with Sleeves & Waist */}
          <path
            d="
              M -7,-5
              L -16,-3
              L -22,7
              L -15,11
              L -11,4
              L -11,20
              L 11,20
              L 11,4
              L 15,11
              L 22,7
              L 16,-3
              L 7,-5
              Z
            "
            fill={primaryColor}
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* V-Collar Detail */}
          <path
            d="M -6,-5 Q 0,-1 6,-5"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 0,-2 L 0,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Sleeve Stripes / Trim */}
          <line x1="-21" y1="6" x2="-16" y2="9.5" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
          <line x1="21" y1="6" x2="16" y2="9.5" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />

          {/* Large Jersey Number on Chest */}
          {showNumbers && (
            <text
              x="0"
              y="14"
              textAnchor="middle"
              fontSize="14.5"
              fontWeight="900"
              fill={secondaryColor}
              stroke="#0f172a"
              strokeWidth="0.5"
              className="font-sans select-none tracking-tight"
            >
              {number}
            </text>
          )}
        </g>
      ) : (
        /* Minimalist Modern Circle Badge (when circle style is active) */
        <g className="filter drop-shadow-lg">
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
          ) : (
            showNumbers && (
              <text
                x="0"
                y="5.5"
                textAnchor="middle"
                fontSize="14"
                fontWeight="900"
                fill={secondaryColor}
                className="font-sans select-none"
              >
                {number}
              </text>
            )
          )}
        </g>
      )}

      {/* 3. Role & Name Badges (Pill format below jersey) */}
      {(showRoles || showNames) && (
        <g transform="translate(0, 27)" className="pointer-events-none filter drop-shadow-md">
          {showRoles && showNames ? (
            <g>
              {/* Outer Pill Background */}
              <rect
                x={-tagHalf}
                y="0"
                width={totalTagWidth}
                height="19"
                rx="4"
                fill="#0b1120"
                stroke="#334155"
                strokeWidth="1"
                opacity="0.98"
              />
              {/* Left Role Segment */}
              <rect
                x={-tagHalf}
                y="0"
                width={roleWidth}
                height="19"
                rx="4"
                fill={roleBadgeBg}
              />
              {/* Role Text */}
              <text
                x={-tagHalf + roleWidth / 2}
                y="13.5"
                textAnchor="middle"
                fontSize="10"
                fontWeight="900"
                fill={roleBadgeText}
                className="font-mono tracking-tight"
              >
                {role}
              </text>
              {/* Player Name */}
              <text
                x={-tagHalf + roleWidth + (nameWidth / 2)}
                y="13.5"
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill="#ffffff"
                className="font-sans"
              >
                {displayName}
              </text>
            </g>
          ) : showRoles ? (
            <g>
              <rect x="-17" y="0" width="34" height="18" rx="4" fill={roleBadgeBg} stroke="#0f172a" strokeWidth="1" />
              <text
                x="0"
                y="13"
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="900"
                fill={roleBadgeText}
                className="font-mono"
              >
                {role}
              </text>
            </g>
          ) : (
            <g>
              <rect
                x={-nameWidth / 2}
                y="0"
                width={nameWidth}
                height="18"
                rx="4"
                fill="#0b1120"
                stroke="#334155"
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x="0"
                y="13"
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill="#ffffff"
                className="font-sans"
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
