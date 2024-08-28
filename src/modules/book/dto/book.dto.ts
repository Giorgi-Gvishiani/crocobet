import { IsDate, IsNotEmpty, IsString, Matches } from 'class-validator';

export class BookDto {
  id?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{13}$/, { message: 'ISBN must be a string of 13 digits' })
  isbn: string;

  @IsNotEmpty()
  @IsDate()
  publication_date: Date;
}
