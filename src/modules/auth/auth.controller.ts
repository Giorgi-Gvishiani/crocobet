// Nest
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

// Service
import { AuthService } from './auth.service';

// Dto
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() body: SignUpDto): Promise<void> {
    await this.authService.signUp(body);
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() body: SignInDto): Promise<any> {
    return this.authService.signIn(body);
  }
}
