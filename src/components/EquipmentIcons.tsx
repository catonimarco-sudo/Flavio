import React from 'react';
import { EquipmentType } from '../types';

interface EquipmentProps {
  type: EquipmentType;
  isSelected?: boolean;
  size?: number;
}

export const EquipmentRenderer: React.FC<EquipmentProps> = ({ type, size = 32 }) => {
  switch (type) {
    case 'ball':
      return (
        <g className="filter drop-shadow-md">
          {/* Turf contact shadow */}
          <ellipse cx="16" cy="27" rx="10" ry="3.5" fill="#000000" opacity="0.35" />
          {/* Ball Base */}
          <circle cx="16" cy="15" r="12.5" fill="#f8fafc" stroke="#334155" strokeWidth="1.2" />
          {/* Central Black Pentagon */}
          <polygon points="16,8.5 20.2,11.8 18.6,16.8 13.4,16.8 11.8,11.8" fill="#0f172a" />
          {/* Radial seams from central pentagon */}
          <line x1="16" y1="8.5" x2="16" y2="3" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="20.2" y1="11.8" x2="26" y2="9.5" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="18.6" y1="16.8" x2="23.5" y2="23" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="13.4" y1="16.8" x2="8.5" y2="23" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="11.8" y1="11.8" x2="6" y2="9.5" stroke="#1e293b" strokeWidth="1.2" />
          {/* Perimeter edge pentagons */}
          <path d="M 12.5,3 C 14.5,2.7 17.5,2.7 19.5,3 L 18.5,5.5 L 13.5,5.5 Z" fill="#0f172a" opacity="0.9" />
          <path d="M 26,9.5 C 27.5,12 28,15 27,17.5 L 24.5,15.5 L 24.5,12 Z" fill="#0f172a" opacity="0.9" />
          <path d="M 6,9.5 C 4.5,12 4,15 5,17.5 L 7.5,15.5 L 7.5,12 Z" fill="#0f172a" opacity="0.9" />
          {/* 3D Specular Highlight */}
          <ellipse cx="12" cy="10" rx="4.5" ry="3" fill="#ffffff" opacity="0.5" />
        </g>
      );

    case 'cone_orange':
      return (
        <g className="filter drop-shadow-md">
          {/* Ground shadow */}
          <ellipse cx="16" cy="28" rx="14" ry="4" fill="#000000" opacity="0.3" />
          {/* Base flange */}
          <ellipse cx="16" cy="26" rx="13" ry="4" fill="#c2410c" />
          <ellipse cx="16" cy="25" rx="12" ry="3.5" fill="#ea580c" />
          {/* Cone body */}
          <path d="M 7.5,25 L 14.2,4.5 Q 16,3 17.8,4.5 L 24.5,25 Z" fill="#f97316" />
          {/* Lower Reflective White Stripe */}
          <path d="M 10.5,18.5 L 12.8,12.5 L 19.2,12.5 L 21.5,18.5 Z" fill="#ffffff" opacity="0.95" />
          {/* Upper Reflective White Stripe */}
          <path d="M 13.5,10.5 L 14.6,7 L 17.4,7 L 18.5,10.5 Z" fill="#ffffff" opacity="0.95" />
          {/* Top hole */}
          <ellipse cx="16" cy="4.2" rx="1.8" ry="0.8" fill="#c2410c" />
        </g>
      );

    case 'disc_yellow':
    case 'disc_red':
    case 'disc_blue':
    case 'disc_green': {
      const colorMap: Record<string, { bg: string; dark: string; light: string; shadow: string }> = {
        disc_yellow: { bg: '#eab308', dark: '#a16207', light: '#fef08a', shadow: '#713f12' },
        disc_red: { bg: '#ef4444', dark: '#991b1b', light: '#fecaca', shadow: '#7f1d1d' },
        disc_blue: { bg: '#3b82f6', dark: '#1e40af', light: '#bfdbfe', shadow: '#1e3a8a' },
        disc_green: { bg: '#22c55e', dark: '#166534', light: '#bbf7d0', shadow: '#14532d' },
      };
      const c = colorMap[type] || colorMap.disc_yellow;
      return (
        <g className="filter drop-shadow-sm">
          {/* Contact turf shadow */}
          <ellipse cx="16" cy="23" rx="14" ry="5.5" fill="#000000" opacity="0.32" />
          {/* Low profile marker dome (cinesino) */}
          <ellipse cx="16" cy="20" rx="13" ry="5.2" fill={c.dark} />
          <path d="M 3,20 C 3,13 29,13 29,20 L 21,12 C 18.5,10 13.5,10 11,12 Z" fill={c.bg} />
          <ellipse cx="16" cy="17" rx="12" ry="4.5" fill={c.light} opacity="0.8" />
          {/* Center pickup hole */}
          <ellipse cx="16" cy="17" rx="3.5" ry="1.6" fill={c.shadow} />
        </g>
      );
    }

    case 'mini_goal':
      return (
        <g className="filter drop-shadow-md">
          {/* Turf contact shadow */}
          <ellipse cx="16" cy="28" rx="16" ry="4" fill="#000000" opacity="0.4" />
          {/* White Net Backing with Realistic Diamond Netting */}
          <path d="M 3,27 L 7,8 L 25,8 L 29,27 Z" fill="#1e293b" opacity="0.85" />
          {/* Net Grid Mesh Lines */}
          <line x1="5" y1="23" x2="27" y2="23" stroke="#f8fafc" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.75" />
          <line x1="6" y1="18" x2="26" y2="18" stroke="#f8fafc" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.75" />
          <line x1="7" y1="13" x2="25" y2="13" stroke="#f8fafc" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.75" />
          <line x1="11" y1="8" x2="9" y2="27" stroke="#f8fafc" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.75" />
          <line x1="16" y1="8" x2="16" y2="27" stroke="#f8fafc" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.75" />
          <line x1="21" y1="8" x2="23" y2="27" stroke="#f8fafc" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.75" />
          {/* Ground Base Frame */}
          <line x1="2" y1="27" x2="30" y2="27" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tubular Aluminum Front Goal Frame (Posts & Crossbar) */}
          <path
            d="M 3,27 L 3,7 Q 3,5 5,5 L 27,5 Q 29,5 29,7 L 29,27"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
          />
          {/* Red/Blue Frame Joint Caps */}
          <rect x="2" y="4" width="3" height="3" rx="0.5" fill="#ef4444" />
          <rect x="27" y="4" width="3" height="3" rx="0.5" fill="#ef4444" />
        </g>
      );

    case 'pole':
      return (
        <g className="filter drop-shadow-md">
          {/* Rubber ground base */}
          <ellipse cx="16" cy="28" rx="8" ry="3" fill="#1e293b" />
          <ellipse cx="16" cy="27" rx="7" ry="2.5" fill="#facc15" />
          {/* Yellow and red alternating agility pole */}
          <rect x="14.5" y="2" width="3" height="25" rx="1.5" fill="#e11d48" />
          <rect x="14.5" y="7" width="3" height="6" fill="#facc15" />
          <rect x="14.5" y="16" width="3" height="6" fill="#facc15" />
          <circle cx="16" cy="2" r="2" fill="#fbbf24" />
        </g>
      );

    case 'ladder':
      return (
        <g className="filter drop-shadow-sm">
          {/* Agility ladder */}
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
          {/* Training Mannequin / Sagoma da Punizione */}
          <ellipse cx="16" cy="30" rx="9" ry="2.5" fill="#0f172a" opacity="0.7" />
          <line x1="16" y1="24" x2="16" y2="30" stroke="#94a3b8" strokeWidth="2" />
          <line x1="12" y1="17" x2="14" y2="24" stroke="#3b82f6" strokeWidth="3" />
          <line x1="20" y1="17" x2="18" y2="24" stroke="#3b82f6" strokeWidth="3" />
          <path d="M 10,9 L 22,9 L 20,17 L 12,17 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
          <circle cx="16" cy="5" r="3.5" fill="#facc15" />
          <line x1="12" y1="12" x2="20" y2="12" stroke="#ffffff" strokeWidth="1" />
        </g>
      );

    case 'hurdle':
      return (
        <g className="filter drop-shadow-sm">
          <path d="M 4,27 L 4,11 Q 4,9 7,9 L 25,9 Q 28,9 28,11 L 28,27" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
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
