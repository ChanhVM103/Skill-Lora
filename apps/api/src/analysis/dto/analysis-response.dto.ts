import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  RoadmapGapItemDto,
  TargetRole,
} from '../../roadmap/dto/generate-roadmap-request.dto.js';

export class ParsedCvDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  candidate_name?: string;

  @ApiPropertyOptional({ example: 'nguyenvana@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: '0912 345 678' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Cử nhân CNTT - Đại học Quốc Gia' })
  education?: string;

  @ApiProperty({ example: ['Git & GitHub', 'JavaScript', 'SQL'] })
  skills: string[];

  @ApiPropertyOptional({ example: 'Có 2 đồ án môn học đại học' })
  experience_summary?: string;
}

export class AnalysisScoresDto {
  @ApiProperty({ example: 68 })
  readiness_score: number;

  @ApiProperty({ example: 82 })
  ats_score: number;

  @ApiProperty({ example: 75 })
  academic_score: number;

  @ApiProperty({ example: 64 })
  match_percentage: number;

  @ApiProperty({ example: 'Foundational' })
  level_tier: 'Beginner' | 'Foundational' | 'Competent' | 'Role Ready';
}

export class AtsCheckDto {
  @ApiProperty({ example: 'ats_1' })
  id: string;

  @ApiProperty({ example: 'Định dạng tài liệu' })
  check_name: string;

  @ApiProperty({ example: 'passed' })
  status: 'passed' | 'warning' | 'failed';

  @ApiProperty({ example: 'File có bố cục rõ ràng, dễ phân tích.' })
  message: string;
}

export class AcademicCheckDto {
  @ApiProperty({ example: 'acad_1' })
  id: string;

  @ApiProperty({ example: 'Cơ sở dữ liệu & Giải thuật' })
  subject: string;

  @ApiProperty({ example: 'strong' })
  status: 'strong' | 'acceptable' | 'gap';

  @ApiProperty({ example: 'Điểm các môn nền tảng đạt loại khá giỏi.' })
  feedback: string;
}

export class PrioritizedActionDto {
  @ApiProperty({ example: 'act_1' })
  id: string;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 'Học thiết kế & kiểm thử REST API' })
  title: string;

  @ApiProperty({ example: 'Nắm vững HTTP Status Code, DTO Validation...' })
  description: string;

  @ApiProperty({ example: 'high' })
  priority: 'high' | 'medium' | 'low';

  @ApiProperty({ example: 'Core Skill' })
  category: string;
}

export class AnalysisResponseDto {
  @ApiProperty({ example: 'analysis_1726500000000' })
  analysis_id: string;

  @ApiProperty({ example: 'completed' })
  status: 'completed' | 'failed' | 'processing';

  @ApiProperty({ example: '2026-09-17T00:00:00.000Z' })
  created_at: string;

  @ApiProperty({ enum: TargetRole, example: TargetRole.BackendDeveloper })
  target_role: TargetRole;

  @ApiPropertyOptional({ example: 'Yêu cầu NestJS & PostgreSQL' })
  custom_jd?: string;

  @ApiProperty({ type: ParsedCvDto })
  parsed_cv: ParsedCvDto;

  @ApiProperty({ type: AnalysisScoresDto })
  scores: AnalysisScoresDto;

  @ApiProperty({ type: [AtsCheckDto] })
  ats_checks: AtsCheckDto[];

  @ApiProperty({ type: [AcademicCheckDto] })
  academic_checks: AcademicCheckDto[];

  @ApiProperty({ example: ['Git & GitHub', 'TypeScript'] })
  existing_skills: string[];

  @ApiProperty({ example: ['REST API', 'Docker'] })
  missing_skills: string[];

  @ApiProperty({ type: [RoadmapGapItemDto] })
  gap_items: RoadmapGapItemDto[];

  @ApiProperty({ type: [PrioritizedActionDto] })
  prioritized_actions: PrioritizedActionDto[];

  @ApiPropertyOptional({ example: [] })
  recommended_resources?: any[];
}
