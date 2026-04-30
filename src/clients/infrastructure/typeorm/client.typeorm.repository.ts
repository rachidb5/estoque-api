import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Client } from '../../domain/entities/client';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import {
  normalizePagination,
  PaginatedResult,
} from '../../../shared/types/pagination';
import { ClientEntity } from './client.typeorm.entity';

@Injectable()
export class ClientTypeOrmRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repo: Repository<ClientEntity>,
  ) {}

  async findAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResult<Client>> {
    const pagination = normalizePagination(page, limit);
    const query = this.repo.createQueryBuilder('client');

    if (search?.trim()) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('client.nome LIKE :search', { search: `%${search}%` })
            .orWhere('client.email LIKE :search', { search: `%${search}%` })
            .orWhere('client.telefone LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('client.cpf LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const [data, total] = await query
      .orderBy('client.id', 'DESC')
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

  async findById(id: number): Promise<Client | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    return this.repo.findOne({ where: { cpf } });
  }

  async create(data: Omit<Client, 'id'>): Promise<Client> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Client>): Promise<Client> {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } }) as Promise<Client>;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
