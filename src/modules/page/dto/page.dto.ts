// Class validator
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// Swagger
import { ApiProperty } from '@nestjs/swagger';

export class PageDto {
  id?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: '66cf1c595b1b118f35bd5ab7',
  })
  book_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 13,
  })
  page_number: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Avada kedavra',
  })
  content: string;
}
