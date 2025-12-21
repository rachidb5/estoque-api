import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty({ example: 'iPhone 13' })
  modelo: string;

  @ApiProperty({ example: '123456789012345' })
  imei: string;
}
