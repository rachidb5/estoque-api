import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { ISoldDeviceRepository } from '../domain/repositories/sold-device.repository.interface';
import { SOLD_DEVICE_REPOSITORY } from '../domain/repositories/sold-device.repository.interface';
import { SoldDevice } from '../domain/entities/sold-device';
import { CreateSoldDeviceDto } from '../presentation/dto/create-sold-device.dto';
import { UpdateSoldDeviceDto } from '../presentation/dto/update-sold-device.dto';
import { PaginatedResult } from '../../shared/types/pagination';

@Injectable()
export class SoldDeviceService {
  constructor(
    @Inject(SOLD_DEVICE_REPOSITORY)
    private readonly soldDeviceRepository: ISoldDeviceRepository,
  ) {}

  async findAllPaginated(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<PaginatedResult<SoldDevice>> {
    return this.soldDeviceRepository.findAllPaginated(page, limit, search);
  }

  async findOne(id: number): Promise<SoldDevice> {
    const soldDevice = await this.soldDeviceRepository.findById(id);
    if (!soldDevice) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }
    return soldDevice;
  }

  async create(dto: CreateSoldDeviceDto): Promise<SoldDevice> {
    try {
      return await this.soldDeviceRepository.create(dto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if ((error as any).code === '23505') {
          throw new BadRequestException('Já existe um registro com esse IMEI');
        }
        if ((error as any).code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('Já existe um registro duplicado');
        }
        throw new BadRequestException('Erro ao salvar no banco de dados');
      }
      throw new InternalServerErrorException('Erro interno ao criar a venda');
    }
  }

  async update(id: number, dto: UpdateSoldDeviceDto): Promise<SoldDevice> {
    await this.findOne(id);
    try {
      return await this.soldDeviceRepository.update(id, dto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Erro ao atualizar no banco de dados');
      }
      throw new InternalServerErrorException(
        'Erro interno ao atualizar a venda',
      );
    }
  }
}
