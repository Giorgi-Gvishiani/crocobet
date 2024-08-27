// Mongo
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, length: 100 })
  first_name: string;

  @Prop({ type: String, required: true, length: 100 })
  last_name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, length: 64 })
  password: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Token',
  })
  tokens: Array<mongoose.Schema.Types.ObjectId>;
}

export const UserSchema = SchemaFactory.createForClass(User);
