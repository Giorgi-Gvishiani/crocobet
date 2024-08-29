// Nest
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Jwt
import { JwtService } from '@nestjs/jwt';

// Model
import { Token } from '../../database/models/token.model';

// Repository
import { TokenRepository } from '../../database/repositories/token.repository';

// Dto
import { AuthTokensDto } from '../auth/dto/auth-tokens.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { DecodedAccessTokenDto } from './dto/decoded-access-token.dto';
import { ValidateRefreshTokenDto } from './dto/validate-refresh-token.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  private readonly accessTokenLifetime = '15m';
  private readonly refreshTokenLifetime = '7d';

  async generateAuthTokens(userId: string, email: string): Promise<Token> {
    const tokenDto: GenerateTokenDto = {
      sub: userId,
      username: email,
    };

    const accessToken = this.generateAccessToken(tokenDto);
    const refreshToken = this.generateRefreshToken(tokenDto);
    const refreshTokenExpireAt = +this.jwtService.decode(refreshToken).exp;

    const tokens: AuthTokensDto = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expire_at: refreshTokenExpireAt,
    };

    return await this.tokenRepository.create(tokens, userId);
  }

  async validateRefreshToken(payload: ValidateRefreshTokenDto): Promise<Token> {
    return await this.tokenRepository.validateRefreshToken(payload);
  }

  async deleteToken(id: string): Promise<void> {
    await this.tokenRepository.delete(id);
  }

  decodeAccessToken(accessToken: string): DecodedAccessTokenDto {
    const preparedAccessToken = accessToken.replace('Bearer ', '');

    const result = this.jwtService.decode(preparedAccessToken);

    if (!result) throw new UnauthorizedException('Invalid access token!');

    return result;
  }

  private generateAccessToken(payload: GenerateTokenDto) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: this.accessTokenLifetime,
      audience: `${Date.now()}`,
    });
  }

  private generateRefreshToken(payload: GenerateTokenDto) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: this.refreshTokenLifetime,
      audience: `${Date.now()}`,
    });
  }
}
