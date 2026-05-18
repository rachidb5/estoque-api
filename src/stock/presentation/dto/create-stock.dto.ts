import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateStockDto {
  @ApiProperty({ example: 'iPhone 13' })
  @IsString()
  modelo: string;

  @ApiProperty({ example: '123456789012345' })
  @IsString()
  imei: string;

  @ApiProperty({ example: 'Apple Store', required: false })
  @IsOptional()
  @IsString()
  fornecedor?: string;

  @ApiProperty({ example: 'Preto', required: false })
  @IsOptional()
  @IsString()
  cor?: string;

  @ApiProperty({ example: 'Novo, caixa lacrada', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    required: false,
  })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiProperty({ example: 5000.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor_unitario: number;
}
