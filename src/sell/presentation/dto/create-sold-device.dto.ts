import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSoldDeviceDto {
  @ApiProperty({ example: '2025-11-10' })
  @IsDateString()
  data: string;

  @ApiProperty({ example: 'iPhone 15 Pro Max' })
  @IsString()
  aparelho: string;

  @ApiProperty({ example: 'Titanio Natural', required: false })
  @IsOptional()
  @IsString()
  cor?: string;

  @ApiProperty({ example: 'Novo', required: false })
  @IsOptional()
  @IsString()
  condicao?: string;

  @ApiProperty({ example: '355678901234567' })
  @IsString()
  imei: string;

  @ApiProperty({ example: 'Apple Store', required: false })
  @IsOptional()
  @IsString()
  fornecedor?: string;

  @ApiProperty({ example: 8500.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor_compra: number;

  @ApiProperty({ example: 'Carlos Silva' })
  @IsString()
  comprador: string;

  @ApiProperty({ example: '+55 (11) 98765-4321', required: false })
  @IsOptional()
  @IsString()
  numero_telefone?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  aparelho_recebido: boolean;

  @ApiProperty({ example: 'Caixa original lacrada', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiProperty({ example: 8500.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor_recebido: number;

  @ApiProperty({ example: 8200.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco_vista: number;

  @ApiProperty({ example: 8800.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco_cartao: number;

  @ApiProperty({ example: 25.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor_entrega: number;

  @ApiProperty({ example: 150.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor_capa_pelicula: number;

  @ApiProperty({ example: 8375.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor_total_venda: number;

  @ApiProperty({ example: 'seller-joao', required: false })
  @IsOptional()
  @IsString()
  vendedor_id?: string;

  @ApiProperty({ example: 'Joao Silva', required: false })
  @IsOptional()
  @IsString()
  vendedor_nome?: string;

  @ApiProperty({ example: 'Loja fisica', required: false })
  @IsOptional()
  @IsString()
  canal_venda?: string;
}
