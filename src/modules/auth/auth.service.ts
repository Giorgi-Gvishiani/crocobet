// Nest
import { Injectable } from '@nestjs/common';

// Repository
import { UserRepository } from '../../database/repositories/user.repository';

// Dto
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(payload: SignUpDto): Promise<void> {
    await this.userRepository.create(payload);
  }
}
