import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { USER_ROLES } from './create-user.dto.js';
import type { UserRole } from './create-user.dto.js';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyen Van B' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ enum: USER_ROLES, example: 'teacher' })
  @IsIn(USER_ROLES)
  @IsOptional()
  role?: UserRole;
}
