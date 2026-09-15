import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Users } from '@prisma/client';

export type SafeUser = Omit<Users, 'passwordHash' | 'v'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserDto & { passwordHash: string }): Promise<SafeUser> {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.prisma.users.create({
      data: {
        email: input.email.toLowerCase(),
        fullName: input.fullName,
        passwordHash: input.passwordHash,
        role: input.role ?? 'student',
      },
    });

    return this.toSafeUser(user);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.users.findMany();
    return users.map(user => this.toSafeUser(user));
  }

  async findById(id: string): Promise<SafeUser | null> {
    if (!id || id.length !== 24) return null; // MongoDB ObjectId length check

    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    return user ? this.toSafeUser(user) : null;
  }

  async update(id: string, updateData: UpdateUserDto): Promise<SafeUser | null> {
    if (!id || id.length !== 24) return null;

    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: updateData,
      });
      return this.toSafeUser(user);
    } catch (e) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!id || id.length !== 24) return false;

    try {
      await this.prisma.users.delete({
        where: { id },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  toSafeUser(user: Users): SafeUser {
    const { passwordHash, v, ...safeUser } = user;
    return safeUser;
  }
}
