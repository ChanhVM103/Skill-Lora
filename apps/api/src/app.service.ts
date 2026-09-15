import { Injectable } from '@nestjs/common';

export interface HealthResponse {
  status: 'ok';
  service: 'skillora-api';
  timestamp: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'skillora-api',
      timestamp: new Date().toISOString(),
    };
  }
}
