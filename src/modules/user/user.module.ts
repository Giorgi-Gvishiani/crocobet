// Nest
import { Module } from '@nestjs/common';

// Mongo
import { MongooseModule } from '@nestjs/mongoose';

// Model
import { User, UserSchema } from '../../database/models/user.model';

// Repository
import { UserRepository } from '../../database/repositories/user.repository';

// Controller
import { UserController } from './user.controller';

// Service
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
