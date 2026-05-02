import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Carlos Silva' })
  @IsString()
  nome: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @Length(11, 11)
  cpf: string;

  @ApiProperty({ example: 'carlos.silva@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '11987654321' })
  @IsString()
  telefone: string;

  @ApiProperty({ example: 'Rua das Flores, 123', required: false })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiProperty({ example: 'Sao Paulo' })
  @IsString()
  cidade: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ example: '01234567' })
  @IsString()
  @Length(8, 8)
  cep: string;

  @ApiProperty({ example: '2026-04-30' })
  @IsDateString()
  data_cadastro: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  total_compras?: number;
}
