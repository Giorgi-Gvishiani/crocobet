// Mongo
import { Model, Promise } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Model
import { User } from '../models/user.model';
import { Token } from '../models/token.model';

// Interface
import { ITokenRepository } from './interfaces/token-repository.interface';

// Dto
import { AuthTokensDto } from '../../modules/auth/dto/auth-tokens.dto';

export class TokenRepository implements ITokenRepository {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async create(tokens: AuthTokensDto, user: User): Promise<Token> {
    const token: Token = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expire_at: tokens.expire_at,
      user: user['_id'],
    };

    const newToken = new this.tokenModel(token);

    return await newToken.save();
  }

  async delete(id: string): Promise<void> {
    await this.tokenModel.findByIdAndDelete(id);
  }
}
