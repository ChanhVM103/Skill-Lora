import React, { useState, useEffect } from 'react';
import { BookOpen, Globe, Sun, Moon, LogIn, Menu, X } from 'lucide-react';
import { Language, ThemeMode } from '../../i18n/translations';

interface LandingNavbarProps {
  onNavigateToAuth: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onNavigateToAuth,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 dark:bg-black/85 backdrop-blur-md border-b border-white/10 shadow-lg py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f15a38] text-white font-black text-sm tracking-wide shadow-md group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
            <span>Skillora</span>
          </div>
          <span className="hidden md:inline text-[11px] font-mono tracking-widest text-teal-200/80 uppercase">
            Career Companion
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90">
          <button
            onClick={() => scrollToSection('courses')}
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            {language === 'vi' ? 'Khóa học đề xuất' : 'Courses'}
          </button>
          <button
            onClick={() => scrollToSection('journey')}
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            {language === 'vi' ? 'Hành trình 3 bước' : 'Journey'}
          </button>
          <button
            onClick={() => scrollToSection('feedback')}
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            {language === 'vi' ? 'Cảm nhận sinh viên' : 'Testimonials'}
          </button>
        </nav>

        {/* Right Controls: Language, Theme & Login Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 backdrop-blur-sm transition-all"
            title="Chuyển đổi ngôn ngữ"
          >
            <Globe className="w-3.5 h-3.5 text-teal-300" />
            <span>{language === 'vi' ? '🇻🇳 VN' : '🇬🇧 EN'}</span>
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-all"
            title={theme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-amber-200" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Login Button (CTA to Auth) */}
          <button
            onClick={onNavigateToAuth}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f15a38] to-[#e04a28] hover:from-[#e04a28] hover:to-[#f15a38] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>{language === 'vi' ? 'Đăng nhập Cổng LMS' : 'Portal Sign In'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 text-white border border-white/15"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 dark:bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-2 mt-2">
          <button
            onClick={() => scrollToSection('courses')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm text-white/90 hover:bg-white/10"
          >
            📚 {language === 'vi' ? 'Khóa học đề xuất' : 'Courses'}
          </button>
          <button
            onClick={() => scrollToSection('journey')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm text-white/90 hover:bg-white/10"
          >
            🗺️ {language === 'vi' ? 'Hành trình 3 bước' : 'Journey'}
          </button>
          <button
            onClick={() => scrollToSection('feedback')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm text-white/90 hover:bg-white/10"
          >
            ⭐ {language === 'vi' ? 'Cảm nhận sinh viên' : 'Testimonials'}
          </button>
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth();
              }}
              className="w-full py-2.5 rounded-xl bg-ueh-orange text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'vi' ? 'Đăng nhập Cổng LMS' : 'Portal Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
