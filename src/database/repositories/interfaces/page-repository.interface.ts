// Model
import { Page } from '../../models/page.model';

// Dto
import { PageDto } from '../../../modules/page/dto/page.dto';
import { UpdatePageDto } from '../../../modules/page/dto/update-page.dto';

export interface IPageRepository {
  create(payload: PageDto): Promise<Page>;

  update(id: string, payload: UpdatePageDto): Promise<Page | null>;

  delete(id: string): Promise<void>;

  findOne(id: string): Promise<Page>;

  findMany(bookId: string, cursor: string, limit: number): Promise<Array<Page>>;
}
