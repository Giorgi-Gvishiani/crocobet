// Model
import { User } from '../../models/user.model';

// Dto
import { SignUpDto } from '../../../modules/auth/dto/sign-up.dto';
import { SignInDto } from '../../../modules/auth/dto/sign-in.dto';

export interface IUserRepository {
  create(payload: SignUpDto): Promise<void>;

  delete(id: string): Promise<void>;

  findOne(id: string): Promise<User>;

  findOneByEmail(email: string): Promise<User | null>;

  validateUser(payload: SignInDto): Promise<User | null>;

  addAuthToken(userId: string, tokenId: string): Promise<void>;

  removeAuthToken(userId: string, tokenId: string): Promise<void>;
}
