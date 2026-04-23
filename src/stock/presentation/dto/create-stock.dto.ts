import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty({ example: 'iPhone 13' })
  modelo: string;

  @ApiProperty({ example: '123456789012345' })
  imei: string;

  @ApiProperty({ example: 'Apple Store', required: false })
  fornecedor?: string;

  @ApiProperty({ example: 'Preto', required: false })
  cor?: string;

  @ApiProperty({ example: 'Novo, caixa lacrada', required: false })
  observacao?: string;

  @ApiProperty({ example: 5000.0 })
  valor_unitario: number;
}
