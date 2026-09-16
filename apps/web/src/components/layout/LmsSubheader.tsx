import React from 'react';
import { Settings, GraduationCap, FileScan, MessageSquareCode, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import { MainTabType, UserProfile } from '../../types';
import { Language, translations } from '../../i18n/translations';

interface LmsSubheaderProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  totalCoursesCount: number;
  hasCvAnalysis: boolean;
  language: Language;
  onOpenCustomize: () => void;
  user?: UserProfile | null;
}

export const LmsSubheader: React.FC<LmsSubheaderProps> = ({
  activeTab,
  onTabChange,
  totalCoursesCount,
  hasCvAnalysis,
  language,
  onOpenCustomize,
  user,
}) => {
  const t = translations[language];

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      {/* Main Educational Feature Tabs */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* Tab 1: Quét CV & Đánh giá Năng Lực (Chủ đạo) */}
            <button
              onClick={() => onTabChange('cv-scanner')}
              className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 transition-all shrink-0 relative ${
                activeTab === 'cv-scanner'
                  ? 'border-ueh-orange text-ueh-orange bg-orange-50/50 dark:bg-orange-950/30 rounded-t-md font-bold'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300'
              }`}
            >
              <FileScan className="w-4 h-4" />
              <span>{t.cvScanner}</span>
              <span className="flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-medium animate-pulse">
                <Sparkles className="w-3 h-3 text-ueh-orange" />
                {hasCvAnalysis ? t.analyzed : t.aiMatcher}
              </span>
            </button>

            {/* Tab 2: Khóa học của tôi */}
            <button
              onClick={() => onTabChange('courses')}
              className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 transition-all shrink-0 ${
                activeTab === 'courses'
                  ? 'border-ueh-teal text-ueh-teal dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30 rounded-t-md'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t.myCourses}</span>
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-normal">
                {totalCoursesCount}
              </span>
            </button>

            {/* Tab 3: Đánh giá Kỹ năng AI (Chat) */}
            <button
              onClick={() => onTabChange('assessment')}
              className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 transition-all shrink-0 ${
                activeTab === 'assessment'
                  ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 rounded-t-md'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300'
              }`}
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>{t.aiAssessment}</span>
            </button>

            {/* Tab 4: Lộ trình Cá nhân hóa */}
            <button
              onClick={() => onTabChange('roadmap')}
              className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 transition-all shrink-0 ${
                activeTab === 'roadmap'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-t-md'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300'
              }`}
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Tab 5: Quản trị Admin (Chỉ hiển thị cho tài khoản Quản trị viên - role: admin) */}
            {user?.role === 'admin' && (
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 transition-all shrink-0 ${
                  activeTab === 'admin'
                    ? 'border-rose-600 text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 rounded-t-md font-bold'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span>Quản Trị Admin</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-mono">
                  Portal
                </span>
              </button>
            )}
          </div>

          {/* Action button "Tùy chỉnh trang này" with click handler to open customize modal */}
          <button
            onClick={onOpenCustomize}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-ueh-green hover:bg-[#729e37] text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 shrink-0 mb-1 hover:shadow"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t.customisePage}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
