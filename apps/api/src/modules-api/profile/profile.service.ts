import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service.js';
import { CloudinaryService } from '../../modules-system/cloudinary/cloudinary.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { Users } from '@prisma/client';

export type SafeUser = Omit<Users, 'passwordHash' | 'v'>;

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return this.toSafeUser(user);
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<SafeUser> {
    const userExists = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.school !== undefined && { school: data.school }),
        ...(data.major !== undefined && { major: data.major }),
        ...(data.targetRole !== undefined && { targetRole: data.targetRole }),
        ...(data.address !== undefined && { address: data.address }),
      },
    });

    return this.toSafeUser(updatedUser);
  }

  async uploadAvatar(userId: string, file: any) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh để upload');
    }

    const uploadResult = await this.cloudinaryService.uploadFile(file, 'skillora/avatars');
    const avatarUrl = uploadResult.secure_url || uploadResult.url;

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return {
      url: avatarUrl,
      user: this.toSafeUser(updatedUser),
    };
  }

  toSafeUser(user: Users): SafeUser {
    const { passwordHash, v, ...safeUser } = user;
    return safeUser;
  }
}
