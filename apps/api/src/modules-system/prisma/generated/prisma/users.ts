import { CvAnalysis, type CvAnalysis as CvAnalysisAsType } from './cv_analysis';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Users {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiPropertyOptional({ type: String })
  fullName?: string;

  @ApiPropertyOptional({ type: String })
  avatar?: string;

  @ApiPropertyOptional({ type: String })
  phone?: string;

  @ApiPropertyOptional({ type: String })
  dateOfBirth?: string;

  @ApiPropertyOptional({ type: String })
  gender?: string;

  @ApiPropertyOptional({ type: String })
  bio?: string;

  @ApiPropertyOptional({ type: String })
  school?: string;

  @ApiPropertyOptional({ type: String })
  major?: string;

  @ApiPropertyOptional({ type: String })
  targetRole?: string;

  @ApiPropertyOptional({ type: String })
  address?: string;

  @ApiPropertyOptional({ type: String })
  passwordHash?: string;

  @ApiPropertyOptional({ type: String, example: 'users' })
  role?: string = 'users';

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: Number })
  v?: number;

  @ApiProperty({ isArray: true, type: () => CvAnalysis })
  cvAnalyses: CvAnalysisAsType[];
}
