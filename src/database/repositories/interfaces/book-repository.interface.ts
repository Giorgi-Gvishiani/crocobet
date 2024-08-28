// Model
import { Book } from '../../models/book.model';

// Dto
import { BookDto } from '../../../modules/book/dto/book.dto';

export interface IBookRepository {
  create(payload: BookDto): Promise<void>;

  update(id: string, payload: BookDto): Promise<Book | null>;

  delete(id: string): Promise<void>;

  findOne(id: string): Promise<Book>;

  findMany(cursor: string, limit: number): Promise<Array<Book>>;

  addPage(bookId: string, pageId: string): Promise<Book>;

  removePage(bookId: string, pageId: string): Promise<Book>;
}
