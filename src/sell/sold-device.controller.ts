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
  UseGuards,
} from '@nestjs/common';
import { SoldDeviceService } from './sold-device.service';
import { SoldDevice } from './entities/sold-device.entity';
import { CreateSoldDeviceDto } from './dto/create-sold-device.dto';
import { UpdateSoldDeviceDto } from './dto/update-sold-device.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
  ): Promise<{
    data: SoldDevice[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.soldDeviceService.findAllPaginated(page, limit, search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SoldDevice> {
    return this.soldDeviceService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSoldDeviceDto: CreateSoldDeviceDto,
  ): Promise<SoldDevice> {
    return this.soldDeviceService.create(createSoldDeviceDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSoldDeviceDto: UpdateSoldDeviceDto,
  ): Promise<SoldDevice> {
    return this.soldDeviceService.update(id, updateSoldDeviceDto);
  }

  // Se quiser reativar delete depois
  // @UseGuards(AuthGuard('jwt'))
  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  //   return this.soldDeviceService.remove(id);
  // }
}
