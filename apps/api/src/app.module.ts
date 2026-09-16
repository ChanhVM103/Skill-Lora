import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './modules-system/prisma/prisma.module.js';
import { TokenModule } from './modules-system/token/token.module.js';
import { ApiKeyModule } from './modules-system/apikey/apikey.module.js';
import { AuthModule } from './modules-api/auth/auth.module.js';
import { UsersModule } from './modules-api/users/users.module.js';
import { ProfileModule } from './modules-api/profile/profile.module.js';
import { RoadmapModule } from './roadmap/roadmap.module.js';
import { CvModule } from './modules-api/cv/cv.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/api/.env'],
    }),
    PrismaModule,
    TokenModule,
    ApiKeyModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    RoadmapModule,
    CvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

