// Nest
import { Module } from '@nestjs/common';

// Mongo
import { MongooseModule } from '@nestjs/mongoose';

// Controller
import { AuthController } from './auth.controller';

// Model
import { User, UserSchema } from '../../database/models/user.model';

// Repository
import { UserRepository } from '../../database/repositories/user.repository';

// Service
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
