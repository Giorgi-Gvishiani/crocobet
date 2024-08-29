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
import { BookRedisService } from '../../cache/services/book-redis.service';

@Injectable()
export class BookService {
  private readonly pageLimit = 20;

  constructor(
    private readonly bookRedisService: BookRedisService,
    private readonly bookRepository: BookRepository,
  ) {}

  async create(payload: BookDto): Promise<BookDto> {
    const book = await this.bookRepository.create(payload);

    return this.bookMapper(book);
  }

  async update(id: string, payload: BookDto): Promise<void> {
    const result = await this.bookRepository.update(id, payload);

    if (!result) throw new BadRequestException('Book does not exist!');

    await this.bookRedisService.setBookDetail(id, result);
  }

  async delete(id: string): Promise<void> {
    await this.bookRepository.delete(id);

    await this.bookRedisService.deleteBookDetail(id);
  }

  async findOne(id: string): Promise<BookDto> {
    const cachedBook = await this.bookRedisService.getBookDetail(id);

    const response = await this.bookRepository.findOne(id);

    if (!response) {
      throw new BadRequestException('Book not found!');
    }

    await this.bookRedisService.setBookDetail(id, response);

    return this.bookMapper(cachedBook ?? response);
  }

  async getBookList(cursor: string): Promise<BookListDto> {
    // არ ვიცი რამდენად იყო საჭირო რომ List-ის წამოღების დროს გამეკეთებინა პაგინაცია. მე კი გავაკეთე ეგ და მაგ list-ის დაქეშვაც გავაკეთე
    const cachedBook = await this.bookRedisService.getBookList(cursor);

    let isLastPage = false;
    const response =
      cachedBook ??
      (await this.bookRepository.findMany(cursor, this.pageLimit));

    if (response.length <= this.pageLimit) {
      isLastPage = true;
    } else {
      response.pop();
    }

    await this.bookRedisService.setBookList(cursor, response);

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
