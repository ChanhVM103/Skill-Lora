import React from 'react';
import { FileUp, Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { journeySteps } from '../../data/landingData';
import { Language } from '../../i18n/translations';

interface LandingJourneyProps {
  onStartScan: () => void;
  language: Language;
}

export const LandingJourney: React.FC<LandingJourneyProps> = ({ onStartScan, language }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileUp':
        return <FileUp className="w-6 h-6 text-ueh-teal dark:text-teal-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-ueh-orange dark:text-orange-400" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section id="journey" className="py-20 sm:py-28 bg-[#faf9f6] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-ueh-teal dark:text-teal-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Lộ Trình Tinh Gọn 3 Bước' : '3-Step Career Transformation'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {language === 'vi' ? 'Hành trình từ CV đến việc làm mơ ước' : 'From Rough Draft to Dream Offer'}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {language === 'vi'
              ? 'Quy trình khoa học đã được kiểm chứng qua hơn 2,500 sinh viên, giúp bạn tự tin mở khóa tiềm năng và định hình tương lai.'
              : 'A proven methodology tested with 2,500+ university students to bridge your skill gap.'}
          </p>
        </div>

        {/* 3 Step Cards with Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {journeySteps.map((stepItem) => (
            <div
              key={stepItem.step}
              className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group"
            >
              {/* Step Number Monospace Watermark */}
              <div className="absolute top-6 right-6 text-5xl sm:text-6xl font-mono font-black text-neutral-200/70 dark:text-neutral-800 group-hover:text-teal-500/20 transition-colors select-none">
                0{stepItem.step}
              </div>

              <div className="space-y-4 relative z-10">
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  {getIcon(stepItem.iconName)}
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-ueh-teal dark:text-teal-400">
                    Bước 0{stepItem.step}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {stepItem.title}
                  </h3>
                  <div className="text-xs font-semibold text-ueh-orange dark:text-orange-400">
                    {stepItem.tagline}
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {stepItem.description}
                </p>
              </div>

              {/* Action Hint */}
              <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{stepItem.actionHint}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to start scan */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartScan}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-ueh-teal hover:bg-ueh-darkteal text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <span>{language === 'vi' ? 'Bắt đầu bước 1: Quét CV ngay' : 'Begin Step 1: Scan Your CV'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
