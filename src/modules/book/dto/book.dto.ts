// Class validator
import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

// Swagger
import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  id?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Harry Potter',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'J. K. Rowling',
  })
  author: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{13}$/, { message: 'ISBN must be a string of 13 digits' })
  @ApiProperty({
    type: String,
    example: '9780733426094',
  })
  isbn: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    type: Date,
    example: '2024-09-01T00:00:00Z',
  })
  publication_date: Date;
}
