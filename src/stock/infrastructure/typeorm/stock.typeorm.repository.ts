import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { StockEntity } from './stock.typeorm.entity';
import { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { Stock } from '../../domain/entities/stock';
import { PaginatedResult } from '../../../shared/types/pagination';

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
  ): Promise<PaginatedResult<Stock>> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
          { imei: ILike(`%${search}%`) },
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
}
