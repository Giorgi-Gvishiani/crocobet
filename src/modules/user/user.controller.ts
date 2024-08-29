// Nest
import {
  Get,
  Request,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';

// Swagger
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Guard
import { JwtAuthGuard } from '../../guards/jwt.guard';

// Service
import { UserService } from './user.service';

// Dto
import { MeDto } from './dto/me.dto';

@ApiTags('User')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The page successfully returned.',
    example: {
      first_name: 'John',
      last_name: 'Snow',
      email: 'john.snow@westeros.com',
    },
  })
  async getMe(@Request() request): Promise<MeDto> {
    const userId = request['user'];

    return await this.userService.getMe(userId);
  }
}
