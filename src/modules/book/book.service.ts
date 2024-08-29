// Nest
import { BadRequestException, Injectable } from '@nestjs/common';

// Model
import { Book } from '../../database/models/book.model';

// Repository
import { BookRepository } from '../../database/repositories/book.repository';

// Dto
import { BookDto } from './dto/book.dto';
import { BookListDto } from './dto/book-list.dto';

// Service
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class BookService {
  private readonly pageLimit = 20;

  constructor(
    private cacheService: CacheService,
    private readonly bookRepository: BookRepository,
  ) {}

  async create(payload: BookDto): Promise<void> {
    await this.bookRepository.create(payload);
  }

  async update(id: string, payload: BookDto): Promise<void> {
    const cacheKey = `books:detail:${id}`;

    const result = await this.bookRepository.update(id, payload);
    await this.cacheService.set(cacheKey, result);

    if (!result) throw new BadRequestException('Book does not exist!');
  }

  async delete(id: string): Promise<void> {
    const cacheKey = `books:detail:${id}`;

    await this.bookRepository.delete(id);

    await this.cacheService.del(cacheKey);
  }

  async findOne(id: string): Promise<BookDto> {
    const cacheKey = `books:detail:${id}`;

    const cachedBook = await this.cacheService.get<Book>(cacheKey);

    const response = await this.bookRepository.findOne(id);

    if (!response) {
      throw new BadRequestException('Book not found!');
    }

    await this.cacheService.set(cacheKey, response);

    return this.bookMapper(cachedBook ?? response);
  }

  async getBookList(cursor: string): Promise<BookListDto> {
    // არ ვიცი რამდენად იყო საჭირო რომ List-ის წამოღების დროს გამეკეთებინა პაგინაცია. მე კი გავაკეთე ეგ და მაგ list-ის დაქეშვაც გავაკეთე

    const cacheKey = `books:list:${cursor}`;
    const cachedBook = await this.cacheService.get<Array<Book>>(cacheKey);

    let isLastPage = false;
    const response =
      cachedBook ??
      (await this.bookRepository.findMany(cursor, this.pageLimit));

    if (response.length <= this.pageLimit) {
      isLastPage = true;
    } else {
      response.pop();
    }

    await this.cacheService.set(cacheKey, response);

    const books = response.map(this.bookMapper);

    return {
      books,
      cursor: books[books.length - 1].id,
      is_last_page: isLastPage,
    };
  }

  async searchBook(content: string): Promise<Array<BookDto>> {
    const books = await this.bookRepository.search(content);

    return books.map(this.bookMapper);
  }

  private bookMapper(book: Book): BookDto {
    return {
      id: book['_id'],
      title: book.title,
      author: book.author,
      publication_date: book.published_date,
      isbn: book.isbn,
    };
  }
}
