import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TargetRole {
  DataAnalyst = 'data_analyst',
  BackendDeveloper = 'backend_developer',
  AiEngineer = 'ai_engineer',
  DigitalMarketingSpecialist = 'digital_marketing_specialist',
}

export enum StartingLevel {
  NonItTransition = 'non_it_transition',
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  RoleReady = 'role_ready',
}

export enum GapCategory {
  Transition = 'transition',
  Foundation = 'foundation',
  Core = 'core',
  AppliedProject = 'applied_project',
  Portfolio = 'portfolio',
}

export enum GapSeverity {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export enum CurrentLevel {
  Missing = 'missing',
  Partial = 'partial',
  WeakEvidence = 'weak_evidence',
}

export enum TargetLevel {
  Basic = 'basic',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Portfolio = 'portfolio',
}

export enum ResourceType {
  Lecture = 'lecture',
  Assignment = 'assignment',
  Article = 'article',
  Video = 'video',
  Project = 'project',
  Quiz = 'quiz',
}

export enum ResourceDifficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export class RoadmapGapItemDto {
  @ApiProperty({ example: 'rest_api' })
  @IsString()
  skill_id: string;

  @ApiProperty({ example: 'REST API' })
  @IsString()
  skill_name: string;

  @ApiProperty({ enum: GapCategory, example: GapCategory.Core })
  @IsEnum(GapCategory)
  category: GapCategory;

  @ApiProperty({ enum: GapSeverity, example: GapSeverity.High })
  @IsEnum(GapSeverity)
  severity: GapSeverity;

  @ApiProperty({ enum: CurrentLevel, example: CurrentLevel.Missing })
  @IsEnum(CurrentLevel)
  current_level: CurrentLevel;

  @ApiProperty({ enum: TargetLevel, example: TargetLevel.Intermediate })
  @IsEnum(TargetLevel)
  target_level: TargetLevel;

  @ApiPropertyOptional({
    example: 'No REST API project evidence found in the uploaded CV.',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class RoadmapResourceDto {
  @ApiProperty({ example: 'res_001' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'REST API Basics' })
  @IsString()
  title: string;

  @ApiProperty({ enum: ResourceType, example: ResourceType.Lecture })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({ example: ['REST API', 'HTTP'] })
  @IsArray()
  @IsString({ each: true })
  skill_tags: string[];

  @ApiProperty({
    enum: ResourceDifficulty,
    example: ResourceDifficulty.Beginner,
  })
  @IsEnum(ResourceDifficulty)
  difficulty: ResourceDifficulty;

  @ApiPropertyOptional({ example: 'https://example.com/rest-api-basics' })
  @IsOptional()
  @IsUrl()
  url?: string;
}

export class GenerateRoadmapRequestDto {
  @ApiProperty({ enum: TargetRole, example: TargetRole.BackendDeveloper })
  @IsEnum(TargetRole)
  target_role: TargetRole;

  @ApiPropertyOptional({
    enum: StartingLevel,
    example: StartingLevel.Beginner,
    default: StartingLevel.Beginner,
  })
  @IsOptional()
  @IsEnum(StartingLevel)
  starting_level?: StartingLevel;

  @ApiProperty({ type: [RoadmapGapItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoadmapGapItemDto)
  gap_items: RoadmapGapItemDto[];

  @ApiPropertyOptional({ type: [RoadmapResourceDto], default: [] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoadmapResourceDto)
  resources?: RoadmapResourceDto[];
}
