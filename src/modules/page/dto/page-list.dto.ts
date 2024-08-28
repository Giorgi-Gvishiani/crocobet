import { PageDto } from './page.dto';

export class PageListDto {
  pages: Array<PageDto>;

  cursor?: string;

  is_last_page: boolean;
}
