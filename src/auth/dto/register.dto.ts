// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('BR')
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}
