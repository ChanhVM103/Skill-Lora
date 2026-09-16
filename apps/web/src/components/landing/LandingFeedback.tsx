import React from 'react';
import { Star, Quote, TrendingUp, Building2 } from 'lucide-react';
import { studentFeedbacks } from '../../data/landingData';
import { Language } from '../../i18n/translations';

interface LandingFeedbackProps {
  language: Language;
}

export const LandingFeedback: React.FC<LandingFeedbackProps> = ({ language }) => {
  return (
    <section id="feedback" className="py-20 sm:py-28 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{language === 'vi' ? 'Cảm Nhận Từ Sinh Viên & Cựu Sinh Viên' : 'Student & Alumni Stories'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {language === 'vi' ? 'Hơn 2,500 sinh viên đã sẵn sàng bứt phá' : 'Trusted by 2,500+ Future Leaders'}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {language === 'vi'
              ? 'Lắng nghe chia sẻ thực tế từ các bạn sinh viên đã cải thiện CV và thành công chinh phục các vị trí thực tập, việc làm tại các tập đoàn hàng đầu.'
              : 'Real feedback from students who transformed their resumes and secured roles at top tech and business firms.'}
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {studentFeedbacks.map((item) => (
            <div
              key={item.id}
              className="bg-[#faf9f6] dark:bg-neutral-800/80 rounded-3xl border border-neutral-200 dark:border-neutral-700/70 p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
            >
              {/* Subtle Quote Icon Watermark */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-neutral-300 dark:text-neutral-700/50 -rotate-12 group-hover:text-amber-500/30 transition-colors" />

              <div className="space-y-4 relative z-10">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                  {item.quote}
                </p>

                {/* Score Growth Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Điểm CV: {item.cvScoreBefore}% ➔ {item.cvScoreAfter}%</span>
                </div>
              </div>

              {/* Student Info Footer */}
              <div className="pt-6 mt-6 border-t border-neutral-200/80 dark:border-neutral-700/80 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-ueh-teal/40"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {item.faculty} • {item.university}
                  </div>
                  <div className="text-[11px] font-semibold text-ueh-orange dark:text-orange-400 truncate flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span>{item.roleWon} @ {item.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Social Proof Numbers Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-neutral-800">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'vi' ? 'Sẵn sàng nâng tầm hồ sơ của chính bạn?' : 'Ready to Transform Your Resume?'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              {language === 'vi'
                ? 'Tham gia cộng đồng sinh viên Skillora ngay hôm nay để nhận đánh giá năng lực chi tiết.'
                : 'Join the Skillora student community today for comprehensive AI assessment.'}
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-10 shrink-0">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">98%</div>
              <div className="text-[11px] text-neutral-400">Tăng điểm sau 2 tuần</div>
            </div>
            <div className="w-px h-10 bg-neutral-700" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">500+</div>
              <div className="text-[11px] text-neutral-400">Offer việc làm & thực tập</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
