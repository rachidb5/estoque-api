import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { StockEntity } from './stock.typeorm.entity';
import { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { Stock } from '../../domain/entities/stock';
import {
  normalizePagination,
  normalizeSearch,
  PaginatedResult,
  StockPaginationFilters,
} from '../../../shared/types/pagination';

@Injectable()
export class StockTypeOrmRepository implements IStockRepository {
  constructor(
    @InjectRepository(StockEntity)
    private readonly repo: Repository<StockEntity>,
  ) {}

  async findAllPaginated(
    page: number,
    limit: number,
    search?: string,
    filters?: StockPaginationFilters,
  ): Promise<PaginatedResult<Stock>> {
    const pagination = normalizePagination(page, limit);
    const safeSearch = normalizeSearch(search);
    const query = this.repo.createQueryBuilder('stock');

    if (safeSearch) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('stock.imei LIKE :search', { search: `%${safeSearch}%` })
            .orWhere('stock.modelo LIKE :search', {
              search: `%${safeSearch}%`,
            })
            .orWhere('stock.fornecedor LIKE :search', {
              search: `%${safeSearch}%`,
            })
            .orWhere('stock.cor LIKE :search', { search: `%${safeSearch}%` })
            .orWhere('stock.observacao LIKE :search', {
              search: `%${safeSearch}%`,
            });
        }),
      );
    }

    if (filters?.supplier?.trim()) {
      query.andWhere('stock.fornecedor = :supplier', {
        supplier: filters.supplier,
      });
    }

    if (filters?.observation === 'with') {
      query.andWhere(
        'stock.observacao IS NOT NULL AND stock.observacao != :empty',
        { empty: '' },
      );
    }

    if (filters?.observation === 'without') {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('stock.observacao IS NULL').orWhere(
            'stock.observacao = :empty',
            { empty: '' },
          );
        }),
      );
    }

    const [data, total] = await query
      .orderBy('stock.id', 'DESC')
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

  async findById(id: number): Promise<Stock | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Omit<Stock, 'id'>): Promise<Stock> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Stock>): Promise<Stock> {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } }) as Promise<Stock>;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
