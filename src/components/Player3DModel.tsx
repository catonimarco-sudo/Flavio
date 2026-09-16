import React from 'react';
import { PlacedPlayer } from '../types';

export interface Player3DModelProps {
  player: PlacedPlayer;
  primaryColor: string;
  secondaryColor: string;
  trimColor?: string;
  skinTone: string;
  hairColor: string;
  hasPhoto: boolean;
  photoUrl?: string;
  displayName: string;
  cleanLastName: string;
  contrastNumberColor: string;
  numberOutlineColor: string;
  showNumbers: boolean;
  showNames?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  rotation?: number;
}

export const Player3DModel: React.FC<Player3DModelProps> = ({
  player,
  primaryColor,
  secondaryColor,
  trimColor = '#ffffff',
  skinTone,
  hairColor,
  hasPhoto,
  photoUrl,
  cleanLastName,
  contrastNumberColor,
  numberOutlineColor,
  showNumbers,
  isSelected = false,
  isDragging = false,
  rotation = 0,
}) => {
  const { name = '', role = '', number = 10 } = player;

  // Normalize rotation angle 0..360
  const normRot = ((rotation % 360) + 360) % 360;

  // 8-Way Directional Perspective (Matching iMister.it isometric diagram angle):
  // 0: back (0° - North / Attacking top goal - view of back & squad number)
  // 1: back_right (45° - North-East 3/4 rear)
  // 2: right (90° - East running profile)
  // 3: front_right (135° - South-East 3/4 front)
  // 4: front (180° - South / Facing coach & camera)
  // 5: front_left (225° - South-West 3/4 front)
  // 6: left (270° - West running profile)
  // 7: back_left (315° - North-West 3/4 rear)
  const dirIndex = Math.round(normRot / 45) % 8;

  // Roles & Stances:
  const isGoalkeeper =
    role === 'POR' ||
    role === 'GK' ||
    role === 'Portiere' ||
    player.team === 'keeper';

  const isCoach =
    role === 'Mister' ||
    role === 'ALL' ||
    role === 'Allenatore' ||
    role === 'Coach' ||
    (player.notes || '').toLowerCase().includes('mister');

  const isReferee =
    player.team === 'referee' ||
    role === 'ARB' ||
    role === 'Arbitro';

  // Captain determination
  const isCaptain =
    role === 'DC' ||
    role === 'LIB' ||
    role === 'CC' ||
    (player.notes || '').includes('C');

  // Dynamic ground shadow angle based on pitch orientation
  const shadowAngleRad = (normRot * Math.PI) / 180;
  const shadowOffX = Math.sin(shadowAngleRad) * 3;
  const shadowOffY = Math.cos(shadowAngleRad) * 1.8;

  const pid = player.id;
  const torsoGradId = `p3d-torso-${pid}`;
  const shortsGradId = `p3d-shorts-${pid}`;
  const sockGradId = `p3d-sock-${pid}`;
  const headGradId = `p3d-head-${pid}`;
  const bootGradId = `p3d-boot-${pid}`;
  const gloveGradId = `p3d-glove-${pid}`;

  // Shorts color (if team is away and white, default to dark or secondary)
  const shortsBaseColor =
    player.secondaryColor ||
    (primaryColor === '#f8fafc' || primaryColor === '#ffffff' ? '#0f172a' : '#ffffff');

  // Goalkeeper kit accent (fluo yellow / neon green / orange)
  const keeperGloveColor = '#f8fafc';
  const keeperGloveAccent = '#38bdf8';

  return (
    <g className="player-3d-model select-none pointer-events-none">
      <defs>
        {/* Torso 3D Stadium Lighting Gradient */}
        <linearGradient id={torsoGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="25%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="75%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
        </linearGradient>

        {/* Shorts 3D Depth Gradient */}
        <linearGradient id={shortsGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="35%" stopColor={shortsBaseColor} stopOpacity="1" />
          <stop offset="80%" stopColor={shortsBaseColor} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>

        {/* Socks 3D Cylindrical Gradient */}
        <linearGradient id={sockGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="35%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="70%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>

        {/* Head 3D Specular Gradient */}
        <radialGradient id={headGradId} cx="42%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="55%" stopColor={skinTone} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </radialGradient>

        {/* Boots Glossy Synthetic Gradient */}
        <linearGradient id={bootGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" stopOpacity="1" />
          <stop offset="50%" stopColor="#0f172a" stopOpacity="1" />
          <stop offset="100%" stopColor="#020617" stopOpacity="1" />
        </linearGradient>

        {/* Goalkeeper Gloves Foam Gradient */}
        <linearGradient id={gloveGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="60%" stopColor="#e2e8f0" stopOpacity="1" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="1" />
        </linearGradient>

        {/* Torso Clip for custom uploaded jersey texture */}
        <clipPath id={`p3d-clip-torso-${pid}`}>
          <path d="M -15,-18 L 15,-18 L 11,2 L -11,2 Z" />
        </clipPath>
      </defs>

      {/* =========================================================
          1. 3D TURF CONTACT SHADOWS (Grass Level y = 38)
          ========================================================= */}
      <g className="turf-shadow">
        <ellipse
          cx={shadowOffX}
          cy={38 + shadowOffY}
          rx={isDragging ? 18 : isGoalkeeper ? 25 : 22}
          ry={isDragging ? 5 : 7}
          fill="#000000"
          opacity={isDragging ? 0.28 : 0.52}
          style={{ filter: 'blur(2.2px)' }}
        />
        {/* Foot contact occlusions */}
        {isGoalkeeper ? (
          <>
            <ellipse cx="-8.5" cy="38" rx="5" ry="2.2" fill="#000000" opacity="0.75" />
            <ellipse cx="8.5" cy="38" rx="5" ry="2.2" fill="#000000" opacity="0.75" />
          </>
        ) : (
          <>
            <ellipse cx="-5.5" cy="38" rx="4.8" ry="2" fill="#000000" opacity="0.75" />
            <ellipse cx="5.5" cy="38" rx="4.8" ry="2" fill="#000000" opacity="0.75" />
          </>
        )}
      </g>

      {/* =========================================================
          2. ATHLETE BODY WITH 3D PERSPECTIVE (Lifts when dragging)
          ========================================================= */}
      <g transform={isDragging ? 'translate(0, -6)' : undefined}>

        {/* =========================================================
            SPECIAL STANCE 1: GOALKEEPER (POR) - ICONIC READY POSITION
            Matching the yellow goalkeepers in iMister.it screenshot!
            ========================================================= */}
        {isGoalkeeper ? (
          dirIndex === 0 || dirIndex === 7 || dirIndex === 1 ? (
            /* Goalkeeper Facing North / Towards Opponent Half (Rear View) */
            <g className="gk-rear-ready">
              {/* Wide Stance Boots */}
              <ellipse cx="-9" cy="35" rx="4.2" ry="3.2" fill={`url(#${bootGradId})`} />
              <ellipse cx="9" cy="35" rx="4.2" ry="3.2" fill={`url(#${bootGradId})`} />
              <circle cx="-11" cy="37.5" r="0.9" fill="#94a3b8" />
              <circle cx="-7" cy="37.5" r="0.9" fill="#94a3b8" />
              <circle cx="7" cy="37.5" r="0.9" fill="#94a3b8" />
              <circle cx="11" cy="37.5" r="0.9" fill="#94a3b8" />

              {/* Wide Stance Socks & Calves */}
              <path d="M -12,20 L -6,20 L -7,33 L -11,33 Z" fill={`url(#${sockGradId})`} />
              <path d="M 6,20 L 12,20 L 11,33 L 7,33 Z" fill={`url(#${sockGradId})`} />
              <rect x="-12.2" y="19" width="6.4" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />
              <rect x="5.8" y="19" width="6.4" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

              {/* Thighs under shorts (bent knees) */}
              <rect x="-11" y="13" width="5.5" height="7" rx="2" fill={skinTone} />
              <rect x="5.5" y="13" width="5.5" height="7" rx="2" fill={skinTone} />

              {/* Goalkeeper Shorts (Dark athletic with padded side cuts) */}
              <path
                d="M -13,0 L 13,0 L 14,14 L 3,15 L 0,8 L -3,15 L -14,14 Z"
                fill={`url(#${shortsGradId})`}
                stroke="#000000"
                strokeWidth="0.6"
              />
              <rect x="-13" y="0" width="26" height="2.5" rx="0.8" fill={shortsBaseColor} opacity="0.9" />

              {/* Goalkeeper Torso (Rear with dorsal 1) */}
              <path
                d="M -17,-19 L 17,-19 L 12,2 L -12,2 Z"
                fill={`url(#${torsoGradId})`}
                stroke="#000000"
                strokeWidth="0.5"
              />
              {/* Squad number 1 on back */}
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                fontSize="14"
                fontWeight="900"
                fill={contrastNumberColor}
                stroke={numberOutlineColor}
                strokeWidth="2.8"
                style={{ paintOrder: 'stroke fill' }}
                className="font-sans font-black"
              >
                {number}
              </text>
              <text
                x="0"
                y="-13.5"
                textAnchor="middle"
                fontSize="3.8"
                fontWeight="900"
                fill="#ffffff"
                stroke="#000000"
                strokeWidth="0.4"
                letterSpacing="0.08em"
                className="font-sans uppercase font-black"
              >
                {cleanLastName}
              </text>

              {/* Arms spread wide with Goalkeeper Gloves (Rear view) */}
              {/* Left Arm & Glove */}
              <g>
                <path d="M -14,-18 L -23,-9 L -20,-7 L -12,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M -23,-9 L -26,-1 L -23,0 L -20,-7 Z" fill={skinTone} />
                {/* Glove Wrist Wrap */}
                <rect x="-27.5" y="-3" width="5.5" height="3" rx="0.8" fill={keeperGloveAccent} />
                {/* Glove Backhand with Punch Zone */}
                <ellipse cx="-26" cy="1" rx="4.5" ry="3.8" fill={`url(#${gloveGradId})`} stroke="#0f172a" strokeWidth="0.5" />
                <path d="M -28,0 L -24,0" stroke={keeperGloveAccent} strokeWidth="1.2" strokeLinecap="round" />
              </g>

              {/* Right Arm & Glove */}
              <g>
                <path d="M 14,-18 L 23,-9 L 20,-7 L 12,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 23,-9 L 26,-1 L 23,0 L 20,-7 Z" fill={skinTone} />
                <rect x="22" y="-3" width="5.5" height="3" rx="0.8" fill={keeperGloveAccent} />
                <ellipse cx="26" cy="1" rx="4.5" ry="3.8" fill={`url(#${gloveGradId})`} stroke="#0f172a" strokeWidth="0.5" />
                <path d="M 24,0 L 28,0" stroke={keeperGloveAccent} strokeWidth="1.2" strokeLinecap="round" />
              </g>

              {/* Head from rear */}
              <g transform="translate(0, -26)">
                <ellipse cx="0" cy="0" rx="6.5" ry="7.5" fill={hairColor} />
                <path d="M -3.5,3 L -4,7 L 4,7 L 3.5,3 Z" fill={skinTone} />
              </g>
            </g>
          ) : (
            /* Goalkeeper Facing Forward / Camera / Pitch (Front Ready Stance) */
            <g className="gk-front-ready">
              {/* Wide Boots */}
              <g>
                <path d="M -13,32 C -13,30 -10,29 -8,29 C -6,29 -5,31 -5,34 L -5,37 C -6,38.5 -11,38.5 -13,37 Z" fill={`url(#${bootGradId})`} />
                <path d="M -12,34 Q -9,32 -6,35" stroke={secondaryColor} strokeWidth="1.2" fill="none" />
                <circle cx="-11" cy="37.8" r="0.9" fill="#94a3b8" />
                <circle cx="-7" cy="37.8" r="0.9" fill="#94a3b8" />
              </g>
              <g>
                <path d="M 5,34 C 5,31 6,29 8,29 C 10,29 13,30 13,32 L 13,37 C 11,38.5 6,38.5 5,37 Z" fill={`url(#${bootGradId})`} />
                <path d="M 6,35 Q 9,32 12,34" stroke={secondaryColor} strokeWidth="1.2" fill="none" />
                <circle cx="7" cy="37.8" r="0.9" fill="#94a3b8" />
                <circle cx="11" cy="37.8" r="0.9" fill="#94a3b8" />
              </g>

              {/* Socks & Calves */}
              <path d="M -12,19 L -6,19 L -6,31 L -12,31 Z" fill={`url(#${sockGradId})`} />
              <path d="M 6,19 L 12,19 L 12,31 L 6,31 Z" fill={`url(#${sockGradId})`} />
              <rect x="-12.2" y="18" width="6.4" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />
              <rect x="5.8" y="18" width="6.4" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

              {/* Knees flexed */}
              <rect x="-11" y="13" width="5.5" height="6.5" rx="2" fill={skinTone} />
              <rect x="5.5" y="13" width="5.5" height="6.5" rx="2" fill={skinTone} />

              {/* Goalkeeper Shorts */}
              <path
                d="M -13,0 L 13,0 L 14,14 L 3,15 L 0,6 L -3,15 L -14,14 Z"
                fill={`url(#${shortsGradId})`}
                stroke="#000000"
                strokeWidth="0.6"
              />
              <rect x="-13" y="0" width="26" height="2.5" rx="0.8" fill={shortsBaseColor} opacity="0.9" />

              {/* Goalkeeper Jersey Torso */}
              <path
                d="M -17,-19 L 17,-19 L 12,2 L -12,2 Z"
                fill={`url(#${torsoGradId})`}
                stroke="#000000"
                strokeWidth="0.5"
              />
              {/* Chest Badge & Number */}
              <ellipse cx="0" cy="-19" rx="5.5" ry="1.8" fill="#0b0f19" opacity="0.8" />
              <path d="M -5.5,-19 Q 0,-14.5 5.5,-19" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" fill="none" />
              <g transform="translate(-7, -12) scale(0.85)">
                <path d="M -2.8,-2.5 L 2.8,-2.5 L 2.8,1.5 C 2.8,3.5 0,5 0,5 C 0,5 -2.8,3.5 -2.8,1.5 Z" fill={secondaryColor} stroke="#0f172a" strokeWidth="0.6" />
              </g>
              <text x="0" y="-7" textAnchor="middle" fontSize="6.5" fontWeight="900" fill={secondaryColor} className="font-sans font-black">
                {number}
              </text>

              {/* Goalkeeper Arms with Padded Latex Gloves (Palms Facing Forward!) */}
              {/* Left Arm & Glove */}
              <g>
                <path d="M -14,-18 L -23,-9 L -20,-7 L -12,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M -23,-9 L -26,-1 L -23,0 L -20,-7 Z" fill={skinTone} />
                <rect x="-27.5" y="-3" width="5.5" height="3" rx="0.8" fill={keeperGloveAccent} />
                {/* Open Latex Palm with Grip lines */}
                <ellipse cx="-26" cy="1" rx="4.8" ry="4.2" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.6" />
                <path d="M -27,-1 L -25,-1 M -28,1 L -24,1 M -27,3 L -25,3" stroke="#cbd5e1" strokeWidth="0.8" />
              </g>

              {/* Right Arm & Glove */}
              <g>
                <path d="M 14,-18 L 23,-9 L 20,-7 L 12,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 23,-9 L 26,-1 L 23,0 L 20,-7 Z" fill={skinTone} />
                <rect x="22" y="-3" width="5.5" height="3" rx="0.8" fill={keeperGloveAccent} />
                <ellipse cx="26" cy="1" rx="4.8" ry="4.2" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.6" />
                <path d="M 25,-1 L 27,-1 M 24,1 L 28,1 M 25,3 L 27,3" stroke="#cbd5e1" strokeWidth="0.8" />
              </g>

              {/* Goalkeeper Head */}
              <g transform="translate(0, -26)">
                {hasPhoto && photoUrl ? (
                  <g>
                    <clipPath id={`p3d-clip-gk-${pid}`}>
                      <circle cx="0" cy="0" r="10.5" />
                    </clipPath>
                    <circle cx="0" cy="0" r="11.5" fill="#0b1120" stroke={isSelected ? '#38bdf8' : '#ffffff'} strokeWidth="1.5" />
                    <image href={photoUrl} x="-11" y="-11" width="22" height="22" preserveAspectRatio="xMidYMid slice" clipPath={`url(#p3d-clip-gk-${pid})`} />
                  </g>
                ) : (
                  <g>
                    <path d="M -3.5,3 L -4,7 L 4,7 L 3.5,3 Z" fill={skinTone} />
                    <ellipse cx="-6.5" cy="0" rx="1.4" ry="2.2" fill={skinTone} />
                    <ellipse cx="6.5" cy="0" rx="1.4" ry="2.2" fill={skinTone} />
                    <path
                      d="M 0,-7.5 C 4.5,-7.5 6.5,-4 6.5,0.5 C 6.5,4.5 4.2,7.5 0,8.2 C -4.2,7.5 -6.5,4.5 -6.5,0.5 C -6.5,-4 -4.5,-7.5 0,-7.5 Z"
                      fill={`url(#${headGradId})`}
                    />
                    <path d="M -4.5,-2 Q -2.8,-3 -1,-2" stroke={hairColor} strokeWidth="0.9" fill="none" />
                    <path d="M 1,-2 Q 2.8,-3 4.5,-2" stroke={hairColor} strokeWidth="0.9" fill="none" />
                    <ellipse cx="-2.8" cy="-0.2" rx="1.1" ry="0.8" fill="#ffffff" />
                    <circle cx="-2.7" cy="-0.2" r="0.6" fill="#1c1917" />
                    <ellipse cx="2.8" cy="-0.2" rx="1.1" ry="0.8" fill="#ffffff" />
                    <circle cx="2.7" cy="-0.2" r="0.6" fill="#1c1917" />
                    <path d="M -1.6,3.6 Q 0,4.5 1.6,3.6" stroke="#993d3d" strokeWidth="0.8" fill="none" />
                    {/* Hair */}
                    <path d="M -6.5,-1 C -6.5,-6 -2.5,-8 0,-8 C 2.5,-8 6.5,-6 6.5,-1 C 5.5,-4 3.5,-5.5 0,-5.5 C -3.5,-5.5 -5.5,-4 -6.5,-1 Z" fill={hairColor} />
                  </g>
                )}
              </g>
            </g>
          )
        ) : isCoach || isReferee ? (
          /* =========================================================
             SPECIAL STANCE 2: COACH / MISTER / REFEREE (ALL BLACK KIT)
             Standing on sideline overseeing the tactical drill!
             ========================================================= */
          <g className="coach-mister-stance">
            {/* Trainers / Black Shoes with White Soles */}
            <g>
              <ellipse cx="-5" cy="35" rx="4" ry="2.5" fill="#0f172a" />
              <rect x="-8.5" y="36.2" width="7" height="1.8" rx="0.6" fill="#ffffff" />
              <ellipse cx="5" cy="35" rx="4" ry="2.5" fill="#0f172a" />
              <rect x="1.5" y="36.2" width="7" height="1.8" rx="0.6" fill="#ffffff" />
            </g>

            {/* Dark Tracksuit Pants / Legs */}
            <path d="M -8,12 L -3,12 L -2.5,35 L -7.5,35 Z" fill="#0f172a" />
            <path d="M 3,12 L 8,12 L 7.5,35 L 2.5,35 Z" fill="#0f172a" />
            {/* White side piping on coach trousers */}
            <line x1="-8" y1="13" x2="-7.5" y2="35" stroke="#475569" strokeWidth="1" />
            <line x1="8" y1="13" x2="7.5" y2="35" stroke="#475569" strokeWidth="1" />

            {/* Coach Waist & Belt */}
            <rect x="-9" y="9" width="18" height="4" rx="1" fill="#020617" />

            {/* Coach Polo / Tracksuit Top */}
            <path d="M -14,-19 L 14,-19 L 9,10 L -9,10 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="0.8" />
            {/* Polo Collar */}
            <path d="M -6,-19 L 0,-13 L 6,-19 Z" fill="#1e293b" />
            <line x1="0" y1="-13" x2="0" y2="-7" stroke="#ffffff" strokeWidth="0.8" />

            {/* Coach Whistle & Lanyard */}
            <path d="M -4,-18 Q 0,-8 0,-6" stroke="#facc15" strokeWidth="1" fill="none" />
            <path d="M 4,-18 Q 0,-8 0,-6" stroke="#facc15" strokeWidth="1" fill="none" />
            <circle cx="0" cy="-5" r="1.5" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.5" />

            {/* Tactical Notepad / Clipboard in Left Hand */}
            <g transform="translate(-14, 0) rotate(15)">
              <rect x="-4" y="-7" width="8" height="12" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="0.6" />
              <rect x="-3" y="-5" width="6" height="9" fill="#ffffff" />
              <line x1="-2" y1="-3" x2="2" y2="-3" stroke="#2563eb" strokeWidth="0.6" />
              <line x1="-2" y1="-1" x2="2" y2="-1" stroke="#2563eb" strokeWidth="0.6" />
              <line x1="-2" y1="1" x2="1" y2="1" stroke="#2563eb" strokeWidth="0.6" />
              <rect x="-1.5" y="-7.5" width="3" height="1.5" rx="0.5" fill="#cbd5e1" />
            </g>

            {/* Arms at sides */}
            <path d="M -14,-18 L -17,-6 L -14,-5 L -12,-16 Z" fill="#0f172a" />
            <ellipse cx="-13" cy="2" rx="1.8" ry="2" fill={skinTone} />
            <path d="M 14,-18 L 17,-6 L 14,-5 L 12,-16 Z" fill="#0f172a" />
            <ellipse cx="16" cy="0" rx="1.8" ry="2" fill={skinTone} />

            {/* Head */}
            <g transform="translate(0, -26)">
              <path d="M -3.5,3 L -4,7 L 4,7 L 3.5,3 Z" fill={skinTone} />
              <ellipse cx="-6.5" cy="0" rx="1.4" ry="2.2" fill={skinTone} />
              <ellipse cx="6.5" cy="0" rx="1.4" ry="2.2" fill={skinTone} />
              <path
                d="M 0,-7.5 C 4.5,-7.5 6.5,-4 6.5,0.5 C 6.5,4.5 4.2,7.5 0,8.2 C -4.2,7.5 -6.5,4.5 -6.5,0.5 C -6.5,-4 -4.5,-7.5 0,-7.5 Z"
                fill={`url(#${headGradId})`}
              />
              <ellipse cx="-2.8" cy="-0.2" rx="1.1" ry="0.8" fill="#ffffff" />
              <circle cx="-2.7" cy="-0.2" r="0.6" fill="#1c1917" />
              <ellipse cx="2.8" cy="-0.2" rx="1.1" ry="0.8" fill="#ffffff" />
              <circle cx="2.7" cy="-0.2" r="0.6" fill="#1c1917" />
              <path d="M -1.6,3.6 Q 0,4.5 1.6,3.6" stroke="#993d3d" strokeWidth="0.8" fill="none" />
              {/* Short Coach Haircut */}
              <path d="M -6.5,-1 C -6.5,-6 -2.5,-8 0,-8 C 2.5,-8 6.5,-6 6.5,-1 C 5.5,-4 3.5,-5.5 0,-5.5 C -3.5,-5.5 -5.5,-4 -6.5,-1 Z" fill={hairColor} />
            </g>
          </g>
        ) : (
          /* =========================================================
             OUTFIELD ATHLETES (8-WAY ISOMETRIC DIRECTIONS)
             ========================================================= */
          <>
            {/* --- DIRECTION 0: BACK (Attacking North / 0°) --- */}
            {dirIndex === 0 && (
              <g className="p3d-back">
                {/* Boots */}
                <g>
                  <ellipse cx="-6" cy="34" rx="3.8" ry="3.5" fill={`url(#${bootGradId})`} />
                  <rect x="-7.8" y="33" width="3.6" height="4" rx="1" fill="#475569" />
                  <circle cx="-7.5" cy="37.8" r="0.9" fill="#94a3b8" />
                  <circle cx="-4.5" cy="37.8" r="0.9" fill="#94a3b8" />
                </g>
                <g>
                  <ellipse cx="6" cy="34" rx="3.8" ry="3.5" fill={`url(#${bootGradId})`} />
                  <rect x="4.2" y="33" width="3.6" height="4" rx="1" fill="#475569" />
                  <circle cx="4.5" cy="37.8" r="0.9" fill="#94a3b8" />
                  <circle cx="7.5" cy="37.8" r="0.9" fill="#94a3b8" />
                </g>

                {/* Socks & Calves */}
                <path d="M -9,18 L -3,18 L -3.5,31 L -8.5,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="-9.2" y="17" width="6.4" height="3" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />
                <path d="M 3,18 L 9,18 L 8.5,31 L 3.5,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="2.8" y="17" width="6.4" height="3" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

                {/* Thighs */}
                <rect x="-8" y="12" width="4.5" height="6" fill={skinTone} />
                <rect x="3.5" y="12" width="4.5" height="6" fill={skinTone} />

                {/* Shorts */}
                <path
                  d="M -11,0 L 11,0 L 12,14 L 3,15 L 0,8 L -3,15 L -12,14 Z"
                  fill={`url(#${shortsGradId})`}
                  stroke="#000000"
                  strokeWidth="0.6"
                />
                <rect x="-11" y="0" width="22" height="2.5" rx="0.8" fill={shortsBaseColor} opacity="0.9" />

                {/* Torso & Jersey with Large Squad Number & Name */}
                <path
                  d="M -16,-19 L 16,-19 L 11,2 L -11,2 Z"
                  fill={`url(#${torsoGradId})`}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
                <ellipse cx="0" cy="-19" rx="5.5" ry="1.8" fill="#0b0f19" opacity="0.9" />
                <path d="M -5.5,-19 Q 0,-21 5.5,-19" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" fill="none" />

                <text
                  x="0"
                  y="-13.5"
                  textAnchor="middle"
                  fontSize="4"
                  fontWeight="900"
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth="0.4"
                  letterSpacing="0.08em"
                  className="font-sans uppercase font-black"
                >
                  {cleanLastName}
                </text>

                <text
                  x="0"
                  y="-0.5"
                  textAnchor="middle"
                  fontSize={number > 99 ? '12.5' : '15'}
                  fontWeight="900"
                  fill={contrastNumberColor}
                  stroke={numberOutlineColor}
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ paintOrder: 'stroke fill', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))' }}
                  className="font-sans font-black tracking-tight"
                >
                  {number}
                </text>

                {/* Arms */}
                <g>
                  <path d="M -13,-19 L -16,-19 L -21,-11 L -17,-9 Z" fill={`url(#${torsoGradId})`} />
                  {isCaptain && <rect x="-21" y="-8.5" width="4.5" height="3" rx="0.5" fill="#facc15" stroke="#000000" strokeWidth="0.4" />}
                  <path d="M -17,-9 L -19,-9 L -20,3 L -17.5,4 Z" fill={skinTone} />
                  <ellipse cx="-18.8" cy="5.2" rx="1.8" ry="2.2" fill={skinTone} />
                </g>
                <g>
                  <path d="M 16,-19 L 13,-19 L 17,-9 L 21,-11 Z" fill={`url(#${torsoGradId})`} />
                  <path d="M 19,-9 L 17,-9 L 17.5,4 L 20,3 Z" fill={skinTone} />
                  <ellipse cx="18.8" cy="5.2" rx="1.8" ry="2.2" fill={skinTone} />
                </g>

                {/* Head (Rear) */}
                <g transform="translate(0, -26)">
                  <path d="M -3.5,3 L -4,7 L 4,7 L 3.5,3 Z" fill={skinTone} />
                  <ellipse cx="-6.4" cy="0" rx="1.2" ry="2" fill={skinTone} />
                  <ellipse cx="6.4" cy="0" rx="1.2" ry="2" fill={skinTone} />
                  <path
                    d="M 0,-8 C 4.5,-8 6.8,-4.5 6.8,0 C 6.8,3.5 4.5,5.5 0,5.5 C -4.5,5.5 -6.8,3.5 -6.8,0 C -6.8,-4.5 -4.5,-8 0,-8 Z"
                    fill={hairColor}
                  />
                  <path d="M -4,-5 Q 0,-6.5 4,-5" stroke="#ffffff" strokeWidth="0.8" opacity="0.35" fill="none" />
                </g>
              </g>
            )}

            {/* --- DIRECTION 1: BACK-RIGHT (Attacking North-East / 45°) --- */}
            {dirIndex === 1 && (
              <g className="p3d-back-right">
                {/* Left Trailing Boot */}
                <ellipse cx="-8" cy="33" rx="4" ry="3" fill={`url(#${bootGradId})`} />
                <path d="M -10,18 L -5,18 L -6,31 L -10,31 Z" fill={`url(#${sockGradId})`} />
                {/* Right Leading Boot */}
                <path d="M 3,31 L 9,29 L 13,34 L 11,37 L 3,37 Z" fill={`url(#${bootGradId})`} />
                <path d="M 4,18 L 9,18 L 10,31 L 5,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="3.8" y="17" width="6" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

                {/* Shorts angled 45° */}
                <path d="M -9,0 L 10,0 L 12,14 L -6,14 Z" fill={`url(#${shortsGradId})`} />
                <rect x="-9" y="0" width="19" height="2.5" rx="0.8" fill={shortsBaseColor} />

                {/* Torso angled 45° */}
                <path d="M -13,-19 L 14,-19 L 10,2 L -8,2 Z" fill={`url(#${torsoGradId})`} />
                {/* Number angled */}
                <text
                  x="2"
                  y="-0.5"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="900"
                  fill={contrastNumberColor}
                  stroke={numberOutlineColor}
                  strokeWidth="2.5"
                  style={{ paintOrder: 'stroke fill' }}
                  className="font-sans font-black"
                >
                  {number}
                </text>
                <text x="1" y="-12.5" textAnchor="middle" fontSize="3.6" fontWeight="900" fill="#ffffff">
                  {cleanLastName}
                </text>

                {/* Arms pumping in stride */}
                <path d="M -12,-18 L -18,-9 L -15,-8 L -10,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M -18,-9 L -18,2 L -15,1 Z" fill={skinTone} />
                <path d="M 12,-18 L 17,-9 L 14,-8 L 10,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 17,-9 L 20,-1 L 17,0 Z" fill={skinTone} />

                {/* Head 3/4 rear */}
                <g transform="translate(2, -26)">
                  <path d="M -2,3 L 2,3 L 1,7 L -3,7 Z" fill={skinTone} />
                  <ellipse cx="0" cy="0" rx="6.5" ry="7.5" fill={hairColor} />
                  <ellipse cx="6" cy="1" rx="1.2" ry="1.8" fill={skinTone} />
                </g>
              </g>
            )}

            {/* --- DIRECTION 2: RIGHT PROFILE (Running East / 90°) --- */}
            {dirIndex === 2 && (
              <g className="p3d-right">
                {/* Trailing Left Boot */}
                <path d="M -11,33 L -5,31 L -3,35 L -9,37 Z" fill={`url(#${bootGradId})`} />
                <circle cx="-10" cy="37.5" r="0.9" fill="#94a3b8" />
                <path d="M -9,18 L -4,17 L -4,31 L -9,32 Z" fill={`url(#${sockGradId})`} />

                {/* Leading Right Boot */}
                <path d="M 2,32 L 8,30 L 13,34 L 11,37 L 3,37 Z" fill={`url(#${bootGradId})`} />
                <path d="M 4,33 Q 7,32 10,34" stroke={secondaryColor} strokeWidth="1.2" fill="none" />
                <circle cx="5" cy="37.5" r="0.9" fill="#94a3b8" />
                <circle cx="11" cy="37.5" r="0.9" fill="#94a3b8" />

                {/* Leading Right Leg */}
                <path d="M 3,18 L 8,18 L 8.5,31 L 3.5,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="2.8" y="17" width="5.8" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

                {/* Shorts Profile */}
                <path d="M -7,0 L 7,0 L 9,14 L -8,14 Z" fill={`url(#${shortsGradId})`} />
                <path d="M 0,0 L 0,14" stroke={primaryColor} strokeWidth="2" />

                {/* Torso Profile */}
                <path d="M -9,-19 L 9,-19 L 7,1 L -7,1 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 0,-18 L 0,1" stroke="#000000" strokeWidth="1.8" strokeOpacity="0.3" />
                <rect x="4" y="-14" width="3" height="4" rx="1" fill={secondaryColor} />

                {/* Right Arm (Bent Forward in Athletic Ready Stance) */}
                <path d="M 3,-17 L 7,-17 L 12,-7 L 9,-5 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 11,-6 L 15,2 L 12,3 L 8,-4 Z" fill={skinTone} />
                <ellipse cx="15.5" cy="3.5" rx="1.8" ry="2" fill={skinTone} />

                {/* Head Profile */}
                <g transform="translate(0, -26)">
                  <ellipse cx="0" cy="0" rx="5.5" ry="7" fill={`url(#${headGradId})`} />
                  <path d="M 4,-2 L 7,0 L 4,1.5" fill={skinTone} stroke="#000000" strokeWidth="0.4" />
                  <path d="M -5.5,-1 C -5.5,-6 0,-7.8 4,-7.8 C 6,-7.8 7,-6 7,-3 C 5,-4.5 2,-5 -2,-5 C -4,-5 -5.5,-3.5 -5.5,-1 Z" fill={hairColor} />
                  <ellipse cx="-0.5" cy="0.5" rx="1.4" ry="2" fill={skinTone} />
                </g>
              </g>
            )}

            {/* --- DIRECTION 3: FRONT-RIGHT (Facing South-East / 135°) --- */}
            {dirIndex === 3 && (
              <g className="p3d-front-right">
                {/* Boots */}
                <path d="M -8,33 C -8,31 -5,30 -3,30 L -1,37 L -8,37 Z" fill={`url(#${bootGradId})`} />
                <path d="M 3,33 C 3,30 6,29 9,30 L 13,34 L 11,37 L 3,37 Z" fill={`url(#${bootGradId})`} />
                <circle cx="5" cy="37.5" r="0.9" fill="#94a3b8" />
                <circle cx="10" cy="37.5" r="0.9" fill="#94a3b8" />

                {/* Legs */}
                <path d="M -8,18 L -3,18 L -3,31 L -8,31 Z" fill={`url(#${sockGradId})`} />
                <path d="M 4,18 L 9,18 L 9.5,31 L 4.5,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="3.8" y="17" width="5.8" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

                {/* Shorts 3/4 front */}
                <path d="M -9,0 L 10,0 L 11,14 L -7,14 Z" fill={`url(#${shortsGradId})`} />
                <rect x="-9" y="0" width="19" height="2.5" rx="0.8" fill={shortsBaseColor} />

                {/* Torso with Crest & Sponsor */}
                <path d="M -13,-19 L 14,-19 L 10,2 L -8,2 Z" fill={`url(#${torsoGradId})`} />
                <ellipse cx="2" cy="-19" rx="5" ry="1.8" fill="#0b0f19" opacity="0.8" />
                <g transform="translate(4, -13) scale(0.85)">
                  <path d="M -2.8,-2.5 L 2.8,-2.5 L 2.8,1.5 C 2.8,3.5 0,5 0,5 C 0,5 -2.8,3.5 -2.8,1.5 Z" fill={secondaryColor} stroke="#0f172a" strokeWidth="0.6" />
                </g>

                {/* Arms */}
                <path d="M -12,-18 L -17,-9 L -14,-8 L -10,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M -17,-9 L -18,2 L -15,1 Z" fill={skinTone} />
                <path d="M 12,-18 L 17,-9 L 14,-8 L 10,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 17,-9 L 20,-1 L 17,0 Z" fill={skinTone} />

                {/* Head 3/4 front */}
                <g transform="translate(1, -26)">
                  <path d="M -2,3 L 2,3 L 1,7 L -3,7 Z" fill={skinTone} />
                  <ellipse cx="0" cy="0" rx="6" ry="7.5" fill={`url(#${headGradId})`} />
                  <ellipse cx="2" cy="-0.2" rx="1.1" ry="0.8" fill="#ffffff" />
                  <circle cx="2" cy="-0.2" r="0.6" fill="#1c1917" />
                  <path d="M -5.5,-1 C -5.5,-6 -1,-8 3,-8 C 6,-8 6.5,-5 6.5,-2 C 4,-4 1,-5 -2,-5 C -4,-5 -5.5,-3.5 -5.5,-1 Z" fill={hairColor} />
                </g>
              </g>
            )}

            {/* --- DIRECTION 4: FRONT (Facing South / 180° - Camera/Coach) --- */}
            {dirIndex === 4 && (
              <g className="p3d-front">
                {/* Boots */}
                <g>
                  <path d="M -10,32 C -10,30 -7,29 -5,29 C -3,29 -2,31 -2,34 L -2,37 C -3,38.5 -8,38.5 -10,37 Z" fill={`url(#${bootGradId})`} />
                  <path d="M -9,34 Q -6,32 -3,35" stroke={secondaryColor} strokeWidth="1.2" fill="none" />
                  <circle cx="-8.5" cy="37.8" r="0.9" fill="#94a3b8" />
                  <circle cx="-4" cy="37.8" r="0.9" fill="#94a3b8" />
                </g>
                <g>
                  <path d="M 2,34 C 2,31 3,29 5,29 C 7,29 10,30 10,32 L 10,37 C 8,38.5 3,38.5 2,37 Z" fill={`url(#${bootGradId})`} />
                  <path d="M 3,35 Q 6,32 9,34" stroke={secondaryColor} strokeWidth="1.2" fill="none" />
                  <circle cx="4" cy="37.8" r="0.9" fill="#94a3b8" />
                  <circle cx="8.5" cy="37.8" r="0.9" fill="#94a3b8" />
                </g>

                {/* Socks & Calves */}
                <path d="M -9,18 L -3,18 L -3,31 L -9,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="-9.2" y="17" width="6.4" height="3" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />
                <path d="M 3,18 L 9,18 L 9,31 L 3,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="2.8" y="17" width="6.4" height="3" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

                {/* Knees & Thighs */}
                <rect x="-8.5" y="12" width="5.2" height="6.5" rx="2" fill={skinTone} />
                <rect x="3.3" y="12" width="5.2" height="6.5" rx="2" fill={skinTone} />

                {/* Shorts */}
                <path
                  d="M -11,0 L 11,0 L 12,14 L 3,15 L 0,6 L -3,15 L -12,14 Z"
                  fill={`url(#${shortsGradId})`}
                  stroke="#000000"
                  strokeWidth="0.6"
                />
                <rect x="-11" y="0" width="22" height="2.5" rx="0.8" fill={shortsBaseColor} opacity="0.9" />

                {/* Torso Front View */}
                <path
                  d="M -16,-19 L 16,-19 L 11,2 L -11,2 Z"
                  fill={`url(#${torsoGradId})`}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
                <ellipse cx="0" cy="-19" rx="5.5" ry="1.8" fill="#0b0f19" opacity="0.8" />
                <path d="M -5.5,-19 Q 0,-14.5 5.5,-19" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" fill="none" />

                {/* Crest */}
                <g transform="translate(-7, -12) scale(0.9)">
                  <path d="M -2.8,-2.5 L 2.8,-2.5 L 2.8,1.5 C 2.8,3.5 0,5 0,5 C 0,5 -2.8,3.5 -2.8,1.5 Z" fill={secondaryColor} stroke="#0f172a" strokeWidth="0.6" />
                </g>

                {/* Arms */}
                <g>
                  <path d="M -16,-19 L -13,-19 L -17,-9 L -21,-11 Z" fill={`url(#${torsoGradId})`} />
                  <path d="M -19,-9 L -17,-9 L -17.5,4 L -20,3 Z" fill={skinTone} />
                  <ellipse cx="-18.8" cy="5.2" rx="1.8" ry="2.2" fill={skinTone} />
                </g>
                <g>
                  <path d="M 13,-19 L 16,-19 L 21,-11 L 17,-9 Z" fill={`url(#${torsoGradId})`} />
                  <path d="M 17,-9 L 19,-9 L 20,3 L 17.5,4 Z" fill={skinTone} />
                  <ellipse cx="18.8" cy="5.2" rx="1.8" ry="2.2" fill={skinTone} />
                </g>

                {/* Head */}
                <g transform="translate(0, -26)">
                  <path d="M -3.5,3 L -4,7 L 4,7 L 3.5,3 Z" fill={skinTone} />
                  <ellipse cx="-6.5" cy="0" rx="1.4" ry="2.2" fill={skinTone} />
                  <ellipse cx="6.5" cy="0" rx="1.4" ry="2.2" fill={skinTone} />
                  <path
                    d="M 0,-7.5 C 4.5,-7.5 6.5,-4 6.5,0.5 C 6.5,4.5 4.2,7.5 0,8.2 C -4.2,7.5 -6.5,4.5 -6.5,0.5 C -6.5,-4 -4.5,-7.5 0,-7.5 Z"
                    fill={`url(#${headGradId})`}
                  />
                  <ellipse cx="-2.8" cy="-0.2" rx="1.1" ry="0.8" fill="#ffffff" />
                  <circle cx="-2.7" cy="-0.2" r="0.6" fill="#1c1917" />
                  <ellipse cx="2.8" cy="-0.2" rx="1.1" ry="0.8" fill="#ffffff" />
                  <circle cx="2.7" cy="-0.2" r="0.6" fill="#1c1917" />
                  <path d="M -1.6,3.6 Q 0,4.5 1.6,3.6" stroke="#993d3d" strokeWidth="0.8" fill="none" />
                  <path d="M -6.5,-1.5 C -6.5,-6 -2.5,-8 0,-8 C 2.5,-8 6.5,-6 6.5,-1.5 C 5.5,-4 3.5,-5.5 0,-5.5 C -3.5,-5.5 -5.5,-4 -6.5,-1.5 Z" fill={hairColor} />
                </g>
              </g>
            )}

            {/* --- DIRECTION 5: FRONT-LEFT (Facing South-West / 225°) --- */}
            {dirIndex === 5 && (
              <g className="p3d-front-left" transform="scale(-1, 1)">
                {/* Mirrored from Front-Right */}
                <path d="M -8,33 C -8,31 -5,30 -3,30 L -1,37 L -8,37 Z" fill={`url(#${bootGradId})`} />
                <path d="M 3,33 C 3,30 6,29 9,30 L 13,34 L 11,37 L 3,37 Z" fill={`url(#${bootGradId})`} />
                <circle cx="5" cy="37.5" r="0.9" fill="#94a3b8" />
                <circle cx="10" cy="37.5" r="0.9" fill="#94a3b8" />

                <path d="M -8,18 L -3,18 L -3,31 L -8,31 Z" fill={`url(#${sockGradId})`} />
                <path d="M 4,18 L 9,18 L 9.5,31 L 4.5,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="3.8" y="17" width="5.8" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

                <path d="M -9,0 L 10,0 L 11,14 L -7,14 Z" fill={`url(#${shortsGradId})`} />
                <rect x="-9" y="0" width="19" height="2.5" rx="0.8" fill={shortsBaseColor} />

                <path d="M -13,-19 L 14,-19 L 10,2 L -8,2 Z" fill={`url(#${torsoGradId})`} />
                <ellipse cx="2" cy="-19" rx="5" ry="1.8" fill="#0b0f19" opacity="0.8" />
                <g transform="translate(4, -13) scale(0.85)">
                  <path d="M -2.8,-2.5 L 2.8,-2.5 L 2.8,1.5 C 2.8,3.5 0,5 0,5 C 0,5 -2.8,3.5 -2.8,1.5 Z" fill={secondaryColor} stroke="#0f172a" strokeWidth="0.6" />
                </g>

                <path d="M -12,-18 L -17,-9 L -14,-8 L -10,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M -17,-9 L -18,2 L -15,1 Z" fill={skinTone} />
                <path d="M 12,-18 L 17,-9 L 14,-8 L 10,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 17,-9 L 20,-1 L 17,0 Z" fill={skinTone} />

                <g transform="translate(1, -26)">
                  <path d="M -2,3 L 2,3 L 1,7 L -3,7 Z" fill={skinTone} />
                  <ellipse cx="0" cy="0" rx="6" ry="7.5" fill={`url(#${headGradId})`} />
                  <ellipse cx="2" cy="-0.2" rx="1.1" ry="0.8" fill="#ffffff" />
                  <circle cx="2" cy="-0.2" r="0.6" fill="#1c1917" />
                  <path d="M -5.5,-1 C -5.5,-6 -1,-8 3,-8 C 6,-8 6.5,-5 6.5,-2 C 4,-4 1,-5 -2,-5 C -4,-5 -5.5,-3.5 -5.5,-1 Z" fill={hairColor} />
                </g>
              </g>
            )}

            {/* --- DIRECTION 6: LEFT PROFILE (Running West / 270°) --- */}
            {dirIndex === 6 && (
              <g className="p3d-left" transform="scale(-1, 1)">
                {/* Trailing Boot */}
                <path d="M -11,33 L -5,31 L -3,35 L -9,37 Z" fill={`url(#${bootGradId})`} />
                <circle cx="-10" cy="37.5" r="0.9" fill="#94a3b8" />
                <path d="M -9,18 L -4,17 L -4,31 L -9,32 Z" fill={`url(#${sockGradId})`} />

                {/* Leading Boot */}
                <path d="M 2,32 L 8,30 L 13,34 L 11,37 L 3,37 Z" fill={`url(#${bootGradId})`} />
                <path d="M 4,33 Q 7,32 10,34" stroke={secondaryColor} strokeWidth="1.2" fill="none" />
                <circle cx="5" cy="37.5" r="0.9" fill="#94a3b8" />
                <circle cx="11" cy="37.5" r="0.9" fill="#94a3b8" />

                {/* Leading Leg */}
                <path d="M 3,18 L 8,18 L 8.5,31 L 3.5,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="2.8" y="17" width="5.8" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

                {/* Shorts */}
                <path d="M -7,0 L 7,0 L 9,14 L -8,14 Z" fill={`url(#${shortsGradId})`} />
                <path d="M 0,0 L 0,14" stroke={primaryColor} strokeWidth="2" />

                {/* Torso */}
                <path d="M -9,-19 L 9,-19 L 7,1 L -7,1 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 0,-18 L 0,1" stroke="#000000" strokeWidth="1.8" strokeOpacity="0.3" />
                <rect x="4" y="-14" width="3" height="4" rx="1" fill={secondaryColor} />

                {/* Arm */}
                <path d="M 3,-17 L 7,-17 L 12,-7 L 9,-5 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 11,-6 L 15,2 L 12,3 L 8,-4 Z" fill={skinTone} />
                <ellipse cx="15.5" cy="3.5" rx="1.8" ry="2" fill={skinTone} />

                {/* Head */}
                <g transform="translate(0, -26)">
                  <ellipse cx="0" cy="0" rx="5.5" ry="7" fill={`url(#${headGradId})`} />
                  <path d="M 4,-2 L 7,0 L 4,1.5" fill={skinTone} stroke="#000000" strokeWidth="0.4" />
                  <path d="M -5.5,-1 C -5.5,-6 0,-7.8 4,-7.8 C 6,-7.8 7,-6 7,-3 C 5,-4.5 2,-5 -2,-5 C -4,-5 -5.5,-3.5 -5.5,-1 Z" fill={hairColor} />
                  <ellipse cx="-0.5" cy="0.5" rx="1.4" ry="2" fill={skinTone} />
                </g>
              </g>
            )}

            {/* --- DIRECTION 7: BACK-LEFT (Attacking North-West / 315°) --- */}
            {dirIndex === 7 && (
              <g className="p3d-back-left" transform="scale(-1, 1)">
                {/* Mirrored from Back-Right */}
                <ellipse cx="-8" cy="33" rx="4" ry="3" fill={`url(#${bootGradId})`} />
                <path d="M -10,18 L -5,18 L -6,31 L -10,31 Z" fill={`url(#${sockGradId})`} />
                <path d="M 3,31 L 9,29 L 13,34 L 11,37 L 3,37 Z" fill={`url(#${bootGradId})`} />
                <path d="M 4,18 L 9,18 L 10,31 L 5,31 Z" fill={`url(#${sockGradId})`} />
                <rect x="3.8" y="17" width="6" height="2.8" rx="1" fill={primaryColor} stroke={secondaryColor} strokeWidth="0.8" />

                <path d="M -9,0 L 10,0 L 12,14 L -6,14 Z" fill={`url(#${shortsGradId})`} />
                <rect x="-9" y="0" width="19" height="2.5" rx="0.8" fill={shortsBaseColor} />

                <path d="M -13,-19 L 14,-19 L 10,2 L -8,2 Z" fill={`url(#${torsoGradId})`} />
                <text
                  x="2"
                  y="-0.5"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="900"
                  fill={contrastNumberColor}
                  stroke={numberOutlineColor}
                  strokeWidth="2.5"
                  style={{ paintOrder: 'stroke fill' }}
                  className="font-sans font-black"
                >
                  {number}
                </text>
                <text x="1" y="-12.5" textAnchor="middle" fontSize="3.6" fontWeight="900" fill="#ffffff">
                  {cleanLastName}
                </text>

                <path d="M -12,-18 L -18,-9 L -15,-8 L -10,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M -18,-9 L -18,2 L -15,1 Z" fill={skinTone} />
                <path d="M 12,-18 L 17,-9 L 14,-8 L 10,-16 Z" fill={`url(#${torsoGradId})`} />
                <path d="M 17,-9 L 20,-1 L 17,0 Z" fill={skinTone} />

                <g transform="translate(2, -26)">
                  <path d="M -2,3 L 2,3 L 1,7 L -3,7 Z" fill={skinTone} />
                  <ellipse cx="0" cy="0" rx="6.5" ry="7.5" fill={hairColor} />
                  <ellipse cx="6" cy="1" rx="1.2" ry="1.8" fill={skinTone} />
                </g>
              </g>
            )}
          </>
        )}
      </g>
    </g>
  );
};
