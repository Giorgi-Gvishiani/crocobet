// Nest
import { BadRequestException } from '@nestjs/common';

// Mongo
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Model
import { Book } from '../models/book.model';

// Interface
import { IBookRepository } from './interfaces/book-repository.interface';

// Dto
import { BookDto } from '../../modules/book/dto/book.dto';

export class BookRepository implements IBookRepository {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async create(payload: BookDto): Promise<void> {
    const isbn = payload.isbn;

    const book = await this.findOneByIsbn(isbn);

    if (book) {
      throw new BadRequestException('ISBN already registered!');
    }

    const newBook: Book = {
      title: payload.title,
      author: payload.author,
      isbn: payload.isbn,
      published_date: payload.publication_date,
    };

    const record = new this.bookModel(newBook);

    await record.save();
  }

  async update(id: string, payload: BookDto): Promise<Book | null> {
    const updatedBook: Book = {
      title: payload.title,
      author: payload.author,
      isbn: payload.isbn,
      published_date: payload.publication_date,
    };

    return await this.bookModel.findByIdAndUpdate(id, updatedBook);
  }

  async delete(id: string): Promise<void> {
    await this.bookModel.findByIdAndDelete(id);
  }

  async findOne(id: string): Promise<Book> {
    return await this.bookModel.findById(id).exec();
  }

  async findMany(cursor: string, limit: number): Promise<Array<Book>> {
    const query = {};

    if (cursor) query['_id'] = { $gt: new mongoose.Types.ObjectId(cursor) };

    return this.bookModel
      .find(query)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .exec();
  }

  private async findOneByIsbn(isbn: string): Promise<Book> {
    return await this.bookModel.findOne({ isbn }).exec();
  }
}
