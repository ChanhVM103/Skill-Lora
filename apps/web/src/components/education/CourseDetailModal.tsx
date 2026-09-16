import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Sparkles, HelpCircle, Award } from 'lucide-react';
import { Course } from '../../types';
import { GeometricPattern } from './GeometricPattern';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onToggleLesson: (courseId: string, lessonId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onToggleLesson,
}) => {
  const [selectedQuizLessonId, setSelectedQuizLessonId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  if (!course) return null;

  const currentQuizLesson = course.lessons.find((l) => l.id === selectedQuizLessonId);

  const handleAnswerQuiz = () => {
    if (selectedAnswer === null || !currentQuizLesson?.quizQuestion) return;
    setQuizSubmitted(true);
    if (selectedAnswer === currentQuizLesson.quizQuestion.correctAnswer) {
      // Mark lesson as complete
      if (!currentQuizLesson.completed) {
        onToggleLesson(course.id, currentQuizLesson.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-200">
        {/* Modal Header with Course Pattern */}
        <div className="h-32 w-full relative">
          <GeometricPattern theme={course.patternTheme} />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white z-10">
            <div>
              <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded font-mono uppercase">
                {course.code}
              </span>
              <h3 className="text-lg font-bold leading-tight drop-shadow-sm mt-1">
                {course.title}
              </h3>
            </div>
            {course.isRecommendedFromCv && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                <Sparkles className="w-3.5 h-3.5" /> Gợi ý từ CV
              </span>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Info bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/80 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs">
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">Giảng viên phụ trách: </span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-100">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 px-2 py-0.5 rounded text-[11px] font-medium">
                {course.category}
              </span>
              <span className="bg-teal-100 dark:bg-teal-950/80 text-ueh-teal dark:text-teal-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                {course.level}
              </span>
            </div>
          </div>

          {/* Progress Bar in Modal */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              <span>Tiến độ học phần</span>
              <span className="text-ueh-orange">{course.progress}% hoàn thành</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-ueh-orange h-full rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1">
              Mục tiêu học phần
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Skills acquired */}
          <div>
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Chuẩn đầu ra & Kỹ năng trang bị
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skillsTaught.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-teal-50 dark:bg-teal-950/60 text-ueh-teal dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2.5 py-1 rounded-md font-medium"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Lessons List with instant toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Danh sách bài học ({course.lessons.length} bài)
              </h4>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Tick chọn để hoàn thành bài học tức thì
              </span>
            </div>

            <div className="space-y-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-800/60 divide-y divide-neutral-200 dark:divide-neutral-700">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 rounded transition-colors ${
                    lesson.completed ? 'bg-emerald-50/60 dark:bg-emerald-950/40' : 'hover:bg-white dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleLesson(course.id, lesson.id)}
                      className="text-neutral-400 hover:text-ueh-teal transition-colors cursor-pointer"
                      title={lesson.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-400 dark:text-neutral-500 hover:text-ueh-orange" />
                      )}
                    </button>
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        <span>Bài {index + 1}: {lesson.title}</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Thời lượng: {lesson.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {lesson.quizQuestion && (
                      <button
                        onClick={() => {
                          setSelectedQuizLessonId(lesson.id);
                          setSelectedAnswer(null);
                          setQuizSubmitted(false);
                        }}
                        className="text-[11px] px-2 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 rounded font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Quiz kiểm tra</span>
                      </button>
                    )}
                    <button
                      onClick={() => onToggleLesson(course.id, lesson.id)}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                        lesson.completed
                          ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                          : 'bg-ueh-orange text-white hover:bg-[#e05f12]'
                      }`}
                    >
                      {lesson.completed ? 'Hoàn thành' : 'Học ngay'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Quiz Modal / Section if selected */}
          {currentQuizLesson?.quizQuestion && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-ueh-orange" />
                  <span>Câu hỏi kiểm tra nhanh: {currentQuizLesson.title}</span>
                </h5>
                <button
                  onClick={() => setSelectedQuizLessonId(null)}
                  className="text-amber-800 dark:text-amber-400 text-xs hover:underline cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {currentQuizLesson.quizQuestion.question}
              </p>

              <div className="space-y-1.5">
                {currentQuizLesson.quizQuestion.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-2 text-xs p-2 rounded border cursor-pointer transition-colors ${
                      selectedAnswer === idx
                        ? 'border-ueh-orange bg-orange-100 dark:bg-orange-950/60 font-semibold text-neutral-900 dark:text-white'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz-option"
                      checked={selectedAnswer === idx}
                      onChange={() => setSelectedAnswer(idx)}
                      disabled={quizSubmitted}
                      className="text-ueh-orange focus:ring-ueh-orange"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                {quizSubmitted ? (
                  <div className="text-xs font-semibold">
                    {selectedAnswer === currentQuizLesson.quizQuestion.correctAnswer ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Chính xác! Đã cập nhật điểm và hoàn thành bài học.
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400">
                        Chưa chính xác. Bạn có thể chọn lại để đạt điểm tối đa!
                      </span>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}

                <button
                  onClick={handleAnswerQuiz}
                  disabled={selectedAnswer === null || quizSubmitted}
                  className="px-3 py-1.5 bg-ueh-orange hover:bg-[#e05f12] text-white text-xs font-bold rounded disabled:opacity-50 cursor-pointer"
                >
                  Nộp câu trả lời
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
