import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<{
    data: Stock[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.stockService.findAllPaginated(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Stock> {
    return this.stockService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStockDto: CreateStockDto): Promise<Stock> {
    return this.stockService.create(createStockDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<Stock> {
    return this.stockService.update(id, updateStockDto);
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  //   return this.stockService.remove(id);
  // }
}
