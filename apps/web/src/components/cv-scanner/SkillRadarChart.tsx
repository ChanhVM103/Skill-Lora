import React from 'react';
import { RadarMetric } from '../../types';

interface SkillRadarChartProps {
  metrics: RadarMetric[];
  size?: number;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  metrics,
  size = 280,
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const totalSides = metrics.length;
  const angleSlice = (Math.PI * 2) / totalSides;

  // Concentric levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1];

  // Helper to compute coordinates on circle
  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for the user score
  const scorePolygonPoints = metrics
    .map((m, i) => {
      const ratio = m.score / m.fullMark;
      const { x, y } = getCoordinates(i, ratio);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Concentric Webs */}
        {levels.map((level, lvlIdx) => {
          const points = Array.from({ length: totalSides })
            .map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={lvlIdx}
              points={points}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={lvlIdx === levels.length - 1 ? 'none' : '2,2'}
            />
          );
        })}

        {/* Axis Spokes from Center to Outer Edge */}
        {metrics.map((_, i) => {
          const { x, y } = getCoordinates(i, 1);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Data Polygon with Gradient */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#005d68" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f37021" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <polygon
          points={scorePolygonPoints}
          fill="url(#radarGradient)"
          stroke="#005d68"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out"
        />

        {/* Data points & Values */}
        {metrics.map((m, i) => {
          const ratio = m.score / m.fullMark;
          const { x, y } = getCoordinates(i, ratio);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#f37021"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-500"
              />
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                className="text-[10px] font-bold fill-neutral-900 dark:fill-white"
              >
                {m.score}%
              </text>
            </g>
          );
        })}

        {/* Axis Labels */}
        {metrics.map((m, i) => {
          const { x, y } = getCoordinates(i, 1.22);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-semibold fill-neutral-700 dark:fill-neutral-300"
            >
              {m.subject}
            </text>
          );
        })}
      </svg>

      <div className="mt-2 flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-ueh-teal"></span>
          <span>Điểm năng lực hiện tại</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-t border-dashed border-neutral-400"></span>
          <span>Mục tiêu 100% thị trường</span>
        </div>
      </div>
    </div>
  );
};
