// Mongo
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PageDocument = HydratedDocument<Page>;

@Schema({ timestamps: true })
export class Page {
  @Prop({ type: Number, required: true })
  page_number: number;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Book',
    required: true,
  })
  book: Types.ObjectId;
}

export const PageSchema = SchemaFactory.createForClass(Page);
