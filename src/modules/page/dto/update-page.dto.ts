import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePageDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
