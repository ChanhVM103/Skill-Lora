import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, BookOpen, ArrowRight, Award } from 'lucide-react';
import { CvAnalysis, Course } from '../../types';
import { SkillRadarChart } from './SkillRadarChart';
import { CourseCard } from '../education/CourseCard';

interface CvAnalysisResultProps {
  analysis: CvAnalysis;
  allCourses: Course[];
  onSelectCourse: (course: Course) => void;
  onApplyRecommendations: () => void;
}

export const CvAnalysisResult: React.FC<CvAnalysisResultProps> = ({
  analysis,
  allCourses,
  onSelectCourse,
  onApplyRecommendations,
}) => {
  const suggestedCourses = allCourses.filter((c) =>
    analysis.suggestedCourseIds.includes(c.id)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Match Score & Executive AI Summary */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 text-neutral-900 dark:text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Match Score Display */}
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-50 dark:bg-neutral-800 border-4 border-ueh-orange flex flex-col items-center justify-center text-center shadow-inner shrink-0">
              <span className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                {analysis.matchScore}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-bold text-ueh-orange dark:text-amber-400">
                / 100 Điểm
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Độ khớp hồ sơ xuất sắc</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                Vị trí mục tiêu: {analysis.targetRole}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-300 font-mono mt-1">
                Tệp: {analysis.fileName} ({analysis.fileSize}) • Cập nhật: {analysis.uploadedAt}
              </p>
            </div>
          </div>

          {/* Call to action button to apply recommended badges */}
          <button
            onClick={onApplyRecommendations}
            className="w-full md:w-auto px-5 py-2.5 bg-ueh-orange hover:bg-[#e05f12] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Gắn huy hiệu gợi ý vào khóa học</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* AI Insight Summary */}
        <div className="mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-white/5 p-3.5 rounded-xl border border-neutral-200/60 dark:border-transparent">
          <span className="font-bold text-amber-700 dark:text-amber-300 mr-1.5">⚡ Nhận định từ AI Coach:</span>
          {analysis.summary}
        </div>
      </div>

      {/* Grid: Skill Breakdown & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Matched vs Missing Skills (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-6 transition-colors duration-200">
          {/* Matched Skills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Kỹ năng bạn đã sở hữu ({analysis.matchedSkills.length})</span>
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                Đáp ứng tốt
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills (Skill Gaps) */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-ueh-orange" />
                <span>Khoảng trống kỹ năng cần bổ sung ({analysis.missingSkills.length})</span>
              </h3>
              <span className="text-[11px] text-orange-600 dark:text-orange-300 font-semibold bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                Cần học bù
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              Đây là các yêu cầu trọng yếu trong bảng mô tả công việc (JD) mà CV của bạn chưa làm nổi bật:
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-orange-50 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <span className="text-ueh-orange font-bold">+</span>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Radar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm flex flex-col items-center justify-center transition-colors duration-200">
          <div className="w-full text-left mb-2">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-ueh-teal dark:text-teal-400" />
              <span>Biểu đồ Năng lực Kỹ năng (SkillRadar)</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Phân bố điểm theo 5 nhóm trọng điểm</p>
          </div>

          <div className="w-full py-2 flex items-center justify-center">
            <SkillRadarChart metrics={analysis.radarScores} size={270} />
          </div>
        </div>
      </div>

      {/* Suggested Courses Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4 transition-colors duration-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-ueh-teal dark:text-teal-400" />
              <span>Các học phần LMS được AI gợi ý để bù đắp kỹ năng</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Hoàn thành các môn này để chuẩn hóa 100% yêu cầu tuyển dụng cho vị trí {analysis.targetRole}
            </p>
          </div>
          <span className="text-xs font-bold text-ueh-orange bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
            {suggestedCourses.length} khóa học phù hợp
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {suggestedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelectCourse}
              onQuickContinue={onSelectCourse}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
