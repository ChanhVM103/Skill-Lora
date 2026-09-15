import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ProtectGuard } from '../../common/guards/protect.guard.js';
import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(ProtectGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin cá nhân của người dùng đang đăng nhập' })
  @ApiResponse({ status: 200, description: 'Thông tin cá nhân.' })
  async getProfile(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.profileService.getProfile(userId);
  }

  @Put()
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân (PUT)' })
  @ApiResponse({ status: 200, description: 'Thông tin sau khi cập nhật.' })
  async updateProfile(@Req() req: Request, @Body() body: UpdateProfileDto) {
    const userId = (req as any).user.id;
    return this.profileService.updateProfile(userId, body);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload avatar người dùng lên Cloudinary' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File hình ảnh avatar (jpg, png, webp...)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Upload avatar thành công.' })
  async uploadAvatar(@Req() req: Request, @UploadedFile() file: any) {
    const userId = (req as any).user.id;
    return this.profileService.uploadAvatar(userId, file);
  }
}
