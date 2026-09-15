import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { PrismaService } from '../../../modules-system/prisma/prisma.service.js';
import bcrypt from 'bcrypt';
import { TokenService } from '../../../modules-system/token/token.service.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
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
        role: 'student', // Default role for self-registered users
      },
    });

    const tokens = this.tokenService.createTokens(user.id);

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
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
      throw new BadRequestException('Please register before logging in');
    }

    if (!userExists.passwordHash) {
      throw new BadRequestException(
        'Account does not have a password, please login using another method or update your password',
      );
    }

    const isPasswordValid = bcrypt.compareSync(password, userExists.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password');
    }

    const tokens = this.tokenService.createTokens(userExists.id);

    return {
      message: 'Login successful',
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
