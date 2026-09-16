import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  ResourceDifficulty,
  ResourceType,
} from '../../roadmap/dto/generate-roadmap-request.dto.js';

export class QueryResourceDto {
  @ApiPropertyOptional({ description: 'Tìm kiếm theo từ khóa trong tiêu đề, mô tả hoặc tag' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo tag kỹ năng cụ thể (ví dụ: SQL, Docker, NestJS)' })
  @IsOptional()
  @IsString()
  skill_tag?: string;

  @ApiPropertyOptional({ enum: ResourceDifficulty, description: 'Lọc theo độ khó' })
  @IsOptional()
  @IsEnum(ResourceDifficulty)
  difficulty?: ResourceDifficulty;

  @ApiPropertyOptional({ enum: ResourceType, description: 'Lọc theo thể loại tài liệu' })
  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;
}
