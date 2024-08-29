import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Harry potter is dead! Haaahahahaha.',
  })
  content: string;
}
