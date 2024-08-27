// Nest
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Repository
import { UserRepository } from '../../database/repositories/user.repository';

// Dto
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';

// Service
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async signUp(payload: SignUpDto): Promise<void> {
    await this.userRepository.create(payload);
  }

  async signIn(payload: SignInDto): Promise<AuthTokensDto> {
    const user = await this.userRepository.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException('email or password is invalid!');
    }

    return await this.tokenService.generateAuthTokens(user);
  }
}
