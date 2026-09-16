import React, { useState } from 'react';
import {
  Bookmark,
  Clock,
  UserCheck,
  ArrowRight,
  Library,
  Award,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { landingCourses } from '../../data/landingData';
import { Language } from '../../i18n/translations';

interface LandingCoursesProps {
  onNavigateToAuth: () => void;
  language: Language;
}

export const LandingCourses: React.FC<LandingCoursesProps> = ({
  onNavigateToAuth,
  language,
}) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['course-data-storytelling']);
  const [toastText, setToastText] = useState<string | null>(null);

  const toggleBookmark = (id: string, courseTitle: string) => {
    setBookmarkedIds((prev) => {
      const isBookmarked = prev.includes(id);
      const next = isBookmarked ? prev.filter((item) => item !== id) : [...prev, id];
      setToastText(
        isBookmarked
          ? (language === 'vi' ? `Đã bỏ lưu: ${courseTitle}` : `Removed bookmark: ${courseTitle}`)
          : (language === 'vi' ? `Đã lưu khóa học vào danh sách: ${courseTitle}` : `Bookmarked: ${courseTitle}`)
      );
      setTimeout(() => setToastText(null), 3000);
      return next;
    });
  };

  return (
    <section id="courses" className="py-20 sm:py-28 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 relative">
      {/* Bookmark Toast Alert */}
      {toastText && (
        <div className="fixed bottom-6 left-6 z-50 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-neutral-700 animate-in fade-in slide-in-from-bottom-5">
          <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{toastText}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-ueh-teal dark:text-teal-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Library className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Học Phần Được Đề Xuất Bù Đắp Kỹ Năng' : 'Bridging Micro-Courses'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {language === 'vi' ? 'Khóa học thiết kế chuẩn đồ án thực tế' : 'Curated Project-Based Courses'}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {language === 'vi'
                ? 'Được tuyển chọn bám sát các điểm yếu phổ biến nhất trong CV sinh viên, giảng dạy bởi các chuyên gia doanh nghiệp và giảng viên đầu ngành.'
                : 'Targeted directly at common student resume weak spots, instructed by senior industry leads and accredited faculty.'}
            </p>
          </div>

          <button
            onClick={onNavigateToAuth}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-neutral-800 hover:bg-ueh-teal hover:text-white text-xs font-bold transition-all shrink-0 self-start md:self-auto shadow-xs"
          >
            <span>{language === 'vi' ? 'Xem toàn bộ 12 môn học LMS' : 'Browse All 12 Modules'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {landingCourses.map((course) => {
            const isBookmarked = bookmarkedIds.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-[#faf9f6] dark:bg-neutral-800/80 rounded-3xl border border-neutral-200 dark:border-neutral-700/70 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  {/* Top Bar: Category & Bookmark Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-neutral-900 text-ueh-teal dark:text-teal-400 border border-neutral-200 dark:border-neutral-700 shadow-xs">
                      {course.category}
                    </span>

                    <button
                      onClick={() => toggleBookmark(course.id, course.title)}
                      className={`p-2 rounded-xl transition-all ${
                        isBookmarked
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-500'
                          : 'bg-white dark:bg-neutral-900 text-neutral-400 hover:text-amber-500'
                      } border border-neutral-200 dark:border-neutral-700 shadow-xs active:scale-90`}
                      title={isBookmarked ? 'Bỏ lưu khóa học' : 'Lưu khóa học'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-ueh-teal dark:group-hover:text-teal-400 transition-colors leading-snug mb-2">
                    {course.title}
                  </h3>

                  {/* Highlight Tag */}
                  <div className="inline-block px-2.5 py-1 rounded-lg bg-orange-100/70 dark:bg-orange-950/40 text-ueh-orange text-[10px] font-bold uppercase tracking-wider mb-3">
                    ★ {course.highlightTag}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {course.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-900 text-[10px] font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700"
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Mentor, Duration & Action Link */}
                <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-700/80 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      <UserCheck className="w-3.5 h-3.5 text-ueh-teal dark:text-teal-400" />
                      <span>{course.mentor}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                      {course.mentorTitle}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </span>

                    <button
                      onClick={onNavigateToAuth}
                      className="text-xs font-bold text-ueh-orange hover:text-[#d4560a] dark:text-orange-400 hover:underline flex items-center gap-1 group/btn"
                    >
                      <span>{language === 'vi' ? 'Khám phá học phần' : 'Explore Course'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* UEH Learning-Library Visual Reference Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#00383f] via-ueh-teal to-[#00525d] text-white p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Art */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-teal-200 uppercase tracking-widest">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>UEH Learning Library Standard • Thư Viện Học Tập Thực Nghiệm</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                {language === 'vi'
                  ? 'Chứng chỉ & Đồ án được công nhận bởi mạng lưới doanh nghiệp'
                  : 'Industry-Recognized Credits & Capstone Lab Projects'}
              </h3>

              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-2xl">
                {language === 'vi'
                  ? 'Mỗi khóa học trên Skillora đều đi kèm đồ án thực hành bám sát tiêu chuẩn phòng Lab mô phỏng thực tế của Đại học Kinh tế TP.HCM (UEH), cho phép sinh viên tích lũy tín chỉ và đưa trực tiếp vào hồ sơ ứng tuyển.'
                  : 'Every course features lab-simulated capstone projects following the UEH university standard, generating verifiably accredited portfolio work.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                  <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Chuẩn hóa đồ án thực nghiệm</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                  <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Tích hợp mã môn LMS thực tế</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                  <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Cố vấn 1-1 từ giảng viên</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <button
                onClick={onNavigateToAuth}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2"
              >
                <span>{language === 'vi' ? 'Vào học ngay trên Cổng LMS' : 'Access UEH LMS Portal'}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-teal-200/80 mt-2 text-center lg:text-right">
                {language === 'vi' ? 'Miễn phí cho sinh viên đang theo học' : 'Free for active university students'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
