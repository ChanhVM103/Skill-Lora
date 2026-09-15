import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';

export const USER_ROLES = ['student', 'teacher', 'admin'] as const;
export type UserRole = typeof USER_ROLES[number];

export class CreateUserDto {
  @ApiProperty({ example: 'teacher@skillora.local' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Nguyen Van Teacher' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: USER_ROLES, example: 'teacher' })
  @IsIn(USER_ROLES)
  @IsOptional()
  role?: UserRole;
}
