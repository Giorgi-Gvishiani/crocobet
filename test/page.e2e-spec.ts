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
import { PageModule } from '../src/modules/page/page.module';
import { AuthModule } from '../src/modules/auth/auth.module';

// Dto
import { SignInDto } from '../src/modules/auth/dto/sign-in.dto';
import { SignUpDto } from '../src/modules/auth/dto/sign-up.dto';
import { PageDto } from '../src/modules/page/dto/page.dto';
import { UpdatePageDto } from '../src/modules/page/dto/update-page.dto';
import { BookModule } from '../src/modules/book/book.module';

describe('PageController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const invalidPageId = '66cf1c595b1b118f35bd5ab6';

  const signUpDto: SignUpDto = {
    first_name: 'Page',
    last_name: 'Tester',
    email: 'page.user@gmail.com',
    password: 'password123',
  };

  const signInDto: SignInDto = {
    email: signUpDto.email,
    password: signUpDto.password,
  };

  const pageDto: PageDto = {
    page_number: 1,
    content: 'This is the first page.',
    book_id: '',
  };

  const updatePageDto: UpdatePageDto = {
    content: 'This is the first page.',
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
        PageModule,
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

    // Create a user and obtain an access token for authenticated requests
    await request(app.getHttpServer()).post('/auth/sign-up').send(signUpDto);
    const authResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInDto);

    accessToken = authResponse.body.access_token;

    const bookResponse = await request(app.getHttpServer())
      .post('/book')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'test',
        author: 'test',
        isbn: '9000000000005',
        publication_date: new Date(),
      });
    pageDto.book_id = bookResponse.body.id;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
    await app.close();
    await mongoose.connection.close();
  });

  describe('/page (POST)', () => {
    it('should create a new page', async () => {
      const response = await request(app.getHttpServer())
        .post('/page')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(pageDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.id).toBeDefined();
      pageDto.id = response.body.id; // Store created page ID for later use
    });

    it('should return 400 when page already exists', async () => {
      await request(app.getHttpServer())
        .post('/page')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(pageDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/page/:id (PUT)', () => {
    it('should update a page', async () => {
      return request(app.getHttpServer())
        .put(`/page/${pageDto.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePageDto)
        .expect(HttpStatus.OK);
    });

    it('should return 400 when the page does not exist', async () => {
      return request(app.getHttpServer())
        .put(`/page/${invalidPageId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePageDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/page/:id (GET)', () => {
    it('should retrieve a page by ID', async () => {
      return request(app.getHttpServer())
        .get(`/page/${pageDto.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(pageDto));
        });
    });

    it('should return 400 when the page does not exist', async () => {
      return request(app.getHttpServer())
        .get(`/page/${invalidPageId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/page/:id (DELETE)', () => {
    it('should delete a page', async () => {
      return request(app.getHttpServer())
        .delete(`/page/${pageDto.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });
  });
});
