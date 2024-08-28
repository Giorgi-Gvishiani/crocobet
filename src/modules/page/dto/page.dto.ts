import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PageDto {
  id?: string;

  @IsNotEmpty()
  @IsString()
  book_id: string;

  @IsNotEmpty()
  @IsNumber()
  page_number: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
