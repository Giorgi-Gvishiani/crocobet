// Mongo
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (isbn: string) => /^\d{13}$/.test(isbn),
      message: 'ISBN must be a string of 13 digits',
    },
  })
  isbn: string;

  @Prop({ type: Date, required: true })
  published_date: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
