// Nest
import { BadRequestException } from '@nestjs/common';

// Mongo
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Model
import { User } from '../models/user.model';

// Interface
import { IUserRepository } from './interfaces/user-repository.interface';

// Dto
import { SignUpDto } from '../../modules/auth/dto/sign-up.dto';

export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(payload: SignUpDto): Promise<void> {
    const email = payload.email;

    const user = await this.findOneByEmail(email);

    if (user) {
      throw new BadRequestException(
        `User with ${payload.email} already registered!`,
      );
    }

    const newUser: User = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      password: payload.password,
      email,
    };

    const record = new this.userModel(newUser);

    await record.save();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }
}
