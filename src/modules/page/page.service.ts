// Nest
import { Injectable, BadRequestException } from '@nestjs/common';

// Model
import { Page } from '../../database/models/page.model';

// Repository
import { PageRepository } from '../../database/repositories/page.repository';
import { BookRepository } from '../../database/repositories/book.repository';

// Dto
import { PageDto } from './dto/page.dto';
import { PageListDto } from './dto/page-list.dto';
import { UpdatePageDto } from './dto/update-page.dto';

// Service
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class PageService {
  private pageLimit = 20;

  constructor(
    private readonly cacheService: CacheService,
    private readonly pageRepository: PageRepository,
    private readonly bookRepository: BookRepository,
  ) {}

  async create(payload: PageDto): Promise<PageDto> {
    const page = await this.pageRepository.create(payload);
    const book = await this.bookRepository.addPage(
      payload.book_id,
      page['_id'],
    );

    const cacheKey = `books:detail:${book['_id']}`;
    await this.cacheService.set(cacheKey, book);

    return this.pageMapper(page);
  }

  async update(id: string, payload: UpdatePageDto): Promise<void> {
    const page = await this.pageRepository.update(id, payload);

    if (!page) {
      throw new BadRequestException('Page does not exist!');
    }
  }

  async delete(id: string): Promise<void> {
    const page = await this.pageRepository.findOne(id);

    await this.pageRepository.delete(id);
    const book = await this.bookRepository.removePage(page.book.toString(), id);

    const cacheKey = `books:detail:${book['_id']}`;
    await this.cacheService.set(cacheKey, book);
  }

  async getOne(id: string): Promise<PageDto> {
    const page = await this.pageRepository.findOne(id);

    return this.pageMapper(page);
  }

  async getBookList(bookId: string, cursor: string): Promise<PageListDto> {
    let isLastPage = false;

    const response = await this.pageRepository.findMany(
      bookId,
      cursor,
      this.pageLimit,
    );

    if (response.length <= this.pageLimit) {
      isLastPage = true;
    } else {
      response.pop();
    }

    const pages = response.map(this.pageMapper);

    return {
      pages,
      cursor: isLastPage ? null : pages[pages.length - 1].id,
      is_last_page: isLastPage,
    };
  }

  private pageMapper(page: Page): PageDto {
    return {
      id: page['_id'],
      page_number: page.page_number,
      content: page.content,
      book_id: page.book.toString(),
    };
  }
}
