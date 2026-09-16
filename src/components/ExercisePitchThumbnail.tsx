import React from 'react';
import { PlacedPlayer, PlacedEquipment, TacticalDrawing } from '../types';

interface ExercisePitchThumbnailProps {
  category: string;
  drillType?: string;
  players?: PlacedPlayer[];
  equipment?: PlacedEquipment[];
  drawings?: TacticalDrawing[];
  className?: string;
}

export const ExercisePitchThumbnail: React.FC<ExercisePitchThumbnailProps> = ({
  category,
  drillType,
  players,
  equipment,
  drawings,
  className = '',
}) => {
  // If no custom players or equipment are provided, render a rich, bespoke 3D tactical scene
  // corresponding to the category and drill type (matching the CoachLab screenshot aesthetic)
  const isPossession = category.includes('Possesso') || drillType === 'possession';
  const isFinishing = category.includes('Finalizzazione') || drillType === 'finishing';
  const isTransition = category.includes('Transizioni') || drillType === 'transition';
  const isWarmup = category.includes('Riscaldamento') || drillType === 'warmup';
  const isTactics = category.includes('Tattica') || drillType === 'tactics';

  return (
    <div className={`relative w-full aspect-[16/10] overflow-hidden rounded-t-lg bg-slate-950 select-none ${className}`}>
      <svg
        viewBox="0 0 320 200"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 3D Pitch Turf Gradient */}
          <linearGradient id="turfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e5128" />
            <stop offset="40%" stopColor="#194822" />
            <stop offset="100%" stopColor="#0f3316" />
          </linearGradient>

          {/* Mowing Stripes Pattern */}
          <linearGradient id="stripeA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#225a2d" />
            <stop offset="100%" stopColor="#1a4c24" />
          </linearGradient>
          <linearGradient id="stripeB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#194922" />
            <stop offset="100%" stopColor="#133d1b" />
          </linearGradient>

          {/* Vignette Shadow for 3D Stadium feel */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
            <stop offset="60%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>

          {/* Player Drop Shadow */}
          <filter id="pShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          {/* Ball Glow */}
          <filter id="ballGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Stadium/Surround Border */}
        <rect width="320" height="200" fill="#0b111e" />

        {/* 3D Perspective Pitch Trapezoid */}
        {/* Top edge width: 220 (from 50 to 270), y: 18 */}
        {/* Bottom edge width: 300 (from 10 to 310), y: 190 */}
        <g>
          {/* Turf contact base */}
          <polygon
            points="50,20 270,20 310,188 10,188"
            fill="url(#turfGrad)"
          />

          {/* Alternating Mowed Grass Stripes (Horizontal Perspective bands) */}
          <polygon points="50,20 270,20 274,38 46,38" fill="url(#stripeA)" opacity="0.9" />
          <polygon points="46,38 274,38 279,58 41,58" fill="url(#stripeB)" opacity="0.9" />
          <polygon points="41,58 279,58 284,80 36,80" fill="url(#stripeA)" opacity="0.9" />
          <polygon points="36,80 284,80 290,104 30,104" fill="url(#stripeB)" opacity="0.9" />
          <polygon points="30,104 290,104 296,130 24,130" fill="url(#stripeA)" opacity="0.9" />
          <polygon points="24,130 296,130 303,158 17,158" fill="url(#stripeB)" opacity="0.9" />
          <polygon points="17,158 303,158 310,188 10,188" fill="url(#stripeA)" opacity="0.9" />

          {/* White Boundary Lines (Thinned with perspective) */}
          <polygon
            points="54,24 266,24 304,184 16,184"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            opacity="0.8"
          />

          {/* Halfway line */}
          <line
            x1="30"
            y1="104"
            x2="290"
            y2="104"
            stroke="#ffffff"
            strokeWidth="1.1"
            opacity="0.75"
          />

          {/* Center Circle (Elliptical in perspective) */}
          <ellipse
            cx="160"
            cy="104"
            rx="38"
            ry="14"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.1"
            opacity="0.75"
          />
          <circle cx="160" cy="104" r="1.5" fill="#ffffff" opacity="0.8" />

          {/* Top Penalty Area (North Goal) */}
          <polygon
            points="110,24 210,24 218,60 102,60"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.1"
            opacity="0.75"
          />
          {/* Top Goal Area */}
          <polygon
            points="132,24 188,24 191,40 129,40"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.9"
            opacity="0.7"
          />
          {/* Top Penalty Spot & Arc */}
          <circle cx="160" cy="48" r="1.2" fill="#ffffff" opacity="0.8" />
          <path
            d="M 144,60 C 148,67 172,67 176,60"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.9"
            opacity="0.7"
          />

          {/* North Goal 3D Frame & Net */}
          <g opacity="0.92">
            {/* Net floor shadow */}
            <polygon points="135,24 185,24 182,10 138,10" fill="#0b111e" opacity="0.55" />
            {/* Net mesh lines */}
            <polygon points="138,10 182,10 185,24 135,24" fill="#ffffff" opacity="0.12" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* White Posts and Crossbar */}
            <line x1="135" y1="24" x2="135" y2="12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="185" y1="24" x2="185" y2="12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="134" y1="12" x2="186" y2="12" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            {/* Top net depth struts */}
            <line x1="135" y1="12" x2="138" y2="10" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="185" y1="12" x2="182" y2="10" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="138" y1="10" x2="182" y2="10" stroke="#94a3b8" strokeWidth="1.2" />
          </g>

          {/* Soft vignette */}
          <polygon
            points="50,20 270,20 310,188 10,188"
            fill="url(#vignette)"
          />
        </g>

        {/* Dynamic Exercise Scene Elements */}
        {/* If custom items are provided, render them; otherwise render the category-themed layout */}
        {renderDrillScene(category, isPossession, isFinishing, isTransition, isWarmup, isTactics)}
      </svg>
    </div>
  );
};

// Subroutine to render the authentic 3D players, cones, balls and tactical arrows
function renderDrillScene(
  category: string,
  isPossession: boolean,
  isFinishing: boolean,
  isTransition: boolean,
  isWarmup: boolean,
  isTactics: boolean
) {
  if (isFinishing) {
    // FINALIZZAZIONE CON CROSS E INSERIMENTO (Goal attack scenario)
    return (
      <g>
        {/* Mini cone grid for crossing zone */}
        {renderCone(70, 75, '#ea580c')}
        {renderCone(74, 110, '#ea580c')}
        {renderCone(246, 75, '#ea580c')}
        {renderCone(242, 110, '#ea580c')}

        {/* Tactical Movement Arrows */}
        {/* Cross from right flank */}
        <path
          d="M 235,115 Q 190,50 168,36"
          fill="none"
          stroke="#facc15"
          strokeWidth="1.8"
          strokeDasharray="4,2"
        />
        <polygon points="166,33 167,39 172,36" fill="#facc15" />

        {/* Central striker run into box */}
        <path
          d="M 155,120 L 160,54"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeDasharray="3,2"
        />
        <polygon points="160,50 157,56 163,56" fill="#ffffff" />

        {/* Second attacker run to back post */}
        <path
          d="M 115,110 L 138,46"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeDasharray="3,2"
        />
        <polygon points="138,42 135,48 141,47" fill="#ffffff" />

        {/* Goalkeeper in goal */}
        {renderPlayerNode(160, 26, '#facc15', '#0f172a', 'POR', true)}

        {/* 2 Central Defenders (Red) */}
        {renderPlayerNode(146, 52, '#dc2626', '#ffffff', 'DC')}
        {renderPlayerNode(175, 50, '#dc2626', '#ffffff', 'DC')}

        {/* Attackers (Blue) */}
        {renderPlayerNode(235, 118, '#2563eb', '#ffffff', 'AD')}
        {renderPlayerNode(155, 122, '#2563eb', '#ffffff', 'ATT')}
        {renderPlayerNode(115, 112, '#2563eb', '#ffffff', 'AS')}
        {renderPlayerNode(162, 155, '#2563eb', '#ffffff', 'CC')}

        {/* Ball at winger's feet */}
        {renderBall(232, 122)}
        {renderBall(158, 158)}
      </g>
    );
  }

  if (isTransition) {
    // TRANSIZIONE POSITIVA / NEGATIVA (5v3 + 2 Jolly con mini-porte)
    return (
      <g>
        {/* Cones bounding tactical zone */}
        {renderCone(90, 65, '#f59e0b')}
        {renderCone(230, 65, '#f59e0b')}
        {renderCone(245, 145, '#f59e0b')}
        {renderCone(75, 145, '#f59e0b')}

        {/* 2 Mini-goals at bottom corners for counter-attack */}
        {renderMiniGoal(60, 160, -20)}
        {renderMiniGoal(260, 160, 20)}

        {/* Tactical transition passing and recovery arrows */}
        <path
          d="M 135,95 L 175,85"
          fill="none"
          stroke="#facc15"
          strokeWidth="1.8"
        />
        <polygon points="178,84 172,82 173,88" fill="#facc15" />

        <path
          d="M 180,95 L 245,150"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeDasharray="3,2"
        />
        <polygon points="248,152 242,148 245,145" fill="#38bdf8" />

        {/* Pressing run (Red) */}
        <path
          d="M 160,118 L 140,102"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.6"
          strokeDasharray="2,2"
        />
        <polygon points="137,100 143,101 140,105" fill="#ef4444" />

        {/* Blue Team (Possession 5) */}
        {renderPlayerNode(105, 78, '#2563eb', '#ffffff', 'P1')}
        {renderPlayerNode(215, 76, '#2563eb', '#ffffff', 'P2')}
        {renderPlayerNode(225, 132, '#2563eb', '#ffffff', 'P3')}
        {renderPlayerNode(95, 134, '#2563eb', '#ffffff', 'P4')}
        {renderPlayerNode(160, 72, '#2563eb', '#ffffff', 'P5')}

        {/* Red Team (Defenders 3) */}
        {renderPlayerNode(135, 96, '#dc2626', '#ffffff', 'D1')}
        {renderPlayerNode(160, 120, '#dc2626', '#ffffff', 'D2')}
        {renderPlayerNode(182, 92, '#dc2626', '#ffffff', 'D3')}

        {/* Jolly Players (Yellow fluo 2) */}
        {renderPlayerNode(160, 102, '#eab308', '#0f172a', 'J1')}
        {renderPlayerNode(160, 148, '#eab308', '#0f172a', 'J2')}

        {/* Ball */}
        {renderBall(132, 98)}
      </g>
    );
  }

  if (isWarmup) {
    // RONDO DINAMICO / ATTIVAZIONE TECNICA (Circle or Diamond rondo with position changes)
    return (
      <g>
        {/* Circular disc cones */}
        {renderDisc(160, 60, '#facc15')}
        {renderDisc(195, 75, '#facc15')}
        {renderDisc(210, 105, '#facc15')}
        {renderDisc(195, 135, '#facc15')}
        {renderDisc(160, 150, '#facc15')}
        {renderDisc(125, 135, '#facc15')}
        {renderDisc(110, 105, '#facc15')}
        {renderDisc(125, 75, '#facc15')}

        {/* Rotation circle line */}
        <ellipse
          cx="160"
          cy="105"
          rx="52"
          ry="38"
          fill="none"
          stroke="#facc15"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.4"
        />

        {/* Rapid passing sequence arrows */}
        <path d="M 125,82 L 160,68" stroke="#ffffff" strokeWidth="1.6" />
        <polygon points="163,67 157,66 159,71" fill="#ffffff" />

        <path d="M 166,70 L 195,82" stroke="#ffffff" strokeWidth="1.6" />
        <polygon points="198,83 193,79 192,84" fill="#ffffff" />

        <path d="M 195,130 L 125,130" stroke="#facc15" strokeWidth="1.8" strokeDasharray="3,2" />
        <polygon points="121,130 126,127 126,133" fill="#facc15" />

        {/* Outside Blue Players */}
        {renderPlayerNode(160, 64, '#2563eb', '#ffffff', '1')}
        {renderPlayerNode(205, 80, '#2563eb', '#ffffff', '2')}
        {renderPlayerNode(215, 110, '#2563eb', '#ffffff', '3')}
        {renderPlayerNode(195, 140, '#2563eb', '#ffffff', '4')}
        {renderPlayerNode(160, 154, '#2563eb', '#ffffff', '5')}
        {renderPlayerNode(125, 140, '#2563eb', '#ffffff', '6')}
        {renderPlayerNode(105, 110, '#2563eb', '#ffffff', '7')}
        {renderPlayerNode(120, 80, '#2563eb', '#ffffff', '8')}

        {/* 2 Central Defenders in red */}
        {renderPlayerNode(148, 102, '#dc2626', '#ffffff', 'D1')}
        {renderPlayerNode(172, 108, '#dc2626', '#ffffff', 'D2')}

        {/* Ball */}
        {renderBall(127, 85)}
      </g>
    );
  }

  // DEFAULT / POSSESSO PALLA IN SUPERIORITÀ CON JOLLY (Matching Screenshot #1 card)
  return (
    <g>
      {/* 4 Cones defining rectangular possession grid */}
      {renderCone(85, 55, '#ea580c')}
      {renderCone(235, 55, '#ea580c')}
      {renderCone(252, 150, '#ea580c')}
      {renderCone(68, 150, '#ea580c')}

      {/* Subtle pitch grid line */}
      <polygon
        points="85,55 235,55 252,150 68,150"
        fill="#ffffff"
        fillOpacity="0.04"
        stroke="#facc15"
        strokeWidth="1.2"
        strokeDasharray="4,3"
      />

      {/* Tactical Passing Lines */}
      {/* Pass from bottom-left to central jolly */}
      <path
        d="M 98,135 L 152,105"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
      />
      <polygon points="156,103 150,103 152,108" fill="#ffffff" />

      {/* Layoff to top-right player */}
      <path
        d="M 166,98 L 216,72"
        fill="none"
        stroke="#facc15"
        strokeWidth="1.8"
        strokeDasharray="4,2"
      />
      <polygon points="220,70 214,71 216,76" fill="#facc15" />

      {/* Movement arrow for support */}
      <path
        d="M 185,138 L 195,115"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.6"
        strokeDasharray="2,2"
      />
      <polygon points="196,111 192,116 198,116" fill="#38bdf8" />

      {/* Pressing movement arrow (Red) */}
      <path
        d="M 130,90 L 148,98"
        fill="none"
        stroke="#ef4444"
        strokeWidth="1.6"
        strokeDasharray="2,2"
      />
      <polygon points="151,100 145,97 148,94" fill="#ef4444" />

      {/* Blue Team (Possession Team) */}
      {renderPlayerNode(105, 66, '#2563eb', '#ffffff', '4')}
      {renderPlayerNode(215, 68, '#2563eb', '#ffffff', '8')}
      {renderPlayerNode(230, 138, '#2563eb', '#ffffff', '10')}
      {renderPlayerNode(90, 138, '#2563eb', '#ffffff', '7')}

      {/* Red Team (Pressing Defenders) */}
      {renderPlayerNode(130, 88, '#dc2626', '#ffffff', '2')}
      {renderPlayerNode(180, 86, '#dc2626', '#ffffff', '5')}
      {renderPlayerNode(160, 130, '#dc2626', '#ffffff', '6')}

      {/* Jolly Player (Yellow fluo in center) */}
      {renderPlayerNode(160, 100, '#eab308', '#0f172a', 'J')}

      {/* Soccer Ball */}
      {renderBall(94, 136)}
    </g>
  );
}

// Helper to render an athletic 3D isometric player matching the screenshot aesthetic
function renderPlayerNode(
  x: number,
  y: number,
  primaryColor: string,
  numColor: string,
  label: string,
  isKeeper: boolean = false
) {
  return (
    <g transform={`translate(${x}, ${y})`} filter="url(#pShadow)">
      {/* Turf contact oval shadow */}
      <ellipse cx="0" cy="11" rx="8" ry="3.5" fill="#000000" opacity="0.45" />

      {/* Cleats/Shoes */}
      <ellipse cx="-3.5" cy="10" rx="2.5" ry="1.4" fill="#0f172a" />
      <ellipse cx="3.5" cy="10" rx="2.5" ry="1.4" fill="#0f172a" />

      {/* Socks & Legs */}
      <line x1="-3.5" y1="5.5" x2="-3.5" y2="9.5" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="3.5" y1="5.5" x2="3.5" y2="9.5" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />

      {/* Shorts */}
      <path d="M -5.5,3.5 L 5.5,3.5 L 4.5,6.5 L 0.8,6.5 L 0,4.5 L -0.8,6.5 L -4.5,6.5 Z" fill="#0f172a" />

      {/* Jersey Torso */}
      <path
        d="M -6.5,-5 C -6.5,-7 6.5,-7 6.5,-5 L 5.5,3.5 L -5.5,3.5 Z"
        fill={primaryColor}
        stroke="#0f172a"
        strokeWidth="0.6"
      />

      {/* Arms */}
      <path
        d="M -6,-5 L -8.5,0 L -7,1.5 L -5,-3"
        fill={primaryColor}
      />
      <path
        d="M 6,-5 L 8.5,0 L 7,1.5 L 5,-3"
        fill={primaryColor}
      />

      {/* Goalkeeper Gloves or Hands */}
      {isKeeper ? (
        <>
          <circle cx="-8" cy="1" r="2.2" fill="#22c55e" stroke="#0f172a" strokeWidth="0.5" />
          <circle cx="8" cy="1" r="2.2" fill="#22c55e" stroke="#0f172a" strokeWidth="0.5" />
        </>
      ) : (
        <>
          <circle cx="-8" cy="1" r="1.4" fill="#fbcfe8" />
          <circle cx="8" cy="1" r="1.4" fill="#fbcfe8" />
        </>
      )}

      {/* Head with Hair & Face */}
      <circle cx="0" cy="-9" r="4.2" fill="#fbcfe8" />
      <path d="M -4,-10 C -4,-13 4,-13 4,-10 L 3,-9 L -3,-9 Z" fill="#1e293b" />

      {/* Back Number / Role text */}
      <text
        x="0"
        y="0.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill={numColor}
        fontSize="5.5"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

// Cone helper
function renderCone(x: number, y: number, color: string) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="3" rx="4.5" ry="1.8" fill="#000000" opacity="0.3" />
      <ellipse cx="0" cy="2" rx="4" ry="1.5" fill={color} />
      <polygon points="-3,2 0,-7 3,2" fill={color} />
      <polygon points="-1.5,-1 0,-7 1.5,-1" fill="#ffffff" opacity="0.9" />
    </g>
  );
}

// Disc / Cinesino helper
function renderDisc(x: number, y: number, color: string) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="2" rx="3.5" ry="1.4" fill="#000000" opacity="0.3" />
      <ellipse cx="0" cy="1" rx="3.2" ry="1.3" fill={color} />
      <ellipse cx="0" cy="0.6" rx="1.2" ry="0.6" fill="#0f172a" opacity="0.7" />
    </g>
  );
}

// Ball helper
function renderBall(x: number, y: number) {
  return (
    <g transform={`translate(${x}, ${y})`} filter="url(#ballGlow)">
      <ellipse cx="0" cy="2.5" rx="3" ry="1.2" fill="#000000" opacity="0.4" />
      <circle cx="0" cy="0" r="3" fill="#ffffff" stroke="#0f172a" strokeWidth="0.6" />
      <polygon points="0,-1.2 1.2,-0.2 0.8,1.1 -0.8,1.1 -1.2,-0.2" fill="#0f172a" />
    </g>
  );
}

// Mini Goal helper
function renderMiniGoal(x: number, y: number, rot: number) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <ellipse cx="0" cy="3" rx="10" ry="3" fill="#000000" opacity="0.3" />
      <path d="M -8,2 L -6,-6 L 6,-6 L 8,2 Z" fill="#ffffff" opacity="0.25" stroke="#ffffff" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
      <path d="M -8,2 L -8,-6 L 8,-6 L 8,2" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}
