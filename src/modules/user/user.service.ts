// Nest
import { Injectable } from '@nestjs/common';

// Repository
import { UserRepository } from '../../database/repositories/user.repository';
import { MeDto } from './dto/me.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getMe(id: string): Promise<MeDto> {
    const user = await this.userRepository.findOne(id);

    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }
}
