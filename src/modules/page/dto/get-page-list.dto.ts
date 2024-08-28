import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetPageListDto {
  @IsNotEmpty()
  @IsString()
  book_id: string;

  @IsOptional()
  @IsString()
  cursor?: string;
}
