// Nest
import { Injectable } from '@nestjs/common';

// Jwt
import { JwtService } from '@nestjs/jwt';

// Model
import { User } from '../../database/models/user.model';

// Repository
import { UserRepository } from '../../database/repositories/user.repository';
import { TokenRepository } from '../../database/repositories/token.repository';

// Dto
import { AuthTokensDto } from '../auth/dto/auth-tokens.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  private readonly accessTokenLifetime = '15m';
  private readonly refreshTokenLifetime = '7d';

  async generateAuthTokens(user: User): Promise<AuthTokensDto> {
    const userId = user['_id'];

    const tokenDto: GenerateTokenDto = {
      sub: userId,
      username: user.email,
    };

    const accessToken = this.generateAccessToken(tokenDto);
    const refreshToken = this.generateRefreshToken(tokenDto);
    const refreshTokenExpireAt = +this.jwtService.decode(refreshToken).exp;

    const tokens: AuthTokensDto = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expire_at: refreshTokenExpireAt,
    };

    const newToken = await this.tokenRepository.create(tokens, user);
    await this.userRepository.addAuthToken(userId, newToken['_id']);

    return tokens;
  }

  private generateAccessToken(payload: GenerateTokenDto) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: this.accessTokenLifetime,
    });
  }

  private generateRefreshToken(payload: GenerateTokenDto) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: this.refreshTokenLifetime,
    });
  }
}
