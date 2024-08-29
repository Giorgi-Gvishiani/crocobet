// Nest
import { Module } from '@nestjs/common';

// Mongo
import { MongooseModule } from '@nestjs/mongoose';

// Model
import { BookSchema } from '../../database/models/book.model';

// Repository
import { BookRepository } from '../../database/repositories/book.repository';

// Controller
import { BookController } from './book.controller';

// Service
import { BookService } from './book.service';
import { BookRedisService } from '../../cache/services/book-redis.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
  controllers: [BookController],
  providers: [BookService, BookRedisService, BookRepository],
})
export class BookModule {}
