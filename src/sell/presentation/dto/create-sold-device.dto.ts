import { ApiProperty } from '@nestjs/swagger';

export class CreateSoldDeviceDto {
  @ApiProperty({ example: '2025-11-10' })
  data: string;

  @ApiProperty({ example: 'iPhone 15 Pro Max' })
  aparelho: string;

  @ApiProperty({ example: 'Titânio Natural', required: false })
  cor?: string;

  @ApiProperty({ example: 'Novo', required: false })
  condicao?: string;

  @ApiProperty({ example: '355678901234567' })
  imei: string;

  @ApiProperty({ example: 'Apple Store', required: false })
  fornecedor?: string;

  @ApiProperty({ example: 8500.0 })
  valor_compra: number;

  @ApiProperty({ example: 'Carlos Silva' })
  comprador: string;

  @ApiProperty({ example: '+55 (11) 98765-4321', required: false })
  numero_telefone?: string;

  @ApiProperty({ example: true })
  aparelho_recebido: boolean;

  @ApiProperty({ example: 'Caixa original lacrada', required: false })
  observacao?: string;

  @ApiProperty({ example: 8500.0 })
  valor_recebido: number;

  @ApiProperty({ example: 8200.0 })
  preco_vista: number;

  @ApiProperty({ example: 8800.0 })
  preco_cartao: number;

  @ApiProperty({ example: 25.0 })
  valor_entrega: number;

  @ApiProperty({ example: 150.0 })
  valor_capa_pelicula: number;

  @ApiProperty({ example: 8375.0 })
  valor_total_venda: number;
}
