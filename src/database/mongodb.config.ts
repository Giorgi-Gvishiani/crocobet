// Config
import { ConfigModule } from '@nestjs/config';

// Mongo
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

ConfigModule.forRoot({
  envFilePath: ['.env'],
});

const config: MongooseModuleOptions = {
  uri: process.env.DB_URI,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER_NAME,
  pass: process.env.DB_USER_PASSWORD,
};

export class MongoDbConfig implements MongooseOptionsFactory {
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    return config;
  }
}
