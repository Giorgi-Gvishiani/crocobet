// Class validator
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Swagger
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Should be valid email',
    example: 'john.snow@westeros.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'superPassword1234',
  })
  password: string;
}
