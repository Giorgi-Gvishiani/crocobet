import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
