import { BookDto } from './book.dto';

export class BooksPageDto {
  books: Array<BookDto>;

  cursor: string;

  is_last_page: boolean;
}
