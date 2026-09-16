import React from 'react';
import {
  FileScan,
  GraduationCap,
  MessageSquareCode,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { MainTabType } from '../../types';
import { Language } from '../../i18n/translations';

interface WorkflowStepperProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  hasCvAnalysis: boolean;
  hasCompletedAssessment?: boolean;
  language: Language;
}

interface StepItem {
  id: MainTabType;
  stepNumber: number;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  icon: React.ReactNode;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  activeTab,
  onTabChange,
  hasCvAnalysis,
  hasCompletedAssessment = false,
  language,
}) => {
  const steps: StepItem[] = [
    {
      id: 'cv-scanner',
      stepNumber: 1,
      titleVi: 'Quét & Phân tích CV',
      titleEn: 'Scan & Analyze CV',
      descVi: 'Trích xuất kỹ năng & khoảng trống',
      descEn: 'Extract skills & gaps',
      icon: <FileScan className="w-4 h-4" />,
    },
    {
      id: 'courses',
      stepNumber: 2,
      titleVi: 'Học phần LMS Gợi ý',
      titleEn: 'Suggested LMS Courses',
      descVi: 'Khóa học bù đắp kiến thức',
      descEn: 'Bridge skill deficiencies',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'assessment',
      stepNumber: 3,
      titleVi: 'Đánh giá Năng lực AI',
      titleEn: 'AI Skill Assessment',
      descVi: 'Quiz & phỏng vấn tương tác',
      descEn: 'Interactive quiz & interview',
      icon: <MessageSquareCode className="w-4 h-4" />,
    },
    {
      id: 'roadmap',
      stepNumber: 4,
      titleVi: 'Lộ trình Nghề nghiệp',
      titleEn: 'Career Roadmap',
      descVi: 'Mục tiêu & kế hoạch 6 tuần',
      descEn: '6-week targeted roadmap',
      icon: <Compass className="w-4 h-4" />,
    },
  ];

  const getCurrentStepIndex = () => {
    switch (activeTab) {
      case 'cv-scanner':
        return 0;
      case 'courses':
        return 1;
      case 'assessment':
        return 2;
      case 'roadmap':
        return 3;
      default:
        return 0;
    }
  };

  const currentIdx = getCurrentStepIndex();

  const isStepCompleted = (idx: number) => {
    if (idx === 0) return hasCvAnalysis;
    if (idx === 1) return hasCvAnalysis && currentIdx > 1;
    if (idx === 2) return hasCompletedAssessment || currentIdx > 2;
    if (idx === 3) return currentIdx === 3;
    return false;
  };

  const getNextTab = (): MainTabType | null => {
    if (currentIdx === 0) return 'courses';
    if (currentIdx === 1) return 'assessment';
    if (currentIdx === 2) return 'roadmap';
    return null;
  };

  const nextTab = getNextTab();

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 shadow-sm transition-colors duration-200 mb-6">
      {/* Header bar of Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-ueh-orange flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{language === 'vi' ? 'Quy trình Học tập & Nâng cao Kỹ năng' : 'Skillora Learning & Upskilling Workflow'}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 text-ueh-orange border border-orange-200/60 dark:border-orange-800/60">
                {language === 'vi' ? `Bước ${currentIdx + 1}/4` : `Step ${currentIdx + 1}/4`}
              </span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {language === 'vi'
                ? 'Theo dõi tiến trình từ Quét CV, Đối soát môn học đến Đánh giá AI và Lộ trình nghề nghiệp'
                : 'Follow the guided path from CV Scan to LMS Matching, AI Testing, and Career Roadmap'}
            </p>
          </div>
        </div>

        {/* Quick action buttons for workflow navigation */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {nextTab && (
            <button
              onClick={() => onTabChange(nextTab)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-ueh-orange hover:bg-[#e05f12] text-white text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{language === 'vi' ? 'Bước kế tiếp' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentIdx === 3 && (
            <button
              onClick={() => onTabChange('cv-scanner')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'vi' ? 'Quét lại CV' : 'Scan Again'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Interactive Steps Timeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
        {steps.map((step, idx) => {
          const isActive = activeTab === step.id;
          const isCompleted = isStepCompleted(idx);

          return (
            <div
              key={step.id}
              onClick={() => onTabChange(step.id)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-b from-orange-50/80 to-amber-50/40 dark:from-orange-950/40 dark:to-neutral-900 border-ueh-orange ring-2 ring-orange-500/20 shadow-sm'
                  : isCompleted
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/80 hover:border-emerald-400'
                  : 'bg-neutral-50/70 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {/* Step badge */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isActive
                      ? 'bg-ueh-orange text-white ring-2 ring-orange-400/40'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                </span>

                <div className="p-1 rounded-lg text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
                  {step.icon}
                </div>
              </div>

              <div>
                <h4
                  className={`text-xs font-bold leading-tight ${
                    isActive
                      ? 'text-neutral-900 dark:text-white'
                      : isCompleted
                      ? 'text-emerald-900 dark:text-emerald-300'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {language === 'vi' ? step.titleVi : step.titleEn}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                  {language === 'vi' ? step.descVi : step.descEn}
                </p>
              </div>

              {/* Active bottom accent bar */}
              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-ueh-orange rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
