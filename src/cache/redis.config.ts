// Config
import { ConfigModule } from '@nestjs/config';

// Cache manager
import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';

// Redis
import { redisStore } from 'cache-manager-redis-yet';

// Mongo

ConfigModule.forRoot({
  envFilePath: ['.env'],
});

const config: CacheOptions = {
  ttl: 6_000,
  store: async () =>
    await redisStore({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
};

export class RedisConfig implements CacheOptionsFactory {
  createCacheOptions():
    | Promise<CacheOptions<Record<string, any>>>
    | CacheOptions<Record<string, any>> {
    return config;
  }
}
