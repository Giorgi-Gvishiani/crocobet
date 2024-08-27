// Model
import { Token } from '../../models/token.model';

// Dto
import { AuthTokensDto } from '../../../modules/auth/dto/auth-tokens.dto';
import { ValidateRefreshTokenDto } from '../../../modules/token/dto/validate-refresh-token.dto';

export interface ITokenRepository {
  create(tokens: AuthTokensDto, userId: string): Promise<Token>;

  validateRefreshToken(payload: ValidateRefreshTokenDto): Promise<Token>;

  delete(id: string): Promise<void>;
}
