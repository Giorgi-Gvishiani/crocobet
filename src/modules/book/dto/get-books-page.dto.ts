import { IsOptional } from 'class-validator';

export class GetBooksPageDto {
  @IsOptional()
  cursor: string;
}
