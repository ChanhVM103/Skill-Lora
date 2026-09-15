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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TokenModule,
    ApiKeyModule,
    AuthModule,
    UsersModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
