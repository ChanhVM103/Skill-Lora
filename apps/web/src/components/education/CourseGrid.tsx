import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, ArrowUpDown, LayoutGrid, List, Filter, Search, Award, ChevronLeft, ChevronRight, ArrowRight, PlusCircle, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Course } from '../../types';
import { CourseCard } from './CourseCard';
import { Language, translations } from '../../i18n/translations';

interface CourseGridProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onQuickContinue: (course: Course) => void;
  onOpenCvTab: () => void;
  onGoToAssessment?: () => void;
  onOpenAddResource?: () => void;
  isAdmin?: boolean;
  onDeleteCourse?: (courseId: string) => void;
  language?: Language;
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  onSelectCourse,
  onQuickContinue,
  onOpenCvTab,
  onGoToAssessment,
  onOpenAddResource,
  isAdmin = false,
  onDeleteCourse,
  language = 'vi',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-progress' | 'completed' | 'cv-recommended'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress'>('name');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [confirmDeleteCourse, setConfirmDeleteCourse] = useState<Course | null>(null);

  const ITEMS_PER_PAGE = 8;
  const t = translations[language];

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Filter by tab
    if (activeFilter === 'in-progress') {
      result = result.filter((c) => c.progress > 0 && c.progress < 100);
    } else if (activeFilter === 'completed') {
      result = result.filter((c) => c.progress === 100);
    } else if (activeFilter === 'cv-recommended') {
      result = result.filter((c) => c.isRecommendedFromCv);
    }

    // Search query
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.skillsTaught.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'progress') {
      result.sort((a, b) => b.progress - a.progress);
    }

    return result;
  }, [courses, activeFilter, searchFilter, sortBy]);

  // Reset page to 0 when filters or search change
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter, searchFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages - 1);

  const paginatedCourses = useMemo(() => {
    const start = safePage * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, safePage]);

  const recommendedCount = courses.filter((c) => c.isRecommendedFromCv).length;

  const handleNextPage = () => {
    if (safePage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (safePage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Guided Workflow Banner for Step 2 */}
      {recommendedCount > 0 && (
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-teal-600/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold flex items-center gap-1.5">
                <span>{language === 'vi' ? 'Bước 2/4: Đối Soát Học Phần Hoàn Tất' : 'Step 2/4: Course Matching Completed'}</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-[10px] border border-teal-300/30">
                  {recommendedCount} môn đề xuất từ CV
                </span>
              </h4>
              <p className="text-[11px] text-teal-100 mt-0.5">
                {language === 'vi'
                  ? 'Học phần đã được gắn nhãn theo khoảng trống kỹ năng CV. Sẵn sàng kiểm tra năng lực với AI?'
                  : 'Courses have been matched to your CV skill gaps. Ready to test skills with AI?'}
              </p>
            </div>
          </div>
          {onGoToAssessment && (
            <button
              onClick={onGoToAssessment}
              className="px-3.5 py-1.5 rounded-lg bg-ueh-orange hover:bg-[#e05f12] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <span>{language === 'vi' ? 'Sang Bước 3: Đánh giá AI' : 'Step 3: AI Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Top Banner Title Matching Photo */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          {/* Orange Star/Asterisk Badge Icon matching photo */}
          <div className="w-6 h-6 rounded bg-[#ea580c] flex items-center justify-center text-white font-bold text-sm shadow-xs">
            ★
          </div>
          <h2 className="text-base font-bold text-neutral-800 dark:text-white tracking-tight">
            {t.courseOverview}
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search input in course grid */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={t.searchCoursePlaceholder}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-ueh-teal"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          </div>

          {isAdmin && onOpenAddResource && (
            <button
              onClick={onOpenAddResource}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-semibold rounded-md shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer shrink-0"
              title="Chỉ Quản trị viên (Admin) mới có quyền thêm khóa học hoặc tài nguyên"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">+ Thêm Khóa Học</span>
              <span className="xs:hidden">+ Thêm</span>
              <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded font-mono font-bold">Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Control Bar with Authentic Green Buttons matching photo */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xs transition-colors duration-200">
        {/* Left: Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Main green filter button from photo */}
          <div className="relative inline-block">
            <button
              onClick={() => setActiveFilter(activeFilter === 'all' ? 'in-progress' : 'all')}
              className="px-3 py-1.5 bg-[#7cb342] hover:bg-[#689f38] text-white font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t.filterAll}</span>
              <span className="text-[10px]">▼</span>
            </button>
          </div>

          {/* Tab buttons for quick filtering */}
          <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded p-0.5 bg-neutral-50 dark:bg-neutral-800 text-[11px] font-medium">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${activeFilter === 'all'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              {t.filterTabAll} ({courses.length})
            </button>
            <button
              onClick={() => setActiveFilter('in-progress')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${activeFilter === 'in-progress'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              {t.filterTabInProgress}
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${activeFilter === 'completed'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              {t.filterTabCompleted}
            </button>
            <button
              onClick={() => setActiveFilter('cv-recommended')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${activeFilter === 'cv-recommended'
                ? 'bg-orange-500 text-white shadow-xs font-semibold'
                : 'text-orange-700 dark:text-orange-400 hover:text-orange-900 hover:bg-orange-50 dark:hover:bg-neutral-700'
                }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{t.filterTabRecommended} ({recommendedCount})</span>
            </button>
          </div>
        </div>

        {/* Right: Sort, View Mode & Kéo qua phải Quick Button */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Quick Slider Controls */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-md border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={handlePrevPage}
              disabled={safePage === 0}
              className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 px-1">
              {safePage + 1}/{totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={safePage >= totalPages - 1}
              className="px-2 py-1 bg-ueh-orange hover:bg-[#e05f12] text-white text-[11px] font-bold rounded flex items-center gap-1 disabled:opacity-30 transition-all shadow-2xs cursor-pointer"
              title="Kéo qua phải (8 khóa học tiếp theo)"
            >
              <span>Kéo qua phải</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortBy(sortBy === 'name' ? 'progress' : 'name')}
            className="px-3 py-1.5 bg-[#8bc34a] hover:bg-[#7cb342] text-white font-medium rounded flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortBy === 'name' ? t.courseName : t.progressPercent}</span>
            <span className="text-[10px]">▼</span>
          </button>

          {/* View Mode Button */}
          <button
            onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
            className="px-3 py-1.5 bg-[#8bc34a] hover:bg-[#7cb342] text-white font-medium rounded flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            {viewMode === 'card' ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            <span>{viewMode === 'card' ? t.viewCard : t.viewList}</span>
            <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {/* Course Cards Grid (Responsive 1/2/3/4 columns showing max 8 courses per page) */}
      {filteredCourses.length > 0 ? (
        viewMode === 'card' ? (
          <div key={safePage} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-200">
            {paginatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={onSelectCourse}
                onQuickContinue={onQuickContinue}
                isAdmin={isAdmin}
                onDelete={(c) => setConfirmDeleteCourse(c)}
                language={language}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div key={safePage} className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-xs animate-in fade-in duration-200">
            {paginatedCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                    <CourseCard
                      course={course}
                      onSelect={() => { }}
                      onQuickContinue={() => { }}
                      isAdmin={isAdmin}
                      onDelete={(c) => setConfirmDeleteCourse(c)}
                      language={language}
                    />
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">{course.code}</div>
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">{course.title}</h4>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">GV: {course.instructor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 sm:text-right">
                  <div>
                    <span className="text-xs font-bold text-ueh-orange">{course.progress}%</span>
                    <div className="w-24 bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-ueh-orange h-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickContinue(course);
                    }}
                    className="px-3 py-1 bg-ueh-teal dark:bg-teal-700 hover:bg-ueh-darkteal text-white text-xs font-semibold rounded cursor-pointer"
                  >
                    {t.continueLearning}
                  </button>
                  {isAdmin && onDeleteCourse && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteCourse(course);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                      title="Xóa khóa học này khỏi hệ thống (Admin)"
                      aria-label="Xóa khóa học"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">{t.notFoundCourses}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            {activeFilter === 'cv-recommended'
              ? (language === 'vi'
                ? 'Chưa có khóa học gợi ý từ CV. Hãy tải lên CV của bạn để AI phân tích và tự động gắn thẻ gợi ý!'
                : 'No courses recommended from CV yet. Upload your CV for AI to analyze and suggest modules!')
              : t.notFoundDesc}
          </p>
          {activeFilter === 'cv-recommended' && (
            <button
              onClick={onOpenCvTab}
              className="px-4 py-2 bg-ueh-orange hover:bg-[#e05f12] text-white text-xs font-semibold rounded shadow transition-all cursor-pointer"
            >
              {t.goToCv}
            </button>
          )}
        </div>
      )}

      {/* Bottom Pagination & Slide Controls */}
      {filteredCourses.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xs text-xs">
          <div className="text-neutral-500 dark:text-neutral-400">
            Hiển thị <span className="font-bold text-neutral-800 dark:text-white">{safePage * ITEMS_PER_PAGE + 1}</span> - <span className="font-bold text-neutral-800 dark:text-white">{Math.min((safePage + 1) * ITEMS_PER_PAGE, filteredCourses.length)}</span> trên tổng số <span className="font-bold text-ueh-orange">{filteredCourses.length}</span> khóa học
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={safePage === 0}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 disabled:opacity-40 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trang trước</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setCurrentPage(pIdx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${pIdx === safePage
                    ? 'bg-ueh-orange text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                >
                  {pIdx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={safePage >= totalPages - 1}
              className="px-3.5 py-1.5 rounded-lg bg-ueh-orange hover:bg-[#e05f12] text-white disabled:opacity-40 transition-all font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Kéo qua phải</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Admin Delete Course Confirmation Modal */}
      {confirmDeleteCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 border border-rose-200 dark:border-rose-900/60 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mb-3.5 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
              Xác nhận xóa khóa học?
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
              Bạn có chắc chắn muốn xóa học phần <strong className="text-neutral-900 dark:text-white">"{confirmDeleteCourse.title}"</strong> (<span className="font-mono text-ueh-orange font-bold">{confirmDeleteCourse.code}</span>) khỏi danh mục LMS không?
            </p>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 mb-5 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Chỉ Quản trị viên (Admin) mới có quyền thực hiện. Khóa học này sẽ được gỡ khỏi danh mục và lộ trình gợi ý cho sinh viên.</span>
            </div>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDeleteCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteCourse && confirmDeleteCourse) {
                    onDeleteCourse(confirmDeleteCourse.id);
                  }
                  setConfirmDeleteCourse(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác Nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
