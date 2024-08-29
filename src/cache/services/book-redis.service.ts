// Service
import { CacheService } from '../cache.service';

// Model
import { Book } from '../../database/models/book.model';

export class BookRedisService extends CacheService {
  private readonly bookDetailKey = `books:detail`;
  private readonly bookListKey = `books:list`;

  async setBookDetail(id: string, book: Book) {
    const key = `${this.bookDetailKey}:${id}`;
    await this.set(key, book);
  }

  async getBookDetail(id: string): Promise<Book> {
    const key = `${this.bookDetailKey}:${id}`;
    return await this.get<Book>(key);
  }

  async deleteBookDetail(id: string) {
    const key = `${this.bookDetailKey}:${id}`;
    await this.del(key);
  }

  async setBookList(id: string, books: Array<Book>) {
    const key = `${this.bookListKey}:${id}`;
    await this.set(key, books);
  }

  async getBookList(id: string): Promise<Array<Book>> {
    const key = `${this.bookListKey}:${id}`;
    return await this.get<Array<Book>>(key);
  }

  async deleteBookList(id: string) {
    const key = `${this.bookListKey}:${id}`;
    await this.del(key);
  }
}
