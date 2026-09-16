import React, { useState } from 'react';
import { Calendar as CalendarIcon, FolderTree, ChevronDown, ChevronRight, FileUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Course } from '../../types';
import { Language, translations } from '../../i18n/translations';

interface LmsSidebarProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onNavigateToCvScan: () => void;
  hasCvAnalysis: boolean;
  language: Language;
}

export const LmsSidebar: React.FC<LmsSidebarProps> = ({
  courses,
  onSelectCourse,
  onNavigateToCvScan,
  hasCvAnalysis,
  language,
}) => {
  const [coursesTreeExpanded, setCoursesTreeExpanded] = useState(true);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(15);

  const t = translations[language];

  // Calendar dates for September 2026 (Starts on Tuesday = T3)
  const calendarDays = [
    { day: null }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
    { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 },
    { day: 14 }, { day: 15, isToday: true, hasEvent: t.todayEvent }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19, isSpecial: true, hasEvent: t.examEvent }, { day: 20 },
    { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 },
    { day: 28 }, { day: 29 }, { day: 30 }, { day: null }, { day: null }, { day: null }, { day: null },
  ];

  return (
    <aside className="w-full space-y-5">
      {/* Widget 1: Quick CV Scan / Matcher Promo (Chủ đạo) */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800/90 rounded-lg border-2 border-ueh-orange/30 dark:border-orange-500/30 p-3.5 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{t.quickCvScanTitle}</h4>
            <p className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">{t.quickCvScanSub}</p>
          </div>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3 leading-relaxed">
          {t.quickCvScanDesc}
        </p>

        <button
          onClick={onNavigateToCvScan}
          className="w-full py-2 px-3 bg-ueh-orange hover:bg-[#e05f12] text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>{hasCvAnalysis ? t.viewAnalysisResult : t.scanNow}</span>
        </button>

        {hasCvAnalysis && (
          <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.cvMatchedCheck}</span>
          </div>
        )}
      </div>

      {/* Widget 2: Điều hướng */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="bg-[#f8f9fa] dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#e85834] flex items-center justify-center text-white">
            <FolderTree className="w-3 h-3" />
          </div>
          <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 tracking-wide uppercase">
            {t.navigation}
          </h3>
        </div>

        <div className="p-3 text-xs text-neutral-700 dark:text-neutral-300 space-y-1.5 font-normal">
          <div className="text-neutral-500 dark:text-neutral-400 hover:text-ueh-teal dark:hover:text-teal-400 cursor-pointer py-1">
            {t.dashboard}
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 hover:text-ueh-teal dark:hover:text-teal-400 cursor-pointer py-0.5">
            <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
            <span>{t.siteHome}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 hover:text-ueh-teal dark:hover:text-teal-400 cursor-pointer py-0.5">
            <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
            <span>{t.sitePages}</span>
          </div>

          {/* Expandable "Các khoá học của tôi" */}
          <div className="pt-1">
            <div
              onClick={() => setCoursesTreeExpanded(!coursesTreeExpanded)}
              className="flex items-center justify-between cursor-pointer font-semibold text-neutral-900 dark:text-white hover:text-ueh-teal dark:hover:text-teal-400 py-1"
            >
              <div className="flex items-center gap-1.5">
                {coursesTreeExpanded ? (
                  <ChevronDown className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                )}
                <span>{t.myCoursesTree}</span>
              </div>
              <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.2 rounded font-normal">
                {courses.length}
              </span>
            </div>

            {coursesTreeExpanded && (
              <div className="pl-4 pt-1 space-y-1 border-l-2 border-neutral-100 dark:border-neutral-800 ml-1.5">
                {courses.slice(0, 7).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectCourse(c)}
                    className="flex items-start gap-1.5 py-1 text-neutral-600 dark:text-neutral-400 hover:text-ueh-teal dark:hover:text-teal-400 cursor-pointer group"
                  >
                    <span className="text-neutral-300 dark:text-neutral-600 group-hover:text-ueh-orange text-[10px] mt-0.5">▸</span>
                    <span className="truncate group-hover:underline text-[11px]" title={c.title}>
                      {c.code.slice(0, 24)}...
                    </span>
                  </div>
                ))}
                <div
                  onClick={() => setCoursesTreeExpanded(true)}
                  className="text-[11px] text-ueh-teal dark:text-teal-400 font-medium hover:underline cursor-pointer pt-1"
                >
                  {t.viewMore}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget 3: Lịch */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="bg-[#f8f9fa] dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#0284c7] flex items-center justify-center text-white">
            <CalendarIcon className="w-3 h-3" />
          </div>
          <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 tracking-wide uppercase">
            {t.calendar}
          </h3>
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            <span className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer">◀</span>
            <span className="text-ueh-teal dark:text-teal-400">September 2026</span>
            <span className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer">▶</span>
          </div>

          <div className="grid grid-cols-7 text-center text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            <span>{language === 'vi' ? 'T2' : 'Mon'}</span>
            <span>{language === 'vi' ? 'T3' : 'Tue'}</span>
            <span>{language === 'vi' ? 'T4' : 'Wed'}</span>
            <span>{language === 'vi' ? 'T5' : 'Thu'}</span>
            <span>{language === 'vi' ? 'T6' : 'Fri'}</span>
            <span>{language === 'vi' ? 'T7' : 'Sat'}</span>
            <span>{language === 'vi' ? 'CN' : 'Sun'}</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((item, idx) => {
              if (item.day === null) {
                return <div key={idx} className="h-6"></div>;
              }

              const isSelected = selectedCalendarDate === item.day;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCalendarDate(item.day)}
                  title={item.hasEvent || `Day ${item.day}/09/2026`}
                  className={`h-6 w-full rounded flex items-center justify-center text-[11px] transition-all relative ${
                    item.isSpecial
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold ring-1 ring-orange-400'
                      : item.isToday
                      ? 'bg-ueh-teal text-white font-bold shadow-xs'
                      : isSelected
                      ? 'bg-neutral-200 dark:bg-neutral-700 font-semibold text-neutral-900 dark:text-white'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {item.day}
                  {item.hasEvent && !item.isSpecial && !item.isToday && (
                    <span className="absolute bottom-0.5 w-1 h-1 bg-ueh-orange rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ueh-teal shrink-0"></span>
              <span>{t.todayEvent}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0"></span>
              <span>{t.examEvent}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
