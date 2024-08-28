// Nest
import { Module } from '@nestjs/common';

// Config
import { ConfigModule } from '@nestjs/config';

// Mongo
import { MongoDbConfig } from './database/mongodb.config';
import { MongooseModule } from '@nestjs/mongoose';

// Strategy
import { JwtStrategy } from './strategies/jwt.strategy';

// Controller
import { AppController } from './app.controller';

// Service
import { AppService } from './app.service';

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
    AuthModule,
    BookModule,
    PageModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
