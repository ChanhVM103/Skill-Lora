import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Sparkles, ExternalLink } from 'lucide-react';
import { RoadmapItem, Course, CvAnalysis } from '../../types';
import { mockRoadmap } from '../../data/mockData';
import { roadmapService } from '../../services/roadmap.service';

interface CareerRoadmapProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  cvAnalysis?: CvAnalysis | null;
}

export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({
  courses,
  onSelectCourse,
  cvAnalysis,
}) => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(mockRoadmap);

  useEffect(() => {
    const loadRealRoadmap = async () => {
      try {
        const gapItems =
          cvAnalysis?.missingSkills && cvAnalysis.missingSkills.length > 0
            ? cvAnalysis.missingSkills.map((skill, idx) => ({
                skill_id: `skill_${idx}`,
                skill_name: skill,
                category: 'core' as const,
                severity: 'high' as const,
                current_level: 'missing' as const,
                target_level: 'intermediate' as const,
              }))
            : roadmapService.getDefaultGapItems('backend_developer');

        const liveData = await roadmapService.generateRoadmap({
          target_role: 'backend_developer',
          starting_level: 'beginner',
          gap_items: gapItems,
        });

        if (liveData?.phases && liveData.phases.length > 0) {
          const generated: RoadmapItem[] = liveData.phases.map((p, idx) => ({
            id: `phase_${p.phase || idx + 1}`,
            week: p.phase || idx + 1,
            title: p.title,
            description: p.why_this_phase || `Tập trung củng cố các kỹ năng: ${p.focus_skills?.join(', ') || ''}`,
            completed: false,
            estimatedHours: 10,
            courseId: courses[idx % courses.length]?.id,
          }));
          setRoadmapItems(generated);
        }
      } catch {
        // keep default mock
      }
    };

    loadRealRoadmap();
  }, [cvAnalysis, courses]);

  const toggleItemComplete = (id: string) => {
    setRoadmapItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = roadmapItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / roadmapItems.length) * 100);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-200">
      {/* Header & Overall Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-ueh-teal dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Được cá nhân hóa theo mục tiêu nghề nghiệp</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Lộ Trình Phát Triển Năng Lực 6 Tuần
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Được tổng hợp từ phân tích CV và kết quả đánh giá kỹ năng trên cổng đào tạo LMS.
          </p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/80 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 sm:w-64 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-200 mb-1.5">
            <span>Tiến độ hoàn thành:</span>
            <span className="text-ueh-orange">{completedCount}/{roadmapItems.length} mục ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-ueh-orange h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
        {roadmapItems.map((item) => {
          const linkedCourse = courses.find((c) => c.id === item.courseId);

          return (
            <div
              key={item.id}
              className={`relative bg-neutral-50 dark:bg-neutral-800/40 hover:bg-white dark:hover:bg-neutral-800 rounded-xl border p-4 sm:p-5 transition-all ${
                item.completed
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-neutral-200 dark:border-neutral-700 shadow-xs'
              }`}
            >
              {/* Timeline marker node */}
              <button
                onClick={() => toggleItemComplete(item.id)}
                className={`absolute -left-[30px] sm:-left-[38px] top-4 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : 'bg-white dark:bg-neutral-800 border-2 border-neutral-400 dark:border-neutral-600 text-neutral-400 dark:text-neutral-500 hover:border-ueh-orange hover:text-ueh-orange'
                }`}
                title={item.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-ueh-teal text-white">
                      Tuần {item.week}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      <Clock className="w-3 h-3" /> ~{item.estimatedHours} giờ học
                    </span>
                    {item.completed && (
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.2 rounded-full">
                        Đã hoàn thành
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      item.completed ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Linked Course Button */}
                {linkedCourse && (
                  <div className="shrink-0 pt-1">
                    <button
                      onClick={() => onSelectCourse(linkedCourse)}
                      className="px-3 py-1.5 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors group cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-ueh-teal dark:text-teal-400 group-hover:scale-110 transition-transform" />
                      <span className="truncate max-w-[140px]">{linkedCourse.title}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
