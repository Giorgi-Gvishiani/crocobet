// Nest
import { BadRequestException } from '@nestjs/common';

// Mongo
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Model
import { Page } from '../models/page.model';

// Interface
import { IPageRepository } from './interfaces/page-repository.interface';

// Dto
import { PageDto } from '../../modules/page/dto/page.dto';
import { UpdatePageDto } from '../../modules/page/dto/update-page.dto';

export class PageRepository implements IPageRepository {
  constructor(@InjectModel(Page.name) private pageModel: Model<Page>) {}

  async create(payload: PageDto): Promise<Page> {
    const { book_id, page_number, content } = payload;
    const page = await this.findOneByBookAndPageNumber(book_id, page_number);

    if (page) {
      throw new BadRequestException('Page already exists');
    }

    const newBook: Page = {
      page_number,
      content,
      book: new Types.ObjectId(book_id),
    };

    const record = new this.pageModel(newBook);

    return await record.save();
  }

  async update(id: string, payload: UpdatePageDto): Promise<Page | null> {
    return await this.pageModel.findByIdAndUpdate(id, {
      content: payload.content,
    });
  }

  async delete(id: string): Promise<void> {
    await this.pageModel.findByIdAndDelete(id);
  }

  async findOne(id: string): Promise<Page> {
    return await this.pageModel.findById(id).exec();
  }

  async findMany(
    bookId: string,
    cursor: string,
    limit: number,
  ): Promise<Array<Page>> {
    const query = {
      book: { $eq: new Types.ObjectId(bookId) },
    };

    if (cursor) query['_id'] = { $gt: new Types.ObjectId(cursor) };

    return this.pageModel
      .find(query)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .exec();
  }

  private async findOneByBookAndPageNumber(
    bookId: string,
    pageNumber: number,
  ): Promise<Page> {
    return await this.pageModel
      .findOne({ book: bookId, page_number: pageNumber })
      .exec();
  }
}
