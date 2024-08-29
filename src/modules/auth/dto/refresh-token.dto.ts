// Class validator
import { IsNotEmpty, IsString } from 'class-validator';

// Swagger
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'JWT refresh token',
  })
  refresh_token: string;
}
