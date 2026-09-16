import React from 'react';
import { PatternTheme } from '../../types';

interface GeometricPatternProps {
  theme: PatternTheme;
  className?: string;
}

export const GeometricPattern: React.FC<GeometricPatternProps> = ({ theme, className = '' }) => {
  switch (theme) {
    case 'purple-mesh':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-[#4a2e80] via-[#5c379e] to-[#2d1b54] relative overflow-hidden ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="purple-diamonds" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="14" height="14" fill="#a78bfa" fillOpacity="0.4" />
                <rect x="14" y="14" width="14" height="14" fill="#c084fc" fillOpacity="0.3" />
                <circle cx="14" cy="14" r="3" fill="#ffffff" fillOpacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#purple-diamonds)" />
          </svg>
        </div>
      );

    case 'orange-waves':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-[#d97706] via-[#f59e0b] to-[#b45309] relative overflow-hidden ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="orange-zigzag" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M0 18 L18 0 L36 18 L18 36 Z" fill="none" stroke="#fef3c7" strokeWidth="2" />
                <circle cx="18" cy="18" r="4" fill="#fde68a" fillOpacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#orange-zigzag)" />
          </svg>
        </div>
      );

    case 'slate-poly':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-[#64748b] via-[#475569] to-[#334155] relative overflow-hidden ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="slate-cubes" width="30" height="30" patternUnits="userSpaceOnUse">
                <polygon points="15,0 30,7.5 15,15 0,7.5" fill="#cbd5e1" />
                <polygon points="0,7.5 15,15 15,30 0,22.5" fill="#94a3b8" />
                <polygon points="15,15 30,7.5 30,22.5 15,30" fill="#e2e8f0" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#slate-cubes)" />
          </svg>
        </div>
      );

    case 'teal-geometric':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-[#0e7490] via-[#0891b2] to-[#155e75] relative overflow-hidden ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="teal-waves" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q10 0, 20 10 T40 10" fill="none" stroke="#a5f3fc" strokeWidth="2.5" />
                <path d="M0 20 Q10 10, 20 20 T40 20" fill="none" stroke="#67e8f9" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#teal-waves)" />
          </svg>
        </div>
      );

    case 'blue-statue':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] relative overflow-hidden ${className}`}>
          {/* Classical statue line art effect from the photo */}
          <svg className="absolute right-3 -bottom-2 w-28 h-28 opacity-80 text-[#0284c7]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path d="M50 15 C55 15, 60 20, 60 26 C60 35, 52 40, 50 48 C48 40, 40 35, 40 26 C40 20, 45 15, 50 15 Z" strokeWidth="1.5" />
            <path d="M35 35 Q50 30, 65 35 Q60 55, 62 85 L38 85 Q40 55, 35 35 Z" strokeWidth="1.5" />
            <path d="M38 45 C30 50, 28 65, 32 75" strokeWidth="1.5" />
            <path d="M62 45 C70 50, 72 65, 68 75" strokeWidth="1.5" />
            <path d="M42 22 Q50 20, 58 22" strokeWidth="1" strokeDasharray="1 1" />
            <path d="M44 26 Q50 28, 56 26" strokeWidth="1" />
            <circle cx="50" cy="50" r="35" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      );

    case 'pink-mosaic':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-[#be185d] via-[#db2777] to-[#9d174d] relative overflow-hidden ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pink-circles" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="9" fill="#fbcfe8" fillOpacity="0.4" />
                <circle cx="12" cy="12" r="4" fill="#ffffff" fillOpacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pink-circles)" />
          </svg>
        </div>
      );

    case 'green-abstract':
      return (
        <div className={`w-full h-full bg-gradient-to-br from-[#047857] via-[#059669] to-[#065f46] relative overflow-hidden ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="green-triangles" width="30" height="30" patternUnits="userSpaceOnUse">
                <polygon points="0,0 15,30 30,0" fill="#a7f3d0" fillOpacity="0.3" />
                <polygon points="15,0 30,30 0,30" fill="#6ee7b7" fillOpacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#green-triangles)" />
          </svg>
        </div>
      );

    case 'yellow-mesh':
    default:
      return (
        <div className={`w-full h-full bg-gradient-to-br from-[#d97706] via-[#eab308] to-[#ca8a04] relative overflow-hidden ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="yellow-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="2" fill="#ffffff" fillOpacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#yellow-grid)" />
          </svg>
        </div>
      );
  }
};
