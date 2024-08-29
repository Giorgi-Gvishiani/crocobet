import { IsNotEmpty } from 'class-validator';

export class SearchBookDto {
  @IsNotEmpty()
  content: string;
}
