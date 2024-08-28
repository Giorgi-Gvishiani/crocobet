import { BookDto } from './book.dto';

export class BookListDto {
  books: Array<BookDto>;

  cursor: string;

  is_last_page: boolean;
}
