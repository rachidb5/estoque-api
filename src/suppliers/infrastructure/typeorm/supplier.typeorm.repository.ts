import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  PaginatedResult,
  normalizePagination,
  normalizeSearch,
} from '../../../shared/types/pagination';
import { Supplier } from '../../domain/entities/supplier';
import { ISupplierRepository } from '../../domain/repositories/supplier.repository.interface';
import { SupplierEntity } from './supplier.typeorm.entity';

@Injectable()
export class SupplierTypeOrmRepository implements ISupplierRepository {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly repo: Repository<SupplierEntity>,
  ) {}

  async findAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResult<Supplier>> {
    const pagination = normalizePagination(page, limit);
    const safeSearch = normalizeSearch(search);
    const query = this.repo.createQueryBuilder('supplier');

    if (safeSearch) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('supplier.razao_social LIKE :search', {
            search: `%${safeSearch}%`,
          })
            .orWhere('supplier.nome_fantasia LIKE :search', {
              search: `%${safeSearch}%`,
            })
            .orWhere('supplier.email LIKE :search', {
              search: `%${safeSearch}%`,
            })
            .orWhere('supplier.telefone LIKE :search', {
              search: `%${safeSearch}%`,
            })
            .orWhere('supplier.cnpj LIKE :search', {
              search: `%${safeSearch}%`,
            });
        }),
      );
    }

    const [data, total] = await query
      .orderBy('supplier.id', 'DESC')
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

  async findById(id: number): Promise<Supplier | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByCnpj(cnpj: string): Promise<Supplier | null> {
    return this.repo.findOne({ where: { cnpj } });
  }

  async create(data: Omit<Supplier, 'id'>): Promise<Supplier> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Supplier>): Promise<Supplier> {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } }) as Promise<Supplier>;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
