import { Users, type Users as UsersAsType } from './users';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CvAnalysis {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: String })
  userId?: string;

  @ApiPropertyOptional({ type: () => Users })
  user?: UsersAsType;

  @ApiProperty({ type: String })
  cvFileName: string;

  @ApiPropertyOptional({ type: String })
  cvFileUrl?: string;

  @ApiProperty({ type: String })
  targetRole: string;

  @ApiProperty({ type: String, example: 'BASELINE_CREATED' })
  status: string = 'BASELINE_CREATED';

  @ApiPropertyOptional({ type: String })
  rawCvText?: string;

  @ApiPropertyOptional({ type: Object })
  baselineResult?: object;

  @ApiPropertyOptional({ type: Object })
  questionsResult?: object;

  @ApiPropertyOptional({ type: Object })
  answersResult?: object;

  @ApiPropertyOptional({ type: Object })
  evaluationResult?: object;

  @ApiPropertyOptional({ type: Number })
  competencyScore?: number;

  @ApiPropertyOptional({ type: String })
  currentLevel?: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
