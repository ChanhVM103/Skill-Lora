import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import {
  ResourceDifficulty,
  ResourceType,
} from '../../roadmap/dto/generate-roadmap-request.dto.js';

export class CreateResourceDto {
  @ApiProperty({ example: 'Xây Dựng REST API Chuẩn với NestJS & TypeScript' })
  @IsString()
  title: string;

  @ApiProperty({ enum: ResourceType, example: ResourceType.Lecture })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({
    example: ['NestJS', 'REST API', 'TypeScript'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  skill_tags: string[];

  @ApiProperty({
    enum: ResourceDifficulty,
    example: ResourceDifficulty.Beginner,
  })
  @IsEnum(ResourceDifficulty)
  difficulty: ResourceDifficulty;

  @ApiPropertyOptional({ example: 'https://docs.nestjs.com/first-steps' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    example:
      'Hướng dẫn kiến trúc Controller, Service, Module, DTO Validation và tạo tài liệu OpenAPI Swagger chuẩn chỉnh.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'ThS. Trần Hoàng Nam' })
  @IsOptional()
  @IsString()
  author?: string;
}
