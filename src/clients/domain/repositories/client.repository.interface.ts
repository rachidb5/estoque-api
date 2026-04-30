import { Client } from '../entities/client';
import { PaginatedResult } from '../../../shared/types/pagination';

export const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';

export interface IClientRepository {
  findAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResult<Client>>;
  findById(id: number): Promise<Client | null>;
  findByCpf(cpf: string): Promise<Client | null>;
  create(data: Omit<Client, 'id'>): Promise<Client>;
  update(id: number, data: Partial<Client>): Promise<Client>;
  remove(id: number): Promise<void>;
}
