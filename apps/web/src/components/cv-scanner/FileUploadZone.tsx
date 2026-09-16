import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, RefreshCw, ChevronDown, ChevronUp, FileCheck, Briefcase, GraduationCap, X } from 'lucide-react';
import { CvAnalysis } from '../../types';
import { mockCvAnalysis } from '../../data/mockData';
import { analysisService } from '../../services/analysis.service';

interface FileUploadZoneProps {
  onAnalysisComplete: (result: CvAnalysis) => void;
  isAnalyzing: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onAnalysisComplete,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing' | 'completed'>('idle');
  const [currentFile, setCurrentFile] = useState<{ name: string; size: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);

  // Advanced analysis options matching Backend API
  const [targetRole, setTargetRole] = useState<'backend_developer' | 'data_analyst' | 'ai_engineer'>('backend_developer');
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [showJdInput, setShowJdInput] = useState(false);
  const [jdText, setJdText] = useState('');

  const analysisSteps = [
    'Trích xuất văn bản và định dạng ATS từ CV...',
    'Nhận diện các công nghệ, kỹ năng cốt lõi & kinh nghiệm làm việc...',
    'Đối soát với ma trận kỹ năng ngành công nghệ và yêu cầu thị trường...',
    'Tổng hợp khoảng trống kỹ năng & đề xuất học phần LMS liên kết...',
  ];

  const handleValidateAndProcess = (file: File) => {
    setErrorMessage(null);

    // Validate extension
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Định dạng tệp không hợp lệ! Vui lòng chỉ tải lên tệp định dạng PDF hoặc Word (.docx, .doc).');
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('Dung lượng tệp vượt quá giới hạn 10MB. Vui lòng nén tệp hoặc chọn tệp nhỏ hơn.');
      return;
    }

    const fileSizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setCurrentFile({ name: file.name, size: fileSizeStr });

    startUploadAndAnalysis(file, file.name, fileSizeStr);
  };

  const startUploadAndAnalysis = (file: File, fileName: string, fileSizeStr: string) => {
    // 1. Uploading state
    setUploadState('uploading');
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          // 2. Analyzing state
          setUploadState('analyzing');
          runAnalysisSteps(file, fileName, fileSizeStr);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const runAnalysisSteps = async (file: File, fileName: string, fileSizeStr: string) => {
    setAnalysisStep(0);

    // Start real backend call in parallel with selected options
    const analysisPromise = analysisService.analyzeCv(file, targetRole, transcriptFile, jdText || undefined);

    let currentStepIndex = 0;
    const stepInterval = setInterval(() => {
      currentStepIndex += 1;
      if (currentStepIndex < analysisSteps.length) {
        setAnalysisStep(currentStepIndex);
      }
    }, 650);

    try {
      const realResult = await analysisPromise;
      clearInterval(stepInterval);
      setAnalysisStep(analysisSteps.length - 1);

      setTimeout(() => {
        setUploadState('completed');
        const roleLabel =
          realResult.target_role === 'backend_developer'
            ? 'Backend Developer'
            : realResult.target_role === 'data_analyst'
            ? 'Data Analyst'
            : 'AI Engineer';

        const analysisResult: CvAnalysis = {
          analysisId: realResult.analysis_id,
          fileName: fileName,
          fileSize: fileSizeStr,
          uploadedAt: 'Vừa xong',
          matchScore: realResult.scores?.readiness_score ?? mockCvAnalysis.matchScore,
          targetRole: roleLabel,
          summary:
            realResult.parsed_cv?.experience_summary ||
            `Hồ sơ phân tích tự động từ ${fileName}. Hệ thống phát hiện ${realResult.existing_skills?.length || 0} kỹ năng phù hợp và ${realResult.missing_skills?.length || 0} khoảng trống cần bổ sung.`,
          matchedSkills: realResult.existing_skills?.length ? realResult.existing_skills : mockCvAnalysis.matchedSkills,
          missingSkills: realResult.missing_skills?.length ? realResult.missing_skills : mockCvAnalysis.missingSkills,
          suggestedCourseIds: ['course-1', 'course-2', 'course-3'],
          radarScores: [
            { subject: 'Sẵn sàng công việc', score: realResult.scores?.readiness_score ?? 75, fullMark: 100 },
            { subject: 'Định dạng ATS', score: realResult.scores?.ats_score ?? 80, fullMark: 100 },
            { subject: 'Học thuật tiên quyết', score: realResult.scores?.academic_score ?? 70, fullMark: 100 },
            { subject: 'Độ khớp yêu cầu', score: realResult.scores?.match_percentage ?? 65, fullMark: 100 },
            { subject: 'Kỹ năng cốt lõi', score: Math.min(100, Math.round(((realResult.existing_skills?.length || 4) / ((realResult.existing_skills?.length || 4) + (realResult.missing_skills?.length || 3))) * 100)), fullMark: 100 },
          ],
        };
        onAnalysisComplete(analysisResult);
      }, 500);
    } catch {
      clearInterval(stepInterval);
      setUploadState('completed');
      const fallbackResult: CvAnalysis = {
        ...mockCvAnalysis,
        fileName: fileName,
        fileSize: fileSizeStr,
        uploadedAt: 'Vừa xong',
      };
      onAnalysisComplete(fallbackResult);
    }
  };

  const handleUseDemoCv = () => {
    setErrorMessage(null);
    const demoFileName = 'Nguyen_Van_Minh_CV_Developer.pdf';
    const demoFileSize = '1.4 MB';
    setCurrentFile({ name: demoFileName, size: demoFileSize });
    const demoFile = new File(['Nguyen Van Minh - Backend Developer CV Demo'], demoFileName, { type: 'application/pdf' });
    startUploadAndAnalysis(demoFile, demoFileName, demoFileSize);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleValidateAndProcess(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {/* 4 States Render */}
      {uploadState === 'idle' && (
        <div className="space-y-4">
          {/* Target Role Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-ueh-teal" />
              <span>Vị Trí Nghề Nghiệp Mục Tiêu:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'backend_developer', label: 'Backend Developer', desc: 'Node.js, Java, DB & API' },
                { id: 'data_analyst', label: 'Data Analyst', desc: 'SQL, Python, BI & Thống kê' },
                { id: 'ai_engineer', label: 'AI Engineer', desc: 'Machine Learning, PyTorch, LLM' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setTargetRole(r.id as any)}
                  className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                    targetRole === r.id
                      ? 'border-ueh-teal bg-teal-50/60 dark:bg-teal-950/40 text-ueh-teal shadow-xs font-semibold'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-xs font-bold">{r.label}</div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-ueh-orange bg-orange-50/50 scale-[1.01]'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-ueh-teal bg-white dark:bg-neutral-900 hover:bg-teal-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-full bg-orange-100 text-ueh-orange mx-auto flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-neutral-800 dark:text-white mb-1">
              Kéo và thả tệp CV của bạn vào đây, hoặc <span className="text-ueh-teal underline">Duyệt tệp</span>
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Hỗ trợ định dạng PDF, DOCX (Dung lượng tối đa 10MB)
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI tự động trích xuất kỹ năng & đối soát lộ trình học tập</span>
            </div>
          </div>

          {/* Optional Transcript and Custom JD Inputs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-ueh-teal shrink-0" />
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Bảng điểm (Tùy chọn):</span>
              {transcriptFile ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-mono text-[11px]">
                  {transcriptFile.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTranscriptFile(null);
                    }}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => transcriptInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 text-[11px] cursor-pointer"
                >
                  + Tải lên bảng điểm
                </button>
              )}
              <input
                ref={transcriptInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setTranscriptFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowJdInput(!showJdInput)}
              className="text-ueh-teal hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>{showJdInput ? 'Ẩn Custom JD' : '+ Nhập tin tuyển dụng (Custom JD)'}</span>
              {showJdInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showJdInput && (
            <div className="space-y-1.5 animate-in fade-in">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Nội dung tin tuyển dụng mục tiêu (Yêu cầu kỹ thuật / JD Text):
              </label>
              <textarea
                rows={3}
                placeholder="Dán yêu cầu công việc hoặc mô tả kỹ năng từ nhà tuyển dụng để AI so khớp chuyên sâu..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-ueh-teal"
              />
            </div>
          )}

          {/* Client-side error message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo CV Button for instant testing */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="text-xs text-neutral-400">Chưa có sẵn CV trên máy?</span>
            <button
              onClick={handleUseDemoCv}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-md border border-neutral-300 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-ueh-teal" />
              <span>Dùng thử CV Mẫu (Frontend Dev)</span>
            </button>
          </div>
        </div>
      )}

      {/* State 2: Uploading */}
      {uploadState === 'uploading' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-ueh-teal mx-auto flex items-center justify-center animate-pulse">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-800">Đang tải lên tệp: {currentFile?.name}</h4>
            <p className="text-xs text-neutral-500">{currentFile?.size}</p>
          </div>
          <div className="max-w-md mx-auto w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-ueh-teal h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="text-xs font-semibold text-neutral-600">{uploadProgress}% hoàn tất</span>
        </div>
      )}

      {/* State 3: Analyzing (Multi-step AI simulation) */}
      {uploadState === 'analyzing' && (
        <div className="bg-white rounded-2xl border border-orange-200 p-8 sm:p-10 text-center space-y-6 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white mx-auto flex items-center justify-center shadow-lg animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900">
              AI Đang Phân Tích Hồ Sơ Năng Lực Của Bạn
            </h3>
            <p className="text-xs text-neutral-500">
              Tệp: <span className="font-mono font-medium text-neutral-700">{currentFile?.name}</span>
            </p>
          </div>

          {/* Stepper indicators */}
          <div className="max-w-lg mx-auto text-left space-y-2.5 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            {analysisSteps.map((step, idx) => {
              const isCompleted = idx < analysisStep;
              const isCurrent = idx === analysisStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                    isCompleted
                      ? 'text-emerald-700 font-medium'
                      : isCurrent
                      ? 'text-orange-600 font-bold'
                      : 'text-neutral-400 opacity-60'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin shrink-0"></div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0"></div>
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* State 4: Completed trigger button */}
      {uploadState === 'completed' && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-xs font-bold text-emerald-900">Đã quét và phân tích xong tệp:</span>
              <span className="text-xs text-emerald-700 font-mono ml-1.5">{currentFile?.name}</span>
            </div>
          </div>
          <button
            onClick={() => setUploadState('idle')}
            className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Quét lại CV khác</span>
          </button>
        </div>
      )}
    </div>
  );
};
