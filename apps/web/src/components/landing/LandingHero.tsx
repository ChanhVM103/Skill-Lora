import React from 'react';
import { Sparkles, ArrowRight, GraduationCap } from 'lucide-react';
import { Language } from '../../i18n/translations';

interface LandingHeroProps {
  onStartScan: () => void;
  onNavigateToAuth: () => void;
  language: Language;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartScan,
  onNavigateToAuth,
  language,
}) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-end overflow-hidden bg-slate-950 text-white pt-24 pb-16 sm:pb-20">
      {/* Background Image / Video Backdrop with Cinematic Treatment */}
      <div className="absolute inset-0 z-0">
        {/* Photographic background of focused university students in modern library/tech lab */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&auto=format&fit=crop&q=80"
          alt="Sinh viên học tập và nghiên cứu"
          className="w-full h-full object-cover object-center scale-105 animate-in fade-in zoom-in-95 duration-1000 opacity-35"
        />

        {/* Multi-layered Dark Teal Overlays for Deep Readability & Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f24] via-[#002f35]/90 to-[#001f24]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f24] via-[#002b31]/80 to-transparent" />

        {/* Ambient Subtle Radial Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Hero Content: Positioned Bottom-Left with Editorial Serif Typography */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6">
        <div className="max-w-3xl space-y-6">
          {/* Editorial Mono Category Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-200 text-xs font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'vi'
                ? 'Skillora • Bạn Đồng Hành Sự Nghiệp Sinh Viên'
                : 'Skillora • University Career Companion'}
            </span>
          </div>

          {/* Bold Editorial Serif Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-white">
            {language === 'vi' ? (
              <>
                Đừng để CV <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 italic">
                  bỏ sót bạn.
                </span>
              </>
            ) : (
              <>
                Don&apos;t let your CV <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 italic">
                  leave you behind.
                </span>
              </>
            )}
          </h1>

          {/* Concise Humanist Sans Supporting Copy */}
          <p className="text-base sm:text-lg lg:text-xl text-teal-100/90 font-normal leading-relaxed max-w-2xl">
            {language === 'vi'
              ? 'Thấu hiểu năng lực thực tế, phát hiện các điểm thiếu sót trong hồ sơ và kết nối trực tiếp với học phần đào tạo chuẩn đại học để tự tin chinh phục nhà tuyển dụng.'
              : 'Understand your real strengths, detect missing resume sections, and directly bridge competency gaps through accredited university micro-courses.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={onStartScan}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#f15a38] via-[#e04a28] to-[#c93d1d] hover:brightness-110 text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-600/30 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>{language === 'vi' ? 'Bắt đầu quét CV ngay' : 'Start CV Scan Now'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onNavigateToAuth}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all hover:scale-[1.01] active:scale-95"
            >
              <GraduationCap className="w-5 h-5 text-teal-300" />
              <span>{language === 'vi' ? 'Đăng nhập Cổng học tập LMS' : 'Access LMS Portal'}</span>
            </button>
          </div>

          {/* Trust Metric Badges */}
          <div className="pt-8 sm:pt-10 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/15 max-w-2xl">
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">2,500+</div>
              <div className="text-xs sm:text-sm text-teal-100/75">
                {language === 'vi' ? 'Sinh viên đại học tin dùng' : 'Students Enrolled'}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">84%</div>
              <div className="text-xs sm:text-sm text-teal-100/75">
                {language === 'vi' ? 'Tỷ lệ vượt qua vòng CV' : 'Interview Rate'}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-teal-300 font-mono">12+</div>
              <div className="text-xs sm:text-sm text-teal-100/75">
                {language === 'vi' ? 'Học phần chuẩn thực nghiệm' : 'Curated Modules'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
