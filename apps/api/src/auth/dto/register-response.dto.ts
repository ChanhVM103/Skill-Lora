import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/schemas/user.schema.js';

export class UserResponseDto {
  @ApiProperty({ example: '66e9f0b9f3b2b1a1b3c4d5e6' })
  id: string;

  @ApiProperty({ example: 'student@skillora.local' })
  email: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  fullName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.Student })
  role: UserRole;
}

export class RegisterResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
