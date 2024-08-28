import { IsOptional } from 'class-validator';

export class GetBookListDto {
  @IsOptional()
  cursor: string;
}
