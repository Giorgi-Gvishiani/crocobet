// Test
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

// Mongo
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

// Config
import { ConfigModule } from '@nestjs/config';
import { RedisConfig } from '../src/cache/redis.config';
import { MongoDbConfig } from '../src/database/mongodb.config';

// Module
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '../src/modules/auth/auth.module';

// Dto
import { SignUpDto } from '../src/modules/auth/dto/sign-up.dto';
import { SignInDto } from '../src/modules/auth/dto/sign-in.dto';
import { AuthTokensDto } from '../src/modules/auth/dto/auth-tokens.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const signUpDto: SignUpDto = {
    first_name: 'Test',
    last_name: 'Testadze',
    email: 'test.user@gmail.com',
    password: 'password',
  };

  const signInDto: SignInDto = {
    email: signUpDto.email,
    password: signUpDto.password,
  };

  const notExistSignInDto: SignInDto = {
    email: 'no_exist.user@gmail.com',
    password: signUpDto.password,
  };

  const invalidSignInDto: SignInDto = {
    email: signUpDto.email,
    password: 'invalid_password',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
        }),
        MongooseModule.forRootAsync({
          imports: [],
          useClass: MongoDbConfig,
        }),
        CacheModule.registerAsync({
          imports: [],
          useClass: RedisConfig,
          isGlobal: true,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await mongoose.connect(process.env.DB_URI, {
      auth: {
        username: process.env.DB_USER_NAME,
        password: process.env.DB_USER_PASSWORD,
      },
    });
  });

  describe('/auth/sign-up (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(HttpStatus.CREATED);
    });

    it('should return 400 when email already exists', async () => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/sign-in (POST)', () => {
    it('should authenticate an existing user and return tokens', async () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInDto)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
          expect(res.body).toHaveProperty('expire_at');
        });
    });

    it('should return 401 when user not registered', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(notExistSignInDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(invalidSignInDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/auth/refresh-token (POST)', () => {
    it('should refresh the tokens', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInDto);

      const { access_token, refresh_token }: AuthTokensDto = loginResponse.body;

      return request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          refresh_token,
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
          expect(res.body).toHaveProperty('expire_at');
        });
    });

    it('should return 401 for invalid refresh token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInDto);

      const { access_token }: AuthTokensDto = loginResponse.body;

      return request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          refresh_token: 'invalid_refresh_token',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 for invalid access token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInDto);

      const { refresh_token }: AuthTokensDto = loginResponse.body;

      return request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer invalid_access_token`)
        .send({
          refresh_token,
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase({
        dbName: process.env.DB_NAME,
      });
    }

    await app.close();
    await mongoose.connection.close();
  });
});
