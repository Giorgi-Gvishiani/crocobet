// Nest
import { Module } from '@nestjs/common';

// Mongo
import { MongooseModule } from '@nestjs/mongoose';

// Controller
import { AuthController } from './auth.controller';

// Model
import { User, UserSchema } from '../../database/models/user.model';
import { Token, TokenSchema } from '../../database/models/token.model';

// Repository
import { UserRepository } from '../../database/repositories/user.repository';
import { TokenRepository } from '../../database/repositories/token.repository';

// Service
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    TokenService,
    UserRepository,
    TokenRepository,
  ],
})
export class AuthModule {}
