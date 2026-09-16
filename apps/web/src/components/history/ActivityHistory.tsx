import React, { useState, useMemo } from 'react';
import {
  History,
  FileScan,
  BookOpen,
  Award,
  Sparkles,
  Trash2,
  ArrowRight,
  Clock,
  CheckCircle2,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { ActivityLogItem, ActivityType, Course, MainTabType } from '../../types';
import { Language, translations } from '../../i18n/translations';

interface ActivityHistoryProps {
  history: ActivityLogItem[];
  onClearHistory: () => void;
  onNavigateToTab: (tab: MainTabType) => void;
  onSelectCourse?: (course: Course) => void;
  onSelectHistoryItem?: (item: ActivityLogItem) => void;
  allCourses?: Course[];
  language: Language;
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  history,
  onClearHistory,
  onNavigateToTab,
  onSelectCourse,
  onSelectHistoryItem,
  allCourses = [],
  language,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | ActivityType>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const t = translations[language];

  const filteredHistory = useMemo(() => {
    if (activeFilter === 'all') return history;
    return history.filter((item) => item.type === activeFilter);
  }, [history, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: history.length,
      cv_scan: history.filter((i) => i.type === 'cv_scan').length,
      lesson_complete: history.filter((i) => i.type === 'lesson_complete' || i.type === 'quiz_attempt').length,
      assessment_submit: history.filter((i) => i.type === 'assessment_submit').length,
      page_visit: history.filter((i) => i.type === 'page_visit').length,
    };
  }, [history]);

  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'cv_scan':
        return {
          icon: <FileScan className="w-4 h-4 text-ueh-orange" />,
          bg: 'bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800/80',
          badgeText: language === 'vi' ? 'Quét CV & Kỹ năng' : 'CV Scan',
          badgeClass: 'bg-orange-100 dark:bg-orange-900/60 text-ueh-orange font-bold',
        };
      case 'lesson_complete':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          bg: 'bg-emerald-50/60 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/80',
          badgeText: language === 'vi' ? 'Học phần LMS' : 'LMS Lesson',
          badgeClass: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold',
        };
      case 'quiz_attempt':
        return {
          icon: <Award className="w-4 h-4 text-amber-500" />,
          bg: 'bg-amber-50/60 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/80',
          badgeText: language === 'vi' ? 'Mini Quiz' : 'Quiz Attempt',
          badgeClass: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-semibold',
        };
      case 'assessment_submit':
        return {
          icon: <Sparkles className="w-4 h-4 text-sky-500" />,
          bg: 'bg-sky-50/60 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800/80',
          badgeText: language === 'vi' ? 'Đánh giá AI' : 'AI Assessment',
          badgeClass: 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 font-semibold',
        };
      case 'page_visit':
      default:
        return {
          icon: <Compass className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />,
          bg: 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700',
          badgeText: language === 'vi' ? 'Xem trang' : 'Page Visit',
          badgeClass: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium',
        };
    }
  };

  const handleActionClick = (item: ActivityLogItem) => {
    if (onSelectHistoryItem) {
      onSelectHistoryItem(item);
      return;
    }
    if (item.type === 'cv_scan') {
      onNavigateToTab('cv-scanner');
    } else if (item.type === 'lesson_complete' || item.type === 'quiz_attempt') {
      if (item.metadata?.courseId && onSelectCourse) {
        const found = allCourses.find((c) => c.id === item.metadata?.courseId);
        if (found) {
          onSelectCourse(found);
          return;
        }
      }
      onNavigateToTab('courses');
    } else if (item.type === 'assessment_submit') {
      onNavigateToTab('assessment');
    } else if (item.metadata?.tabName) {
      onNavigateToTab(item.metadata.tabName as MainTabType);
    } else {
      onNavigateToTab('cv-scanner');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-7 shadow-sm transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ueh-teal to-teal-400 text-white flex items-center justify-center shadow-md shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {t.activityHistory || 'Lịch Sử Web & Nhật Ký Hoạt Động'}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/70 text-ueh-teal dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {history.length} {language === 'vi' ? 'sự kiện' : 'events'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {t.historyDesc}
              </p>
            </div>
          </div>

          {/* Action buttons: Clear History */}
          {history.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title={t.clearAllHistory}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearAllHistory}</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-ueh-teal text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <span>{t.historyFilterAll}</span>
            <span className="text-[10px] opacity-80 font-mono">({counts.all})</span>
          </button>

          <button
            onClick={() => setActiveFilter('cv_scan')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'cv_scan'
                ? 'bg-ueh-orange text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <FileScan className="w-3.5 h-3.5 text-ueh-orange" />
            <span>{t.filterCv}</span>
            <span className="text-[10px] opacity-80 font-mono">({counts.cv_scan})</span>
          </button>

          <button
            onClick={() => setActiveFilter('lesson_complete')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'lesson_complete'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.filterLesson}</span>
            <span className="text-[10px] opacity-80 font-mono">({counts.lesson_complete})</span>
          </button>

          <button
            onClick={() => setActiveFilter('assessment_submit')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'assessment_submit'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>{t.filterAssessment}</span>
            <span className="text-[10px] opacity-80 font-mono">({counts.assessment_submit})</span>
          </button>

          <button
            onClick={() => setActiveFilter('page_visit')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'page_visit'
                ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-neutral-500" />
            <span>{t.filterVisit}</span>
            <span className="text-[10px] opacity-80 font-mono">({counts.page_visit})</span>
          </button>
        </div>
      </div>

      {/* 2. Clear History Confirm Dialog */}
      {showClearConfirm && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                {t.clearHistoryConfirm}
              </p>
              <p className="text-[11px] text-rose-700 dark:text-rose-300">
                {language === 'vi'
                  ? 'Hành động này sẽ dọn sạch toàn bộ các sự kiện lưu trong trình duyệt của bạn.'
                  : 'This action will wipe all history events saved in your current browser session.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 bg-white dark:bg-neutral-800 hover:bg-neutral-100 text-neutral-700 dark:text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer"
            >
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              onClick={() => {
                onClearHistory();
                setShowClearConfirm(false);
              }}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              {language === 'vi' ? 'Đồng ý xóa' : 'Yes, Clear All'}
            </button>
          </div>
        </div>
      )}

      {/* 3. Timeline Items List */}
      {filteredHistory.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
          {filteredHistory.map((item) => {
            const badge = getActivityBadge(item.type);

            return (
              <div
                key={item.id}
                className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all group"
              >
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-[30px] sm:-left-[38px] top-4 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-sm ${badge.bg}`}
                >
                  {badge.icon}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Top Row: Type Pill & Timestamp */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider ${badge.badgeClass}`}>
                        {badge.badgeText}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{item.timestamp}</span>
                      </span>

                      {item.metadata?.score !== undefined && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          ★ {item.metadata.score}/100 {language === 'vi' ? 'Điểm' : 'pts'}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata Details */}
                    {item.metadata?.targetRole && (
                      <div className="pt-1 text-[11px] text-ueh-teal dark:text-teal-400 font-semibold flex items-center gap-1">
                        <span>🎯 {language === 'vi' ? 'Vị trí mục tiêu:' : 'Target:'}</span>
                        <span>{item.metadata.targetRole}</span>
                      </div>
                    )}
                    {item.metadata?.courseTitle && (
                      <div className="pt-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                        📚 {item.metadata.courseTitle}
                      </div>
                    )}
                  </div>

                  {/* Right Action Button */}
                  <div className="shrink-0 pt-1">
                    <button
                      onClick={() => handleActionClick(item)}
                      className="w-full sm:w-auto px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-ueh-teal hover:text-white dark:hover:bg-ueh-teal text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs group cursor-pointer"
                    >
                      <span>{t.actionReview || 'Xem lại'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 mx-auto flex items-center justify-center">
            <History className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {t.noHistoryTitle}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              {t.noHistoryDesc}
            </p>
          </div>
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="px-4 py-2 bg-ueh-teal hover:bg-ueh-darkteal text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {language === 'vi' ? 'Xem tất cả hoạt động' : 'View all activities'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
