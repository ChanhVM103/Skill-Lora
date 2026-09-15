import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service.js';
import { TokenService } from '../../modules-system/token/token.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export type SafeUser = Omit<Users, 'passwordHash' | 'v'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterDto) {
    const { email, password, fullName } = body;

    const userExists = await this.prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (userExists) {
      throw new ConflictException('Email is already registered');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.users.create({
      data: {
        email: email.toLowerCase(),
        fullName,
        passwordHash,
        role: 'users',
      },
    });

    const tokens = this.tokenService.createTokens(user.id);

    return {
      message: 'Registration successful',
      user: this.toSafeUser(user),
      ...tokens,
    };
  }

  async login(body: LoginDto) {
    const { email, password } = body;

    const userExists = await this.prisma.users.findUnique({
      where: {
        email: email.toLowerCase(),
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
      user: this.toSafeUser(userExists),
      ...tokens,
    };
  }

  async changePassword(userId: string, body: ChangePasswordDto) {
    const { oldPassword, newPassword } = body;

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('Tài khoản chưa có mật khẩu, không thể đổi mật khẩu');
    }

    const isPasswordValid = bcrypt.compareSync(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException('Mật khẩu mới không được giống mật khẩu cũ');
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.prisma.users.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return {
      message: 'Đổi mật khẩu thành công',
    };
  }

  toSafeUser(user: Users): SafeUser {
    const { passwordHash, v, ...safeUser } = user;
    return safeUser;
  }
}
