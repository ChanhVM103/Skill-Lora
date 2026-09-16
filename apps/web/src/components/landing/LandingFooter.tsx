import React from 'react';
import { BookOpen, ArrowUp, ExternalLink, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { Language } from '../../i18n/translations';

interface LandingFooterProps {
  onNavigateToAuth: () => void;
  language: Language;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigateToAuth, language }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f15a38] text-white font-bold text-sm tracking-wide">
                <BookOpen className="w-4 h-4" />
                <span>Skillora</span>
              </div>
              <span className="text-xs font-mono text-teal-300/80 uppercase tracking-widest">
                Career Companion
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {language === 'vi'
                ? 'Hệ sinh thái học tập và cố vấn sự nghiệp thế hệ mới dành cho sinh viên đại học. Kết nối trực tiếp khoảng trống kỹ năng với các học phần thư viện thực nghiệm.'
                : 'Next-generation learning ecosystem and AI career companion for university students. Bridging curriculum modules with real-world industry demands.'}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Tiêu chuẩn bảo mật dữ liệu sinh viên 2026</span>
            </div>
          </div>

          {/* Quick Nav (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 font-mono">
              {language === 'vi' ? 'Khám Phá Tính Năng' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#scanner" className="hover:text-white transition-colors">
                  {language === 'vi' ? 'Quét CV & Nhận diện điểm yếu (72%)' : 'Interactive CV Scanner'}
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition-colors">
                  {language === 'vi' ? '3 Khóa học bù đắp kỹ năng tuyển dụng' : 'Curated Micro-Courses'}
                </a>
              </li>
              <li>
                <a href="#journey" className="hover:text-white transition-colors">
                  {language === 'vi' ? 'Hành trình phát triển 3 bước' : '3-Step Student Journey'}
                </a>
              </li>
              <li>
                <a href="#feedback" className="hover:text-white transition-colors">
                  {language === 'vi' ? 'Cảm nhận sinh viên & câu chuyện việc làm' : 'Student Success Stories'}
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Portal (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 font-mono">
              {language === 'vi' ? 'Cổng Học Tập Đại Học' : 'LMS University Portal'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {language === 'vi'
                ? 'Truy cập cổng LMS nội bộ để học 12 môn học, làm bài test AI Chatbot và theo dõi Lộ trình 6 tuần.'
                : 'Sign in to access 12 university courses, interactive lesson modal, and 6-week career roadmap.'}
            </p>
            <button
              onClick={onNavigateToAuth}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ueh-teal hover:bg-ueh-darkteal text-white text-xs font-bold shadow-md transition-all"
            >
              <span>{language === 'vi' ? 'Đăng nhập Cổng LMS' : 'Access LMS Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Support / Contact (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs text-neutral-400">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 font-mono">
              {language === 'vi' ? 'Liên Hệ' : 'Contact'}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>hotro@skillora.edu.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 Skillora Learning System. All rights reserved. Phát triển cho sinh viên đại học Việt Nam.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white border border-white/10 transition-colors"
          >
            <span>{language === 'vi' ? 'Lên đầu trang' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
