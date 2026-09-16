import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ResourceDifficulty,
  ResourceType,
} from '../../roadmap/dto/generate-roadmap-request.dto.js';

export class ResourceResponseDto {
  @ApiProperty({ example: 'res_001' })
  id: string;

  @ApiProperty({ example: 'Xây Dựng REST API Chuẩn với NestJS & TypeScript' })
  title: string;

  @ApiProperty({ enum: ResourceType, example: ResourceType.Lecture })
  type: ResourceType;

  @ApiProperty({ example: ['NestJS', 'REST API', 'TypeScript'] })
  skill_tags: string[];

  @ApiProperty({
    enum: ResourceDifficulty,
    example: ResourceDifficulty.Beginner,
  })
  difficulty: ResourceDifficulty;

  @ApiPropertyOptional({ example: 'https://docs.nestjs.com/first-steps' })
  url?: string;

  @ApiPropertyOptional({ example: 'Hướng dẫn kiến trúc Controller, Service, Module...' })
  description?: string;

  @ApiPropertyOptional({ example: 'ThS. Trần Hoàng Nam' })
  author?: string;

  @ApiProperty({ example: '2026-09-17T00:00:00.000Z' })
  created_at: string;
}
