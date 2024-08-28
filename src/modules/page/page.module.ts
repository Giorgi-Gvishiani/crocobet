// Nest
import { Module } from '@nestjs/common';

// Mongo
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '../../database/models/book.model';
import { Page, PageSchema } from '../../database/models/page.model';

// Repository
import { PageRepository } from '../../database/repositories/page.repository';
import { BookRepository } from '../../database/repositories/book.repository';

// Controller
import { PageController } from './page.controller';

// Service
import { PageService } from './page.service';
import { CacheService } from '../../cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [PageController],
  providers: [PageService, CacheService, PageRepository, BookRepository],
})
export class PageModule {}
