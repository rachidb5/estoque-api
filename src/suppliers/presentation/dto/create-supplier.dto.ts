import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Tech Distribuidora LTDA' })
  razao_social: string;

  @ApiProperty({ example: 'Tech Distribuidora', required: false })
  nome_fantasia?: string;

  @ApiProperty({ example: '12345678000195' })
  cnpj: string;

  @ApiProperty({ example: 'contato@techdistribuidora.com' })
  email: string;

  @ApiProperty({ example: '11987654321' })
  telefone: string;

  @ApiProperty({ example: 'Avenida Central, 1000', required: false })
  endereco?: string;

  @ApiProperty({ example: 'Sao Paulo' })
  cidade: string;

  @ApiProperty({ example: 'SP' })
  estado: string;

  @ApiProperty({ example: '01234567' })
  cep: string;

  @ApiProperty({ example: '2026-04-30' })
  data_cadastro: string;
}
