import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserRole } from '../users/schemas/user.schema.js';
import { SafeUser, UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: {
    email: string;
    fullName: string;
    password: string;
  }): Promise<SafeUser> {
    this.assertPassword(input.password);

    const passwordHash = await bcrypt.hash(input.password, 12);
    return this.usersService.create({
      email: input.email,
      fullName: input.fullName,
      passwordHash,
      role: UserRole.Student,
    });
  }

  async login(input: { email: string; password: string }) {
    const user = await this.usersService.findByEmailWithPassword(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(this.usersService.toSafeUser(user));
  }

  private async buildAuthResponse(user: SafeUser) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, accessToken };
  }

  private assertPassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
  }
}
