import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { SoldDeviceEntity } from './sold-device.typeorm.entity';
import { ISoldDeviceRepository } from '../../domain/repositories/sold-device.repository.interface';
import { SoldDevice } from '../../domain/entities/sold-device';
import {
  normalizePagination,
  PaginatedResult,
  SoldDevicePaginationFilters,
} from '../../../shared/types/pagination';

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
    filters?: SoldDevicePaginationFilters,
  ): Promise<PaginatedResult<SoldDevice>> {
    const pagination = normalizePagination(page, limit);
    const query = this.repo.createQueryBuilder('sale');

    if (search?.trim()) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('sale.imei LIKE :search', { search: `%${search}%` })
            .orWhere('sale.aparelho LIKE :search', { search: `%${search}%` })
            .orWhere('sale.comprador LIKE :search', { search: `%${search}%` })
            .orWhere('sale.cor LIKE :search', { search: `%${search}%` })
            .orWhere('sale.observacao LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    if (filters?.status === 'completed') {
      query.andWhere('sale.aparelho_recebido = :received', {
        received: true,
      });
    }

    if (filters?.status === 'pending') {
      query.andWhere('sale.aparelho_recebido = :received', {
        received: false,
      });
    }

    if (filters?.condition?.trim()) {
      query.andWhere('sale.condicao = :condition', {
        condition: filters.condition,
      });
    }

    if (filters?.seller?.trim()) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('sale.vendedor_id = :seller', {
            seller: filters.seller,
          }).orWhere('sale.vendedor_nome = :seller', {
            seller: filters.seller,
          });
        }),
      );
    }

    if (filters?.startDate) {
      query.andWhere('sale.data >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('sale.data <= :endDate', {
        endDate: filters.endDate,
      });
    }

    const [data, total] = await query
      .orderBy('sale.id', 'DESC')
      .skip(pagination.skip)
      .take(pagination.limit)
      .getManyAndCount();

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
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

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
