// Mongo
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Model
import { Token } from '../models/token.model';

// Interface
import { ITokenRepository } from './interfaces/token-repository.interface';

// Dto
import { AuthTokensDto } from '../../modules/auth/dto/auth-tokens.dto';
import { ValidateRefreshTokenDto } from '../../modules/token/dto/validate-refresh-token.dto';

export class TokenRepository implements ITokenRepository {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async create(tokens: AuthTokensDto, userId: string): Promise<Token> {
    const token: Token = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expire_at: tokens.expire_at,
      user: userId as any,
    };

    const newToken = new this.tokenModel(token);

    return await newToken.save();
  }

  async validateRefreshToken(
    payload: ValidateRefreshTokenDto,
  ): Promise<Token | null> {
    const { user_id, refresh_token, access_token } = payload;

    return await this.tokenModel
      .findOne({ access_token, refresh_token, user: user_id })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.tokenModel.findByIdAndDelete(id);
  }
}
