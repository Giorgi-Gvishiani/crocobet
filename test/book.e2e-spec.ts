// Test
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

// Mongo
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

// Strategy
import { JwtStrategy } from '../src/strategies/jwt.strategy';

// Config
import { ConfigModule } from '@nestjs/config';
import { RedisConfig } from '../src/cache/redis.config';
import { MongoDbConfig } from '../src/database/mongodb.config';

// Module
import { CacheModule } from '@nestjs/cache-manager';
import { BookModule } from '../src/modules/book/book.module';

// Dto
import { BookDto } from '../src/modules/book/dto/book.dto';
import { AuthModule } from '../src/modules/auth/auth.module';
import { SignInDto } from '../src/modules/auth/dto/sign-in.dto';
import { SignUpDto } from '../src/modules/auth/dto/sign-up.dto';

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const invalidBookId = '66cf1c595b1b118f35bd5ab6';

  const signUpDto: SignUpDto = {
    first_name: 'Test',
    last_name: 'Testadze',
    email: 'book.user@gmail.com',
    password: 'password',
  };

  const signInDto: SignInDto = {
    email: signUpDto.email,
    password: signUpDto.password,
  };

  const bookDto: BookDto = {
    title: 'Harry Potter',
    author: 'J. K. Rowling',
    isbn: '9000000000002',
    publication_date: '2024-08-29T10:21:21.000Z' as unknown as Date,
  };

  beforeAll(async () => {
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
        BookModule,
      ],
      providers: [JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await mongoose.connect(process.env.DB_URI, {
      auth: {
        username: process.env.DB_USER_NAME,
        password: process.env.DB_USER_PASSWORD,
      },
    });

    await request(app.getHttpServer()).post('/auth/sign-up').send(signUpDto);

    const authResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInDto);

    accessToken = authResponse.body.access_token;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
    await app.close();
    await mongoose.connection.close();
  });

  describe('/book (POST)', () => {
    it('should create a new book', async () => {
      const response = await request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(bookDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.id).toBeDefined();
      bookDto.id = response.body.id; // Store created book ID for later use
    });

    it('should return 400 when ISBN already exists', async () => {
      await request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(bookDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/book/:id (PUT)', () => {
    it('should update a book', async () => {
      return request(app.getHttpServer())
        .put(`/book/${bookDto.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(bookDto)
        .expect(HttpStatus.OK);
    });

    it('should return 400 when the book does not exist', async () => {
      return request(app.getHttpServer())
        .put(`/book/${invalidBookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(bookDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/book/:id (GET)', () => {
    it('should retrieve a book by ID', async () => {
      return request(app.getHttpServer())
        .get(`/book/${bookDto.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(bookDto);
        });
    });

    it('should return 400 when the book does not exist', async () => {
      return request(app.getHttpServer())
        .get(`/book/${invalidBookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/book/search (GET)', () => {
    it('should search books by title', async () => {
      return request(app.getHttpServer())
        .get('/book/search')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ content: 'Harry' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual([bookDto]);
        });
    });

    it('should search books by author', async () => {
      return request(app.getHttpServer())
        .get('/book/search')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ content: 'Rowling' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual([bookDto]);
        });
    });
  });

  describe('/book/:id (DELETE)', () => {
    it('should delete a book', async () => {
      return request(app.getHttpServer())
        .delete(`/book/${bookDto.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });
  });
});
