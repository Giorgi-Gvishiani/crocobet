// Class validator
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Swagger
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ type: String, maxLength: 100, example: 'John' })
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ type: String, maxLength: 100, example: 'Snow' })
  last_name: string;

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
  @MaxLength(64)
  @ApiProperty({ type: String, maxLength: 64, example: 'superPassword1234' })
  password: string;
}
