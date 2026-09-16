import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RoadmapController } from './roadmap.controller.js';
import { RoadmapService } from './roadmap.service.js';

import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        // Strip quotes if any
        const url = process.env.REDIS_URL?.replace(/^"|"$/g, '');
        if (url) {
          return {
            store: await redisStore({
              url: url,
              ttl: 1000 * 60 * 60 * 24, // 1 day
            }),
          };
        }
        return {
          ttl: 1000 * 60 * 60 * 24,
        };
      },
    }),
  ],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {}
