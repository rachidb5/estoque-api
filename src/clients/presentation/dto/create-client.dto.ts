import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Carlos Silva' })
  nome: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;

  @ApiProperty({ example: 'carlos.silva@email.com' })
  email: string;

  @ApiProperty({ example: '11987654321' })
  telefone: string;

  @ApiProperty({ example: 'Rua das Flores, 123', required: false })
  endereco?: string;

  @ApiProperty({ example: 'Sao Paulo' })
  cidade: string;

  @ApiProperty({ example: 'SP' })
  estado: string;

  @ApiProperty({ example: '01234567' })
  cep: string;

  @ApiProperty({ example: '2026-04-30' })
  data_cadastro: string;

  @ApiProperty({ example: 0, required: false })
  total_compras?: number;
}
