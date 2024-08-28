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
import { CacheService } from '../../cache/cache.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
  controllers: [BookController],
  providers: [BookService, CacheService, BookRepository],
})
export class BookModule {}
