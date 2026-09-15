import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { PrismaService } from '../../../modules-system/prisma/prisma.service.js';
import bcrypt from 'bcrypt';
import { TokenService } from '../../../modules-system/token/token.service.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async login(body: LoginDto) {
    const { email, password } = body;

    const userExists = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new BadRequestException('Xin vui lòng đăng ký trước khi đăng nhập');
    }

    if (!userExists.passwordHash) {
      throw new BadRequestException(
        'Tài khoản chưa có mật khẩu, vui lòng đăng nhập bằng hình thức khác hoặc cập nhật mật khẩu',
      );
    }

    const isPasswordValid = bcrypt.compareSync(password, userExists.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu chưa chính xác');
    }

    const tokens = this.tokenService.createTokens(userExists.id);

    return {
      message: 'Đăng nhập thành công',
      user: {
        id: userExists.id,
        email: userExists.email,
        fullName: userExists.fullName,
        role: userExists.role,
      },
      ...tokens,
    };
  }
}
