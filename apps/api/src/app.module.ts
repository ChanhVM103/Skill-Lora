import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './modules-system/prisma/prisma.module.js';
import { TokenModule } from './modules-system/token/token.module.js';
import { ApiKeyModule } from './modules-system/apikey/apikey.module.js';
import { AuthModule } from './modules-api/users/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TokenModule,
    ApiKeyModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
