import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TargetRole } from '../../roadmap/dto/generate-roadmap-request.dto.js';

export class AnalyzeRequestDto {
  @ApiProperty({
    enum: TargetRole,
    example: TargetRole.BackendDeveloper,
    description: 'Vai trò nghề nghiệp mục tiêu của sinh viên',
  })
  @IsEnum(TargetRole)
  target_role: TargetRole;

  @ApiPropertyOptional({
    example: 'Yêu cầu 1 năm kinh nghiệm NestJS, PostgreSQL, viết RESTful API...',
    description: 'Mô tả công việc (Job Description) cụ thể nếu muốn so khớp',
  })
  @IsOptional()
  @IsString()
  jd_text?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File CV / Sơ yếu lý lịch (PDF hoặc DOCX)',
  })
  cv_file: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'File bảng điểm đại học Transcript (PDF hoặc hình ảnh)',
  })
  transcript_file?: any;
}
