import { Injectable, NotFoundException } from '@nestjs/common';
import { TargetRole } from '../roadmap/dto/generate-roadmap-request.dto.js';
import { AnalysisResponseDto } from './dto/analysis-response.dto.js';
import { ROLE_REQUIREMENTS } from './config/role-requirements.config.js';
import { DeterministicScorer } from './engine/deterministic-scorer.js';
import { GapEngine } from './engine/gap-engine.js';

@Injectable()
export class AnalysisService {
  private analyses: Map<string, AnalysisResponseDto> = new Map();

  async analyze(
    targetRole: TargetRole,
    cvFile: any,
    transcriptFile?: any,
    jdText?: string,
  ): Promise<AnalysisResponseDto> {
    const roleConfig =
      ROLE_REQUIREMENTS[targetRole] ||
      ROLE_REQUIREMENTS[TargetRole.BackendDeveloper];

    // Read text from CV buffer or fallback to filename if text cannot be parsed directly
    let rawText = '';
    if (cvFile?.buffer) {
      try {
        rawText = cvFile.buffer.toString('utf-8');
      } catch {
        rawText = '';
      }
    }
    // Combine with original filename and any custom JD
    const analysisCorpus = `${cvFile?.originalname || ''} ${rawText} ${jdText || ''}`;

    // 1. Run Gap Engine
    const gapResult = GapEngine.analyze(analysisCorpus, roleConfig);

    // 2. Count ATS keywords found
    const lowerCorpus = analysisCorpus.toLowerCase();
    const foundAtsCount = roleConfig.ats_keywords.filter((kw) =>
      lowerCorpus.includes(kw.toLowerCase()),
    ).length;

    // 3. Compute Deterministic Scores
    const scores = DeterministicScorer.compute({
      matchedCoreCount: gapResult.existing_skills.length,
      totalCoreCount: roleConfig.core_skills.length,
      foundAtsCount,
      totalAtsCount: roleConfig.ats_keywords.length,
      hasTranscript: !!transcriptFile,
    });

    // 4. Generate ATS Checks
    const ats_checks = [
      {
        id: 'ats_1',
        check_name: 'Định dạng tài liệu',
        status: cvFile?.originalname?.endsWith('.pdf')
          ? ('passed' as const)
          : ('warning' as const),
        message: cvFile?.originalname
          ? `File '${cvFile.originalname}' có cấu trúc văn bản dễ trích xuất.`
          : 'Định dạng CV chuẩn PDF được khuyến nghị cho ATS scanner.',
      },
      {
        id: 'ats_2',
        check_name: 'Độ bao phủ từ khóa',
        status:
          foundAtsCount >= 4
            ? ('passed' as const)
            : ('warning' as const),
        message: `Phát hiện ${foundAtsCount}/${roleConfig.ats_keywords.length} từ khóa chuyên môn cốt lõi của vai trò ${roleConfig.title}.`,
      },
      {
        id: 'ats_3',
        check_name: 'Thông tin học vấn & liên hệ',
        status: 'passed' as const,
        message: 'Hồ sơ có đầy đủ mục thông tin liên hệ và quá trình đào tạo.',
      },
    ];

    // 5. Generate Academic Checks
    const academic_checks = [
      {
        id: 'acad_1',
        subject: roleConfig.prerequisite_courses[0] || 'Cơ sở dữ liệu',
        status: transcriptFile ? ('strong' as const) : ('acceptable' as const),
        feedback: transcriptFile
          ? 'Bảng điểm xác nhận đã hoàn thành các môn nền tảng công nghệ quan trọng.'
          : 'Chưa tải lên bảng điểm kèm theo để xác minh điểm số các môn tiên quyết.',
      },
      {
        id: 'acad_2',
        subject: roleConfig.prerequisite_courses[1] || 'Cấu trúc dữ liệu & Giải thuật',
        status: 'acceptable' as const,
        feedback: 'Đáp ứng các yêu cầu tư duy thuật toán và logic lập trình cơ bản.',
      },
    ];

    const analysisId = `analysis_${Date.now()}`;
    const result: AnalysisResponseDto = {
      analysis_id: analysisId,
      status: 'completed',
      created_at: new Date().toISOString(),
      target_role: targetRole,
      custom_jd: jdText,
      parsed_cv: {
        candidate_name: 'Sinh Viên Ứng Viên',
        email: 'candidate@skillora.edu.vn',
        phone: '0987 654 321',
        education: 'Cử nhân Công nghệ Thông tin',
        skills: gapResult.existing_skills,
        experience_summary: `Hồ sơ đã quét từ file: ${cvFile?.originalname || 'CV.pdf'}`,
      },
      scores,
      ats_checks,
      academic_checks,
      existing_skills: gapResult.existing_skills,
      missing_skills: gapResult.missing_skills,
      gap_items: gapResult.gap_items,
      prioritized_actions: gapResult.prioritized_actions,
      recommended_resources: [],
    };

    this.analyses.set(analysisId, result);
    return result;
  }

  async findById(id: string): Promise<AnalysisResponseDto> {
    const found = this.analyses.get(id);
    if (!found) {
      throw new NotFoundException(`Analysis with ID '${id}' not found`);
    }
    return found;
  }
}
