import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBaselineDto {
  @ApiProperty({
    description:
      'Vị trí mong muốn / Target role (ví dụ: frontend_reactjs, backend_nestjs, fullstack_developer, data_analyst, ai_engineer)',
    example: 'frontend_reactjs',
  })
  @IsNotEmpty({ message: 'Vui lòng chọn vị trí mục tiêu (target_role)' })
  @IsString()
  target_role: string;

  @ApiPropertyOptional({
    description: 'Mô tả công việc mục tiêu bổ sung (Job Description text tùy chọn)',
    example: 'Tuyển dụng Senior React/Next.js Engineer tối ưu hiệu năng SSR và Web Vitals',
  })
  @IsOptional()
  @IsString()
  jd_text?: string;
}
