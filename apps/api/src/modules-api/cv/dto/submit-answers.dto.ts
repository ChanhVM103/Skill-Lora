import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CandidateAnswerItemDto {
  @ApiProperty({
    description: 'Mã định danh câu hỏi (nhận từ Bước 2)',
    example: 'q_1',
  })
  @IsNotEmpty()
  @IsString()
  question_id: string;

  @ApiProperty({
    description: 'Câu trả lời thực tế của ứng viên cho câu hỏi',
    example:
      'Trong dự án E-Commerce, khi Redis bị timeout hoặc re-render liên tục, mình đã dùng useMemo kết hợp với ISR (Incremental Static Regeneration)...',
  })
  @IsNotEmpty()
  @IsString()
  candidate_answer: string;
}

export class SubmitAnswersDto {
  @ApiProperty({
    description: 'Danh sách các câu trả lời cho bộ câu hỏi phỏng vấn ở Bước 2',
    type: [CandidateAnswerItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CandidateAnswerItemDto)
  answers: CandidateAnswerItemDto[];
}
