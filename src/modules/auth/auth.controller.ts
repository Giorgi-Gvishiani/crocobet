// Nest
import {
  Body,
  Post,
  Request,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';

// Service
import { AuthService } from './auth.service';

// Dto
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: SignUpDto): Promise<void> {
    await this.authService.signUp(body);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: SignInDto): Promise<AuthTokensDto> {
    return this.authService.signIn(body);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Request() request,
    @Body() body: RefreshTokenDto,
  ): Promise<AuthTokensDto> {
    const accessToken = request.headers['authorization'].replace('Bearer ', '');

    return this.authService.refreshToken(accessToken, body.refresh_token);
  }
}
