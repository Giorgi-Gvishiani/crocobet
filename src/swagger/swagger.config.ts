import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Crocobet App')
  .setVersion('1.0')
  .addTag('crocobet-app')
  .addBearerAuth()
  .build();
