// Nest
import { Injectable } from '@nestjs/common';

// Mongo
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongoDbConfig implements MongooseOptionsFactory {
  private readonly config: MongooseModuleOptions;

  constructor() {
    this.config = {
      uri: process.env.DB_URI,
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER_NAME,
      pass: process.env.DB_USER_PASSWORD,
    };
  }
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    return this.config;
  }
}
