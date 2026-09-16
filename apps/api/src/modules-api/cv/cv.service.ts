import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../modules-system/prisma/prisma.service.js';
import { CloudinaryService } from '../../modules-system/cloudinary/cloudinary.service.js';
import { IngestionService } from './services/ingestion.service.js';
import { BaselineParserService } from './services/baseline-parser.service.js';
import { QuestionGeneratorService } from './services/question-generator.service.js';
import { RubricEvaluatorService, QaPairItem } from './services/rubric-evaluator.service.js';
import { CreateBaselineDto } from './dto/create-baseline.dto.js';
import { SubmitAnswersDto } from './dto/submit-answers.dto.js';
import { BaselineResponseDto, EvaluationResponseDto } from './dto/cv-assessment-response.dto.js';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly ingestionService: IngestionService,
    private readonly baselineParserService: BaselineParserService,
    private readonly questionGeneratorService: QuestionGeneratorService,
    private readonly rubricEvaluatorService: RubricEvaluatorService,
  ) {}

  /**
   * Lượt gọi 1 (Call 1): Upload CV + target_role -> Trả về Baseline + Sinh bộ câu hỏi phỏng vấn (Bước 1 + 2)
   */
  async createBaselineAndQuestions(
    file: any,
    dto: CreateBaselineDto,
    userId?: string,
  ): Promise<BaselineResponseDto> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Vui lòng tải lên file CV hợp lệ (cv_file)');
    }

    const targetRole = dto.target_role || 'frontend_reactjs';
    this.logger.log(`Processing Call 1 Baseline & Questions for target_role: ${targetRole}`);

    // 1. File Ingestion -> Extract Raw CV Text
    const cvData = await this.ingestionService.processCvFile(
      file.buffer,
      file.originalname || 'cv.pdf',
      file.mimetype || 'application/pdf',
    );

    // Save extracted text debug file
    try {
      const textFilePath = path.join(process.cwd(), 'temp_extracted_cv_text.txt');
      fs.writeFileSync(textFilePath, cvData.rawText, 'utf-8');
    } catch (txtErr) {}

    // 2. Upload to Cloudinary (Async/Optional)
    let cvFileUrl: string | undefined;
    try {
      const uploadRes = await this.cloudinaryService.uploadFile(file);
      cvFileUrl = uploadRes.secure_url;
    } catch (cloudErr) {
      this.logger.warn(`Cloudinary upload skipped: ${cloudErr instanceof Error ? cloudErr.message : String(cloudErr)}`);
    }

    // 3. Step 1: Parse Baseline
    const baselineResult = await this.baselineParserService.parseBaseline(
      cvData.rawText,
      targetRole,
      file.buffer,
      file.mimetype,
    );

    // 4. Step 2: Generate Level-benchmarked Questions
    const questionsResult = await this.questionGeneratorService.generateQuestions(
      baselineResult,
      targetRole,
    );

    const questionsList = questionsResult?.questions || [];

    // 5. Save Session to MongoDB via Prisma
    let savedRecord: any;
    try {
      savedRecord = await this.prismaService.cvAnalysis.create({
        data: {
          userId: userId || undefined,
          cvFileName: file.originalname || 'cv.pdf',
          cvFileUrl: cvFileUrl || null,
          targetRole: targetRole,
          status: 'QUESTIONS_GENERATED',
          rawCvText: cvData.rawText,
          baselineResult: baselineResult as any,
          questionsResult: questionsList as any,
          currentLevel: baselineResult.hypothesis_level_calculation?.estimated_level,
        },
      });
    } catch (dbErr) {
      this.logger.warn(`Database insert error: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`);
      savedRecord = {
        id: `session_${Date.now()}`,
        createdAt: new Date(),
      };
    }

    return {
      session_id: savedRecord.id,
      target_role: targetRole,
      status: 'QUESTIONS_GENERATED',
      hypothesis_level: baselineResult.hypothesis_level_calculation as any,
      interview_questions: questionsList as any,
    };
  }

  /**
   * Lượt gọi 2 (Call 2): Submit câu trả lời -> Tự động ghép dữ liệu & Chấm Rubric L1-L5 (Bước 3 + 4)
   */
  async submitAnswersAndEvaluate(
    sessionId: string,
    dto: SubmitAnswersDto,
  ): Promise<EvaluationResponseDto> {
    this.logger.log(`Processing Call 2 Evaluation for session_id: ${sessionId}`);

    // 1. Fetch Session from DB
    let sessionRecord: any;
    try {
      sessionRecord = await this.prismaService.cvAnalysis.findUnique({
        where: { id: sessionId },
      });
    } catch (dbErr) {
      this.logger.warn(`DB find error: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`);
    }

    if (!sessionRecord) {
      throw new NotFoundException(`Không tìm thấy phiên phỏng vấn CV với ID: ${sessionId}`);
    }

    const rawCvText = sessionRecord.rawCvText || '';
    const baselineResult = (sessionRecord.baselineResult as any) || {};
    const storedQuestions = sessionRecord.questionsResult;
    const questionsArray: any[] = Array.isArray(storedQuestions)
      ? storedQuestions
      : Array.isArray((storedQuestions as any)?.questions)
        ? (storedQuestions as any).questions
        : [];
    const targetRole = sessionRecord.targetRole || 'frontend_reactjs';

    // 2. Pair Questions with Candidate Answers
    const answersMap = new Map<string, string>();
    (dto?.answers || []).forEach((item) => {
      answersMap.set(item.question_id, item.candidate_answer);
    });

    const qaPairs: QaPairItem[] = questionsArray.map((q) => ({
      question_id: q.question_id,
      axis: q.axis,
      target_level_benchmark: q.target_level_benchmark || 'Level 3',
      project_referenced: q.project_referenced || 'Project',
      feature_referenced: q.feature_referenced || 'Feature',
      question_text: q.question_text,
      candidate_answer:
        answersMap.get(q.question_id) || 'Ứng viên chưa nhập câu trả lời cho câu hỏi này.',
    }));

    // 3. Step 4: Evaluate Rubric & Generate Role-Tailored Level-Up Blueprint
    const evaluationResult = await this.rubricEvaluatorService.evaluateRubric(
      rawCvText,
      baselineResult,
      targetRole,
      qaPairs,
    );

    // 4. Update Database Session Record
    const overallLevel = evaluationResult.hypothesis_level_verification?.current_verified_level || 'Level 3';
    const techScore = evaluationResult.scores_by_axis?.technology?.score || 75;

    try {
      await this.prismaService.cvAnalysis.update({
        where: { id: sessionId },
        data: {
          status: 'EVALUATED',
          answersResult: dto.answers as any,
          evaluationResult: evaluationResult as any,
          currentLevel: overallLevel,
          competencyScore: techScore,
        },
      });
    } catch (updateErr) {
      this.logger.warn(`DB update error: ${updateErr instanceof Error ? updateErr.message : String(updateErr)}`);
    }

    return {
      session_id: sessionId,
      target_role: targetRole,
      status: 'EVALUATED',
      hypothesis_level_verification: evaluationResult.hypothesis_level_verification,
      scores_by_axis: evaluationResult.scores_by_axis,
      evidence_ledger: evaluationResult.evidence_ledger,
      actionable_level_up_blueprint: evaluationResult.actionable_level_up_blueprint,
    };
  }

  /**
   * Lấy danh sách lịch sử phân tích CV (Gọn nhẹ: id, cvFileName, targetRole, status, createdAt)
   */
  async getUserCvHistory(userId: string) {
    return this.prismaService.cvAnalysis.findMany({
      where: { userId },
      select: {
        id: true,
        cvFileName: true,
        targetRole: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lấy thông tin chi tiết phân tích CV theo ID (Được cấu trúc 3 phần rõ ràng)
   */
  async getCvAnalysisById(id: string) {
    const analysis = await this.prismaService.cvAnalysis.findUnique({
      where: { id },
    });

    if (!analysis) {
      throw new NotFoundException(`Không tìm thấy kết quả phân tích CV với ID: ${id}`);
    }

    const storedQuestions = analysis.questionsResult;
    const questionsArray: any[] = Array.isArray(storedQuestions)
      ? storedQuestions
      : Array.isArray((storedQuestions as any)?.questions)
        ? (storedQuestions as any).questions
        : [];

    const storedAnswers = analysis.answersResult;
    const answersMap = new Map<string, string>();
    if (Array.isArray(storedAnswers)) {
      storedAnswers.forEach((item: any) => {
        if (item?.question_id) {
          answersMap.set(item.question_id, item.candidate_answer);
        }
      });
    }

    const qaPairs = questionsArray.map((q: any) => ({
      question_id: q.question_id,
      axis: q.axis,
      target_level_benchmark: q.target_level_benchmark,
      project_referenced: q.project_referenced,
      feature_referenced: q.feature_referenced,
      question_text: q.question_text,
      verification_goal: q.verification_goal,
      candidate_answer: answersMap.get(q.question_id) || null,
    }));

    const baseline = analysis.baselineResult as any;
    const evaluation = analysis.evaluationResult as any;

    return {
      session_id: analysis.id,
      cv_file_name: analysis.cvFileName,
      cv_file_url: analysis.cvFileUrl,
      target_role: analysis.targetRole,
      status: analysis.status,
      created_at: analysis.createdAt,

      // 1. Kết quả nhận định ban đầu sau khi gửi CV
      hypothesis_level: baseline?.hypothesis_level_calculation || baseline || null,

      // 2. Danh sách 8 câu hỏi kèm câu trả lời của ứng viên
      qa_pairs: qaPairs,

      // 3. Kết quả đánh giá cuối cùng kèm Lộ trình học nâng level
      evaluation_verdict: evaluation?.hypothesis_level_verification || null,
      scores_by_axis: evaluation?.scores_by_axis || null,
      evidence_ledger: evaluation?.evidence_ledger || null,
      actionable_level_up_blueprint: evaluation?.actionable_level_up_blueprint || null,
    };
  }

  /**
   * Xóa 1 phiên phân tích CV theo ID
   */
  async deleteCvAnalysisById(id: string, userId?: string) {
    const analysis = await this.prismaService.cvAnalysis.findUnique({
      where: { id },
    });

    if (!analysis) {
      throw new NotFoundException(`Không tìm thấy phiên phân tích CV với ID: ${id}`);
    }

    if (userId && analysis.userId && analysis.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa phiên phân tích này');
    }

    await this.prismaService.cvAnalysis.delete({
      where: { id },
    });

    return {
      message: 'Xóa phiên phân tích CV thành công',
      id,
    };
  }
}
