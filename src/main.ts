// Nest
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// Swagger
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger/swagger.config';

// Module
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(3000);
}
bootstrap();
