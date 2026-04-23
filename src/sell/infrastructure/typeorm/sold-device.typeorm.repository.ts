import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { SoldDeviceEntity } from './sold-device.typeorm.entity';
import { ISoldDeviceRepository } from '../../domain/repositories/sold-device.repository.interface';
import { SoldDevice } from '../../domain/entities/sold-device';
import { PaginatedResult } from '../../../shared/types/pagination';

@Injectable()
export class SoldDeviceTypeOrmRepository implements ISoldDeviceRepository {
  constructor(
    @InjectRepository(SoldDeviceEntity)
    private readonly repo: Repository<SoldDeviceEntity>,
  ) {}

  async findAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResult<SoldDevice>> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
          { imei: ILike(`%${search}%`) },
          { aparelho: ILike(`%${search}%`) },
          { comprador: ILike(`%${search}%`) },
          { cor: ILike(`%${search}%`) },
          { observacao: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await Promise.all([
      this.repo.find({ where, skip, take: limit, order: { id: 'DESC' } }),
      this.repo.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number): Promise<SoldDevice | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Omit<SoldDevice, 'id'>): Promise<SoldDevice> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<SoldDevice>): Promise<SoldDevice> {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } }) as Promise<SoldDevice>;
  }
}
