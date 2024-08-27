// Model
import { User } from '../../models/user.model';
import { Token } from '../../models/token.model';

// Dto
import { AuthTokensDto } from '../../../modules/auth/dto/auth-tokens.dto';

export interface ITokenRepository {
  create(tokens: AuthTokensDto, user: User): Promise<Token>;

  delete(id: string): Promise<void>;
}
