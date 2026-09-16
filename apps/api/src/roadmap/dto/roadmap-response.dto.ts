import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  GapCategory,
  ResourceDifficulty,
  StartingLevel,
  TargetRole,
} from './generate-roadmap-request.dto.js';

export enum RoadmapStepType {
  Theory = 'theory',
  Practice = 'practice',
  Assessment = 'assessment',
  Deliverable = 'deliverable',
  Review = 'review',
}

export enum ResourceStatus {
  Matched = 'matched',
  PartialMatch = 'partial_match',
  MissingInternalResource = 'missing_internal_resource',
}

export enum LessonSource {
  BackendFallback = 'backend_fallback',
  AiGenerated = 'ai_generated',
}

export enum AiGenerationStatus {
  NotConfigured = 'not_configured',
  RequestFailed = 'request_failed',
  EmptyResponse = 'empty_response',
  InvalidJson = 'invalid_json',
  ValidationFailed = 'validation_failed',
  Generated = 'generated',
}

export class ImprovementItemDto {
  @ApiProperty({ example: 'rest_api' })
  skill_id: string;

  @ApiProperty({ example: 'REST API' })
  skill_name: string;

  @ApiProperty({ enum: GapCategory, example: GapCategory.Core })
  category: GapCategory;

  @ApiProperty({ example: 10 })
  improvement_score: number;

  @ApiProperty({ example: 5 })
  role_importance: number;

  @ApiProperty({ example: 1 })
  recommended_week: number;

  @ApiProperty({ example: 'high' })
  severity: string;

  @ApiProperty({ example: 'missing' })
  current_level: string;

  @ApiPropertyOptional({ example: 'No REST API project evidence found.' })
  reason?: string;
}

export class ExternalCourseSuggestionDto {
  @ApiProperty({ example: 'rest_api' })
  skill_id: string;

  @ApiProperty({ example: 'REST API' })
  skill_name: string;

  @ApiProperty({ example: 'Coursera' })
  provider: string;

  @ApiProperty({ example: 'REST API beginner course' })
  search_query: string;

  @ApiProperty({ example: 'https://www.coursera.org/search?query=REST%20API%20beginner%20course' })
  search_url: string;

  @ApiProperty({ example: 'Use this as an optional external course search if no teacher resource is available.' })
  note: string;
}

export class RoadmapStepDto {
  @ApiProperty({ example: 'step_001' })
  step_id: string;

  @ApiProperty({ enum: RoadmapStepType, example: RoadmapStepType.Theory })
  type: RoadmapStepType;

  @ApiProperty({
    example:
      'Learn HTTP methods, REST conventions, status codes, and request validation',
  })
  title: string;

  @ApiProperty({ example: 'rest_api' })
  skill_id: string;

  @ApiProperty({ example: 'REST API' })
  skill_name: string;

  @ApiProperty({ enum: ResourceStatus, example: ResourceStatus.Matched })
  resource_status: ResourceStatus;

  @ApiProperty({ example: ['res_001'] })
  resources: string[];

  @ApiPropertyOptional({
    example: 'GitHub repository with API routes, README, and sample requests',
    nullable: true,
  })
  deliverable?: string | null;

  @ApiPropertyOptional({
    example: 'Ask a teacher to add a beginner resource for REST API.',
    nullable: true,
  })
  fallback_action?: string | null;
}

export class RoadmapPhaseDto {
  @ApiProperty({ example: 1 })
  phase: number;

  @ApiProperty({ enum: GapCategory, example: GapCategory.Core })
  key: GapCategory;

  @ApiProperty({ example: 'API and Database Core' })
  title: string;

  @ApiProperty({ example: 2 })
  duration_weeks: number;

  @ApiProperty({ example: ['REST API', 'SQL Database'] })
  focus_skills: string[];

  @ApiProperty({
    example:
      'This phase addresses high-priority core gaps for the selected role.',
  })
  why_this_phase: string;

  @ApiProperty({ type: [RoadmapStepDto] })
  steps: RoadmapStepDto[];
}

export class FourWeekLessonDto {
  @ApiProperty({ example: 'lesson_week_1_rest_api_1' })
  lesson_id: string;

  @ApiProperty({ example: 'HTTP Methods and REST Conventions' })
  title: string;

  @ApiProperty({ example: 'rest_api' })
  skill_id: string;

  @ApiProperty({ example: 'REST API' })
  skill_name: string;

  @ApiProperty({ example: 'Learn GET, POST, PUT, DELETE, status codes, and resource naming.' })
  activity: string;

  @ApiProperty({ example: 'Design endpoints for a task manager API.' })
  practice: string;

  @ApiProperty({ example: 'Endpoint list with request and response examples.' })
  deliverable: string;

  @ApiProperty({ example: ['res_001'] })
  teacher_resources: string[];

  @ApiProperty({ type: [ExternalCourseSuggestionDto] })
  external_courses: ExternalCourseSuggestionDto[];
}

export class FourWeekPlanDto {
  @ApiProperty({ example: 1 })
  week: number;

  @ApiProperty({ example: 'REST API Foundations' })
  theme: string;

  @ApiProperty({ example: ['REST API'] })
  focus_skills: string[];

  @ApiProperty({ type: [FourWeekLessonDto] })
  lessons: FourWeekLessonDto[];
}

export class ResourceGapAlertDto {
  @ApiProperty({ example: 'rest_api' })
  skill_id: string;

  @ApiProperty({ example: 'REST API' })
  skill_name: string;

  @ApiProperty({ enum: TargetRole, example: TargetRole.BackendDeveloper })
  target_role: TargetRole;

  @ApiProperty({
    enum: ResourceDifficulty,
    example: ResourceDifficulty.Beginner,
  })
  needed_difficulty: ResourceDifficulty;

  @ApiProperty({
    example: 'No matching teacher resource found for one or more roadmap steps.',
  })
  reason: string;
}

export class RoadmapResponseDto {
  @ApiProperty({ example: 'roadmap_mock_001' })
  roadmap_id: string;

  @ApiProperty({ enum: TargetRole, example: TargetRole.BackendDeveloper })
  target_role: TargetRole;

  @ApiProperty({ enum: StartingLevel, example: StartingLevel.Beginner })
  starting_level: StartingLevel;

  @ApiProperty({ example: 4 })
  estimated_duration_weeks: number;

  @ApiProperty({ type: [ImprovementItemDto] })
  improvement_items: ImprovementItemDto[];

  @ApiProperty({ type: [RoadmapPhaseDto] })
  phases: RoadmapPhaseDto[];

  @ApiProperty({ type: [FourWeekPlanDto] })
  four_week_plan: FourWeekPlanDto[];

  @ApiProperty({ enum: LessonSource, example: LessonSource.BackendFallback })
  lesson_source: LessonSource;

  @ApiProperty({
    enum: AiGenerationStatus,
    example: AiGenerationStatus.Generated,
  })
  ai_generation_status: AiGenerationStatus;

  @ApiProperty({ example: 'Create a 4-week learning plan for Backend Developer...' })
  ai_prompt: string;

  @ApiPropertyOptional({
    example: 'Gemini request failed with HTTP 400: API key not valid.',
    nullable: true,
  })
  ai_generation_error?: string | null;

  @ApiProperty({ type: [ResourceGapAlertDto] })
  resource_gap_alerts: ResourceGapAlertDto[];
}