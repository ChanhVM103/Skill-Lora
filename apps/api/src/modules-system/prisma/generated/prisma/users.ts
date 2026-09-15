import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Users {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiPropertyOptional({ type: String })
  fullName?: string;

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
}
