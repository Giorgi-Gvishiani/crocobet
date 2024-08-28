// Nest
import { BadRequestException, Injectable } from '@nestjs/common';

// Model
import { Book } from '../../database/models/book.model';

// Repository
import { BookRepository } from '../../database/repositories/book.repository';

// Dto
import { BookDto } from './dto/book.dto';
import { BookListDto } from './dto/book-list.dto';

@Injectable()
export class BookService {
  private readonly pageLimit = 20;
  constructor(private readonly bookRepository: BookRepository) {}

  async create(payload: BookDto): Promise<void> {
    await this.bookRepository.create(payload);
  }

  async update(id: string, payload: BookDto): Promise<void> {
    const result = await this.bookRepository.update(id, payload);

    if (!result) throw new BadRequestException('Book does not exist!');
  }

  async delete(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }

  async findOne(id: string): Promise<BookDto> {
    const response = await this.bookRepository.findOne(id);

    if (!response) {
      throw new BadRequestException('Book not found!');
    }

    return this.bookMapper(response);
  }

  async getBookList(cursor: string): Promise<BookListDto> {
    let isLastPage = false;
    const response = await this.bookRepository.findMany(cursor, this.pageLimit);

    if (response.length <= this.pageLimit) {
      isLastPage = true;
    } else {
      response.pop();
    }

    const books = response.map(this.bookMapper);

    return {
      books,
      cursor: books[books.length - 1].id,
      is_last_page: isLastPage,
    };
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
