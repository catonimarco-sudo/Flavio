import React from 'react';
import { EquipmentType } from '../types';

interface EquipmentProps {
  type: EquipmentType;
  isSelected?: boolean;
  size?: number;
}

export const EquipmentRenderer: React.FC<EquipmentProps> = ({ type, isSelected, size = 32 }) => {
  switch (type) {
    case 'ball':
      return (
        <g className="filter drop-shadow-md">
          <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
          {/* Pentagon center */}
          <polygon points="16,8 21,12 19,18 13,18 11,12" fill="#0f172a" />
          {/* Pentagon edges radiating to circle */}
          <line x1="16" y1="8" x2="16" y2="2" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="21" y1="12" x2="28" y2="10" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="19" y1="18" x2="25" y2="25" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="13" y1="18" x2="7" y2="25" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="11" y1="12" x2="4" y2="10" stroke="#0f172a" strokeWidth="1.5" />
          {/* Subtle 3D gloss */}
          <circle cx="12" cy="11" r="4" fill="#ffffff" opacity="0.35" />
        </g>
      );

    case 'cone_orange':
      return (
        <g className="filter drop-shadow-md">
          {/* Cone base */}
          <ellipse cx="16" cy="27" rx="14" ry="4" fill="#c2410c" />
          <ellipse cx="16" cy="26" rx="13" ry="3.5" fill="#ea580c" />
          {/* Cone body */}
          <path d="M7 26 L14 4 Q16 2 18 4 L25 26 Z" fill="#f97316" />
          {/* White stripes */}
          <path d="M10.5 19 L12.5 13 L19.5 13 L21.5 19 Z" fill="#ffffff" opacity="0.9" />
          <path d="M13.2 10 L14.5 6 L17.5 6 L18.8 10 Z" fill="#ffffff" opacity="0.9" />
        </g>
      );

    case 'disc_yellow':
    case 'disc_red':
    case 'disc_blue':
    case 'disc_green': {
      const colorMap: Record<string, { bg: string; dark: string; light: string }> = {
        disc_yellow: { bg: '#eab308', dark: '#ca8a04', light: '#fde047' },
        disc_red: { bg: '#ef4444', dark: '#b91c1c', light: '#fca5a5' },
        disc_blue: { bg: '#3b82f6', dark: '#1d4ed8', light: '#93c5fd' },
        disc_green: { bg: '#22c55e', dark: '#15803d', light: '#86efac' },
      };
      const c = colorMap[type] || colorMap.disc_yellow;
      return (
        <g className="filter drop-shadow-sm">
          <ellipse cx="16" cy="19" rx="14" ry="6.5" fill={c.dark} />
          <path d="M2 19 C2 12, 30 12, 30 19 L21 10 C19 8, 13 8, 11 10 Z" fill={c.bg} />
          <ellipse cx="16" cy="16" rx="13" ry="5.5" fill={c.light} />
          {/* Center hole */}
          <ellipse cx="16" cy="16" rx="3.5" ry="1.8" fill={c.dark} />
        </g>
      );
    }

    case 'mini_goal':
      return (
        <g className="filter drop-shadow-md">
          {/* Net mesh */}
          <rect x="3" y="6" width="26" height="20" rx="2" fill="#334155" opacity="0.8" />
          <line x1="3" y1="12" x2="29" y2="12" stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="3" y1="18" x2="29" y2="18" stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="10" y1="6" x2="10" y2="26" stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="16" y1="6" x2="16" y2="26" stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="22" y1="6" x2="22" y2="26" stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="2,2" />
          {/* White Goal Posts */}
          <path d="M2 28 L2 5 Q2 4 3 4 L29 4 Q30 4 30 5 L30 28" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <line x1="1" y1="28" x2="31" y2="28" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'pole':
      return (
        <g className="filter drop-shadow-md">
          <ellipse cx="16" cy="28" rx="8" ry="3" fill="#1e293b" />
          <ellipse cx="16" cy="27" rx="7" ry="2.5" fill="#facc15" />
          <rect x="14.5" y="2" width="3" height="25" rx="1.5" fill="#e11d48" />
          <rect x="14.5" y="7" width="3" height="6" fill="#facc15" />
          <rect x="14.5" y="16" width="3" height="6" fill="#facc15" />
          <circle cx="16" cy="2" r="2" fill="#fbbf24" />
        </g>
      );

    case 'ladder':
      return (
        <g className="filter drop-shadow-sm">
          {/* Agility ladder vertical */}
          <line x1="8" y1="2" x2="8" y2="30" stroke="#facc15" strokeWidth="2.5" />
          <line x1="24" y1="2" x2="24" y2="30" stroke="#facc15" strokeWidth="2.5" />
          <line x1="8" y1="6" x2="24" y2="6" stroke="#f8fafc" strokeWidth="2" />
          <line x1="8" y1="12" x2="24" y2="12" stroke="#f8fafc" strokeWidth="2" />
          <line x1="8" y1="18" x2="24" y2="18" stroke="#f8fafc" strokeWidth="2" />
          <line x1="8" y1="24" x2="24" y2="24" stroke="#f8fafc" strokeWidth="2" />
        </g>
      );

    case 'mannequin':
      return (
        <g className="filter drop-shadow-lg">
          {/* Training Mannequin / Sagoma */}
          <ellipse cx="16" cy="30" rx="9" ry="2.5" fill="#0f172a" opacity="0.7" />
          {/* Base spring/metal */}
          <line x1="16" y1="24" x2="16" y2="30" stroke="#94a3b8" strokeWidth="2" />
          {/* Legs */}
          <line x1="12" y1="17" x2="14" y2="24" stroke="#3b82f6" strokeWidth="3" />
          <line x1="20" y1="17" x2="18" y2="24" stroke="#3b82f6" strokeWidth="3" />
          {/* Torso */}
          <path d="M10 9 L22 9 L20 17 L12 17 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
          {/* Head with cutouts */}
          <circle cx="16" cy="5" r="3.5" fill="#facc15" />
          {/* Chest lines */}
          <line x1="12" y1="12" x2="20" y2="12" stroke="#ffffff" strokeWidth="1" />
        </g>
      );

    case 'hurdle':
      return (
        <g className="filter drop-shadow-sm">
          {/* Agility hurdle */}
          <path d="M4 27 L4 11 Q4 9 7 9 L25 9 Q28 9 28 11 L28 27" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="4" cy="27" rx="3.5" ry="1.5" fill="#ea580c" />
          <ellipse cx="28" cy="27" rx="3.5" ry="1.5" fill="#ea580c" />
          <line x1="10" y1="9" x2="14" y2="9" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="18" y1="9" x2="22" y2="9" stroke="#ffffff" strokeWidth="2.5" />
        </g>
      );

    case 'ring':
      return (
        <g className="filter drop-shadow-sm">
          <ellipse cx="16" cy="16" rx="13" ry="9" fill="none" stroke="#ec4899" strokeWidth="3.5" />
        </g>
      );

    default:
      return null;
  }
};
