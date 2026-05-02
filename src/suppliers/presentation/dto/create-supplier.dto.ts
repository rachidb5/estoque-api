import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Tech Distribuidora LTDA' })
  @IsString()
  razao_social: string;

  @ApiProperty({ example: 'Tech Distribuidora', required: false })
  @IsOptional()
  @IsString()
  nome_fantasia?: string;

  @ApiProperty({ example: '12345678000195' })
  @IsString()
  @Length(14, 14)
  cnpj: string;

  @ApiProperty({ example: 'contato@techdistribuidora.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '11987654321' })
  @IsString()
  telefone: string;

  @ApiProperty({ example: 'Avenida Central, 1000', required: false })
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
}
