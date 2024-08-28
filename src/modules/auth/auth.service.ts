// Nest
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

// Repository
import { UserRepository } from '../../database/repositories/user.repository';

// Service
import { TokenService } from '../token/token.service';

// Dto
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';

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
    const userId = user['_id'];

    if (!user) {
      throw new UnauthorizedException('email or password is invalid!');
    }

    const token = await this.tokenService.generateAuthTokens(
      userId,
      user.email,
    );

    await this.userRepository.addAuthToken(userId, token['_id']);

    return {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expire_at: token.expire_at,
    };
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthTokensDto> {
    const decodedAccessToken = this.tokenService.decodeAccessToken(accessToken);
    const userId = decodedAccessToken.sub;
    const email = decodedAccessToken.username;

    const token = await this.tokenService.validateRefreshToken({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: userId,
    });

    if (!token) {
      throw new UnauthorizedException('Invalid access or refresh token!');
    }

    const tokenId = token['_id'];

    await this.tokenService.deleteToken(tokenId);
    await this.userRepository.removeAuthToken(userId, tokenId);

    // Token expire at saved in seconds timestamp, so we need to convert Date.now() milliseconds to seconds
    const dateNowInSeconds = Math.floor(Date.now() / 1000);

    if (+token.expire_at < dateNowInSeconds) {
      throw new BadRequestException('Refresh token expired!');
    }

    const newToken = await this.tokenService.generateAuthTokens(userId, email);

    await this.userRepository.addAuthToken(userId, newToken['_id']);

    return {
      access_token: newToken.access_token,
      refresh_token: newToken.refresh_token,
      expire_at: newToken.expire_at,
    };
  }
}
