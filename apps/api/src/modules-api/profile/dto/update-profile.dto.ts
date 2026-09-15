import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyen Van A', description: 'Họ và tên' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../avatar.jpg', description: 'URL avatar' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: '0912345678', description: 'Số điện thoại' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '2002-05-15', description: 'Ngày sinh (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'nam', description: 'Giới tính (nam/nữ/khác)' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: 'Sinh viên năm 4 ngành CNTT', description: 'Tiểu sử / Bio' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'Đại học Khoa học Tự nhiên', description: 'Trường học' })
  @IsString()
  @IsOptional()
  school?: string;

  @ApiPropertyOptional({ example: 'Công nghệ thông tin', description: 'Chuyên ngành' })
  @IsString()
  @IsOptional()
  major?: string;

  @ApiPropertyOptional({ example: 'backend_developer', description: 'Vị trí công việc mục tiêu' })
  @IsString()
  @IsOptional()
  targetRole?: string;

  @ApiPropertyOptional({ example: 'TP. Hồ Chí Minh', description: 'Địa chỉ' })
  @IsString()
  @IsOptional()
  address?: string;
}
