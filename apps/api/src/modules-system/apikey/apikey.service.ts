import { Injectable } from '@nestjs/common';
import { API_KEY } from '../../common/constant/app.constant.js';

@Injectable()
export class ApiKeyService {
  getApiKey(): string {
    return API_KEY || '';
  }
}
