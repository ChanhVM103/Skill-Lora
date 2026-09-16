import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { mockLandingCvResult } from '../../data/landingData';
import { LandingCvMockResult } from '../../types/landing';
import { Language } from '../../i18n/translations';

interface LandingCvScannerProps {
  onExploreCourses: () => void;
  onNavigateToAuth: () => void;
  language: Language;
}

export const LandingCvScanner: React.FC<LandingCvScannerProps> = ({
  onExploreCourses,
  onNavigateToAuth,
  language,
}) => {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'completed'>('completed');
  const [scanProgress, setScanProgress] = useState(100);
  const [currentFile, setCurrentFile] = useState<string>('Nguyen_Quoc_Phong_CV_2026.pdf');
  const result: LandingCvMockResult = mockLandingCvResult;

  const handleSimulateScan = (fileName: string) => {
    setCurrentFile(fileName);
    setScanStatus('scanning');
    setScanProgress(15);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setScanStatus('completed');
            setScanProgress(100);
          }, 300);
          return 95;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleSimulateScan(file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulateScan(e.target.files[0].name);
    }
  };

  return (
    <section id="scanner" className="py-20 sm:py-28 bg-[#faf9f6] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-ueh-orange text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Trải Nghiệm Quét CV AI Trực Tiếp' : 'Interactive AI CV Scanner'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {language === 'vi' ? 'Bóc tách lỗ hổng, nâng tầm hồ sơ' : 'Uncover Gaps, Elevate Your Resume'}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {language === 'vi'
              ? 'Tải lên CV của bạn (PDF/DOCX) để hệ thống tự động phát hiện các mục còn thiếu, tính toán chỉ số hoàn thiện và đề xuất lộ trình môn học khắc phục ngay tức thì.'
              : 'Upload your CV (PDF/DOCX) for AI to pinpoint missing sections, compute readiness score, and suggest targeted courses.'}
          </p>
        </div>

        {/* Main Grid: Upload Zone (Left) & Real-time Scan Result (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Drag-and-drop Upload Area (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="relative p-8 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-ueh-orange dark:hover:border-orange-500 bg-white dark:bg-neutral-900 shadow-sm transition-all text-center group cursor-pointer"
            >
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-ueh-orange flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {language === 'vi' ? 'Kéo & thả tệp CV của bạn vào đây' : 'Drag & drop your CV file here'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-4">
                {language === 'vi'
                  ? 'Hỗ trợ định dạng PDF, DOCX (Dung lượng tối đa 10MB)'
                  : 'Supports PDF, DOCX up to 10MB'}
              </p>

              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:bg-ueh-teal group-hover:text-white transition-all shadow-xs">
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Hoặc chọn tệp từ máy tính' : 'Or browse files'}</span>
              </span>
            </div>

            {/* Quick 1-Click Demo Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/40 dark:border-amber-800/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {language === 'vi' ? 'Chưa có sẵn file CV trên máy?' : 'No CV file on hand?'}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {language === 'vi'
                      ? 'Dùng thử CV mẫu Frontend Developer để xem kết quả'
                      : 'Test sample Frontend Developer resume'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSimulateScan('Sample_Frontend_Developer_CV.pdf')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0"
              >
                {language === 'vi' ? 'Thử CV Mẫu' : 'Try Demo CV'}
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'vi'
                  ? 'Bảo mật tuyệt đối: Hồ sơ chỉ được phân tích hiển thị trên trình duyệt.'
                  : '100% Client-side privacy: Resumes stay private on your browser.'}
              </span>
            </div>
          </div>

          {/* Right: Mock Analysis Result (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl transition-all">
            {scanStatus === 'scanning' ? (
              /* Scanning In-progress Animation */
              <div className="py-16 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 border-4 border-orange-200 dark:border-orange-950 border-t-ueh-orange rounded-full animate-spin" />
                  <Sparkles className="w-6 h-6 text-ueh-orange absolute inset-0 m-auto" />
                </div>
                <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {language === 'vi' ? 'AI đang bóc tách và đối chiếu hồ sơ...' : 'AI is extracting resume sections...'}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                  {language === 'vi'
                    ? `Đang phân tích tệp: ${currentFile}. Đối chiếu với tiêu chuẩn tuyển dụng 2026...`
                    : `Analyzing file: ${currentFile}. Benchmarking against market standards...`}
                </p>
                <div className="max-w-xs mx-auto h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-ueh-orange transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              /* Completed Result State */
              <div className="space-y-6">
                {/* Result Header & Score Ring */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-teal-100 dark:bg-teal-950/60 text-ueh-teal dark:text-teal-400">
                        <FileText className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 truncate max-w-[220px]">
                        {currentFile}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        {language === 'vi' ? 'Đã phân tích' : 'Analyzed'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {result.targetRole}
                    </h3>
                  </div>

                  {/* Prominent 72% Completion Score Badge */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        {language === 'vi' ? 'Độ Hoàn Thiện CV' : 'Readiness Score'}
                      </div>
                      <div className="text-xs text-amber-700 dark:text-amber-400">
                        {language === 'vi' ? 'Cần bổ sung' : 'Needs Action'}
                      </div>
                    </div>
                    <div className="text-3xl font-black font-mono text-ueh-orange dark:text-orange-400">
                      72%
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-slate-50 dark:bg-neutral-800/50 p-3.5 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60">
                  {result.summary}
                </p>

                {/* Identified Missing Items Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>
                        {language === 'vi'
                          ? '3 Lỗ hổng cần khắc phục ngay để tăng tỷ lệ phản hồi'
                          : '3 Critical Missing Elements Detected'}
                      </span>
                    </h4>
                    <span className="text-[11px] text-neutral-400 font-mono">-28% Điểm CV</span>
                  </div>

                  <div className="space-y-3">
                    {result.missingItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-red-200/80 dark:border-red-900/40 hover:border-red-400 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                            Ưu tiên {item.priority}
                          </span>
                        </div>

                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          <strong className="text-neutral-700 dark:text-neutral-300">Vấn đề: </strong>
                          {item.issue}
                        </div>

                        <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
                          <strong>Khắc phục: </strong>
                          {item.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Recommendations CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={onExploreCourses}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ueh-teal hover:bg-ueh-darkteal text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>{language === 'vi' ? 'Xem 3 khóa học bù đắp điểm yếu' : 'View Recommended Courses'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onNavigateToAuth}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-all text-center"
                  >
                    {language === 'vi' ? 'Đăng nhập để lưu lộ trình cá nhân' : 'Sign In to Save Progress'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
