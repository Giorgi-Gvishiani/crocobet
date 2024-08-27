// Model
import { User } from '../../models/user.model';

// Dto
import { SignUpDto } from '../../../modules/auth/dto/sign-up.dto';

export interface IUserRepository {
  create(payload: SignUpDto): Promise<void>;

  delete(id: string): Promise<void>;

  findOne(id: string): Promise<User>;

  findOneByEmail(email: string): Promise<User | null>;
}
