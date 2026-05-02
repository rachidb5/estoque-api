import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['vendedor', 'gestor', 'admin'])
  role?: 'vendedor' | 'gestor' | 'admin';
}
