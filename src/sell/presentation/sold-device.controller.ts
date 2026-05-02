import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SoldDeviceService } from '../application/sold-device.service';
import { SoldDevice } from '../domain/entities/sold-device';
import { CreateSoldDeviceDto } from './dto/create-sold-device.dto';
import { UpdateSoldDeviceDto } from './dto/update-sold-device.dto';
import {
  PaginatedResult,
  SoldDevicePaginationFilters,
} from '../../shared/types/pagination';

@ApiTags('Sold Devices')
@Controller('sold-devices')
export class SoldDeviceController {
  constructor(private readonly soldDeviceService: SoldDeviceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: SoldDevicePaginationFilters['status'],
    @Query('condition') condition?: string,
    @Query('seller') seller?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<PaginatedResult<SoldDevice>> {
    return this.soldDeviceService.findAllPaginated(page, limit, search, {
      status,
      condition,
      seller,
      startDate,
      endDate,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SoldDevice> {
    return this.soldDeviceService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSoldDeviceDto): Promise<SoldDevice> {
    return this.soldDeviceService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSoldDeviceDto,
  ): Promise<SoldDevice> {
    return this.soldDeviceService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.soldDeviceService.remove(id);
  }
}
