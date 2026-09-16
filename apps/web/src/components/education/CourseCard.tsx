import React, { useState } from 'react';
import { MoreHorizontal, Sparkles, CheckCircle2, PlayCircle, BookOpen, Trash2 } from 'lucide-react';
import { Course } from '../../types';
import { GeometricPattern } from './GeometricPattern';
import { Language, translations } from '../../i18n/translations';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onQuickContinue: (course: Course) => void;
  isAdmin?: boolean;
  onDelete?: (course: Course) => void;
  language?: Language;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelect,
  onQuickContinue,
  isAdmin = false,
  onDelete,
  language = 'vi',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[language];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group relative">
      {/* CV Recommendation Banner Badge */}
      {course.isRecommendedFromCv && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3 fill-white" />
          <span>{t.suggestedFromCv}</span>
        </div>
      )}

      {/* Admin Quick Delete Action */}
      {isAdmin && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(course);
          }}
          className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-neutral-900/80 hover:bg-rose-600 text-white/90 hover:text-white flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105"
          title="Xóa khóa học này khỏi hệ thống (Admin)"
          aria-label="Xóa khóa học"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Thumbnail Area with Pattern and Progress Overlay */}
      <div
        onClick={() => onSelect(course)}
        className="h-28 w-full relative cursor-pointer overflow-hidden"
      >
        <GeometricPattern theme={course.patternTheme} />

        {/* Hover overlay button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
            <PlayCircle className="w-3.5 h-3.5 text-ueh-teal dark:text-teal-400" />
            {t.learnNow}
          </span>
        </div>

        {/* Bottom progress bar strip matching photo */}
        <div className="absolute bottom-0 inset-x-0 bg-neutral-900/60 backdrop-blur-xs px-2.5 py-1.5 flex items-center justify-between z-10">
          <div className="flex-1 mr-3">
            <div className="flex items-center justify-between text-[11px] text-white/90 font-medium mb-1">
              <span>{course.progress}% {t.complete}</span>
              {course.progress === 100 && (
                <span className="flex items-center gap-0.5 text-emerald-300 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> {t.done}
                </span>
              )}
            </div>
            {/* Orange progress bar matching photo */}
            <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
              <div
                className="bg-ueh-orange h-full rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Three-dot menu button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              aria-label="Tùy chọn khóa học"
              className="w-5 h-5 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-7 w-44 bg-white dark:bg-neutral-800 rounded-md shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 text-xs text-neutral-800 dark:text-neutral-100 z-30 animate-in fade-in zoom-in-95"
              >
                <button
                  onClick={() => {
                    onSelect(course);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{t.viewDetails}</span>
                </button>
                <button
                  onClick={() => {
                    onQuickContinue(course);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 text-ueh-teal dark:text-teal-400 font-medium cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>{t.continueLearning}</span>
                </button>
                {isAdmin && onDelete && (
                  <button
                    onClick={() => {
                      onDelete(course);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 border-t border-neutral-100 dark:border-neutral-700 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa khóa học (Admin)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content below matching the photo */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Instructor & Course Code Subtitle */}
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mb-1">
            {course.instructor}
          </div>
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono truncate mb-1.5">
            {course.code}
          </div>

          {/* Course Title */}
          <h4
            onClick={() => onSelect(course)}
            className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-white line-clamp-2 hover:text-ueh-teal dark:hover:text-teal-400 cursor-pointer leading-snug"
            title={course.title}
          >
            {course.title}
          </h4>
        </div>

        {/* Skills Tag footer */}
        <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-1">
          {course.skillsTaught.slice(0, 2).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded font-medium"
            >
              {skill}
            </span>
          ))}
          {course.skillsTaught.length > 2 && (
            <span className="text-[10px] text-neutral-400 px-1 py-0.5">
              +{course.skillsTaught.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
