// Mongo
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ type: String, required: true, length: 255, unique: true })
  access_token: string;

  @Prop({ type: String, required: true, length: 255, unique: true })
  refresh_token: string;

  @Prop({ type: Number, required: true })
  expire_at: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: mongoose.Schema.Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
