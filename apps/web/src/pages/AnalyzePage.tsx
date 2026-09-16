import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TargetRole } from '../types/roadmap.types';
import { analysisService } from '../services/analysis.service';
import { RoleSelector } from '../components/analyze/RoleSelector';
import { FileDropzone } from '../components/analyze/FileDropzone';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<TargetRole>('backend_developer');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setError('Vui lòng tải lên file CV (PDF hoặc DOCX) để tiến hành phân tích.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      setAnalysisStep('Đang trích xuất dữ liệu từ CV & Bảng điểm...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAnalysisStep('Kiểm tra ATS và so khớp yêu cầu chuẩn nghề nghiệp...');
      await new Promise((resolve) => setTimeout(resolve, 900));

      setAnalysisStep('Định lượng khoảng trống kỹ năng & tính điểm sẵn sàng...');
      const result = await analysisService.analyzeCv(
        cvFile,
        selectedRole,
        transcriptFile,
        jdText.trim() || undefined,
      );

      navigate('/result', { state: { analysis: result } });
    } catch (err: any) {
      setError(err.message || 'Phân tích thất bại. Vui lòng thử lại.');
      setIsAnalyzing(false);
    }
  };

  const handleQuickDemo = () => {
    setIsAnalyzing(true);
    setAnalysisStep('Đang nạp hồ sơ mẫu sinh viên CNTT...');
    setTimeout(() => {
      const mockResult = analysisService.generateMockAnalysis(selectedRole, 'CV_NguyenVanA_Demo.pdf');
      navigate('/result', { state: { analysis: mockResult } });
    }, 1200);
  };

  return (
    <main className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Badge variant="indigo" size="md">Track 1 - Future Skills Readiness</Badge>
          <Badge variant="emerald" size="md">AI Skill Gap Coach</Badge>
        </div>

        <h1 style={{ marginBottom: '1.25rem' }}>
          Biến CV & Bảng Điểm Thành <br />
          <span className="gradient-text">Báo Cáo Sẵn Sàng Nghề Nghiệp</span>
        </h1>

        <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Hệ thống phân tích khoảng trống kỹ năng định lượng, kiểm tra tiêu chuẩn học thuật và đề xuất lộ trình hành động bù đắp kiến thức cá nhân hóa.
        </p>
      </div>

      {/* Main Analysis Form */}
      <form onSubmit={handleAnalyze} style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Error Banner */}
        {error ? (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--accent-rose)',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        ) : null}

        {/* Step 1: Role Selection */}
        <RoleSelector
          selectedRole={selectedRole}
          onSelectRole={(role) => setSelectedRole(role)}
        />

        {/* Step 2: Upload CV & Transcript */}
        <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            2. Tải lên hồ sơ năng lực của bạn:
          </label>

          <div className="grid grid-cols-2 gap-4">
            <FileDropzone
              label="CV / Sơ yếu lý lịch"
              sublabel="Hỗ trợ file PDF, DOCX (bắt buộc)"
              required
              file={cvFile}
              onFileSelect={(f) => {
                setCvFile(f);
                setError(null);
              }}
              icon="📄"
            />

            <FileDropzone
              label="Bảng điểm đại học (Transcript)"
              sublabel="Hỗ trợ PDF, hình ảnh scan (tùy chọn)"
              accept=".pdf,.png,.jpg,.jpeg,.docx"
              file={transcriptFile}
              onFileSelect={(f) => setTranscriptFile(f)}
              icon="🎓"
            />
          </div>

          {/* Accordion for Custom JD */}
          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setShowJdInput((prev) => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-indigo)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: 0,
              }}
            >
              <span>{showJdInput ? '▲ Ẩn phần so khớp Job Description cụ thể' : '▼ + Nhập mô tả công việc (JD) cụ thể để so khớp chính xác hơn'}</span>
            </button>

            {showJdInput ? (
              <div style={{ marginTop: '1rem' }} className="animate-fade-in">
                <textarea
                  className="form-textarea"
                  placeholder="Dán nội dung Job Description (yêu cầu tuyển dụng) từ nhà tuyển dụng mà bạn muốn ứng tuyển..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  style={{ minHeight: '120px' }}
                />
              </div>
            ) : null}
          </div>
        </Card>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isAnalyzing}
            style={{ width: '100%', maxWidth: '450px', fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            {isAnalyzing ? analysisStep : 'Phân Tích Khoảng Trống Kỹ Năng Ngay'}
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chưa có file CV sẵn?</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isAnalyzing}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-violet)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              ⚡ Trải nghiệm ngay với CV mẫu
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
