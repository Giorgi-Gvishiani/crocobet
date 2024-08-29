// Nest
import { Injectable } from '@nestjs/common';

// Cache manager
import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';

// Redis
import { redisStore } from 'cache-manager-redis-yet';

@Injectable()
export class RedisConfig implements CacheOptionsFactory {
  private readonly config: CacheOptions;

  constructor() {
    this.config = {
      ttl: 6_000,
      store: async () =>
        await redisStore({
          url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        }),
    };
  }
  createCacheOptions():
    | Promise<CacheOptions<Record<string, any>>>
    | CacheOptions<Record<string, any>> {
    return this.config;
  }
}
