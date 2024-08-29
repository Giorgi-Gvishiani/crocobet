// Nest
import { Inject, Injectable } from '@nestjs/common';

// Cache manager
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  protected async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get<T>(key);
  }

  protected async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  protected async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  protected async reset(): Promise<void> {
    await this.cacheManager.reset();
  }
}
