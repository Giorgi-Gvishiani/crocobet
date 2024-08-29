// Nest
import { Module } from '@nestjs/common';

// Config
import { ConfigModule } from '@nestjs/config';

// Mongo
import { MongoDbConfig } from './database/mongodb.config';
import { MongooseModule } from '@nestjs/mongoose';

// Cache
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './cache/redis.config';

// Strategy
import { JwtStrategy } from './strategies/jwt.strategy';

// Module
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { PageModule } from './modules/page/page.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [],
      useClass: MongoDbConfig,
    }),
    CacheModule.registerAsync({
      imports: [],
      useClass: RedisConfig,
      isGlobal: true,
    }),
    AuthModule,
    BookModule,
    PageModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
