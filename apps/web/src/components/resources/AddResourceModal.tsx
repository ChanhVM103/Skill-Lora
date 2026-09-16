import React, { useState, useEffect } from 'react';
import type { ResourceDifficulty, ResourceType } from '../../types/roadmap.types';
import type { ExtendedResource } from './ResourceCard';
import { BookOpen, X, Sparkles, Tag, Link2, FileText, CheckCircle2, GraduationCap } from 'lucide-react';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: ExtendedResource) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAddResource,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('lecture');
  const [difficulty, setDifficulty] = useState<ResourceDifficulty>('beginner');
  const [tags, setTags] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề tài liệu hoặc bài học.');
      return;
    }

    if (!tags.trim()) {
      setError('Vui lòng nhập ít nhất một thẻ kỹ năng liên quan.');
      return;
    }

    const skillTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newResource: ExtendedResource = {
      id: `res_${Date.now()}`,
      title: title.trim(),
      type,
      difficulty,
      skill_tags: skillTags.length > 0 ? skillTags : ['General'],
      url: url.trim() || undefined,
      description: description.trim() || undefined,
      author: 'Giảng viên đóng góp',
    };

    onAddResource(newResource);
    onClose();

    // Reset fields
    setTitle('');
    setTags('');
    setUrl('');
    setDescription('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-xl w-full p-6 sm:p-7 border border-neutral-200 dark:border-neutral-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ueh-orange to-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Thêm Tài Nguyên / Bài Giảng Mới</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/70 text-ueh-orange dark:text-orange-300 font-bold">
                  LMS Content
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Đóng góp học liệu & dự án giúp sinh viên bồi dưỡng khoảng trống kỹ năng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Tiêu đề tài liệu / bài học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Xây dựng RESTful API với NestJS & Prisma ORM"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ueh-teal transition-all"
            />
          </div>

          {/* Field 2 & 3: Type and Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-ueh-teal" />
                <span>Thể loại tài liệu</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ResourceType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ueh-teal cursor-pointer transition-all"
              >
                <option value="lecture">📖 Bài giảng (Lecture)</option>
                <option value="video">🎬 Video hướng dẫn</option>
                <option value="project">🚀 Đồ án thực chiến (Project)</option>
                <option value="assignment">📝 Bài tập áp dụng (Assignment)</option>
                <option value="quiz">❓ Trắc nghiệm đánh giá (Quiz)</option>
                <option value="article">📰 Bài viết chuyên đề (Article)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Độ khó phù hợp</span>
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as ResourceDifficulty)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ueh-teal cursor-pointer transition-all"
              >
                <option value="beginner">🟢 Cơ bản (Beginner)</option>
                <option value="intermediate">🟡 Trung cấp (Intermediate)</option>
                <option value="advanced">🔴 Nâng cao (Advanced)</option>
              </select>
            </div>
          </div>

          {/* Field 4: Skill Tags */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-ueh-teal" />
              <span>Kỹ năng liên quan (cách nhau bởi dấu phẩy) <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: NestJS, REST API, Docker, PostgreSQL"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ueh-teal transition-all"
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Hệ thống sẽ dùng các thẻ kỹ năng này để tự động gợi ý tài liệu khi sinh viên thiếu kỹ năng tương ứng.
            </span>
          </div>

          {/* Field 5: URL */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-ueh-teal" />
              <span>Đường dẫn tài liệu / Bài giảng (URL)</span>
            </label>
            <input
              type="url"
              placeholder="https://github.com/... hoặc https://youtube.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ueh-teal transition-all"
            />
          </div>

          {/* Field 6: Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-ueh-teal" />
              <span>Mô tả tóm tắt nội dung</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tóm tắt những kiến thức cốt lõi và mục tiêu đầu ra sinh viên sẽ đạt được sau bài học này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ueh-teal transition-all resize-none"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-ueh-teal hover:bg-ueh-darkteal text-white rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu Tài Nguyên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
