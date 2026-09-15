import { Global, Module } from '@nestjs/common';
import { ApiKeyService } from './apikey.service.js';

@Global()
@Module({
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
