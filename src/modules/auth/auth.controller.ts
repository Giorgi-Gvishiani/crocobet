// Nest
import {
  Body,
  Post,
  Request,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';

// Swagger
import {
  ApiTags,
  ApiHeader,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Service
import { AuthService } from './auth.service';

// Dto
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid DTO payload.' })
  @ApiBadRequestResponse({ description: 'The user already exist.' })
  async signUp(@Body() body: SignUpDto): Promise<void> {
    await this.authService.signUp(body);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Authorized successfully.',
    example: {
      access_token: 'JWT access token with 15 minutes of lifetime.',
      refresh_token: 'JWT refresh token with 7 days of lifetime.',
      expire_at: 'JWT refresh token expiration time in UTC timestamp.',
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async signIn(@Body() body: SignInDto): Promise<AuthTokensDto> {
    return this.authService.signIn(body);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'Authorization',
    description:
      'JWT access token which is related to refresh token (passed in request body).',
  })
  @ApiOkResponse({
    description: 'Authorized successfully.',
    example: {
      access_token: 'JWT access token with 15 minutes of lifetime.',
      refresh_token: 'JWT refresh token with 7 days of lifetime.',
      expire_at: 'JWT refresh token expiration time in UTC timestamp.',
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async refreshToken(
    @Request() request,
    @Body() body: RefreshTokenDto,
  ): Promise<AuthTokensDto> {
    const accessToken = request.headers['authorization'].replace('Bearer ', '');

    return this.authService.refreshToken(accessToken, body.refresh_token);
  }
}
