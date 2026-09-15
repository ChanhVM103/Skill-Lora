import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrismaModule } from '../../modules-system/prisma/prisma.module.js';
import { TokenModule } from '../../modules-system/token/token.module.js';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
