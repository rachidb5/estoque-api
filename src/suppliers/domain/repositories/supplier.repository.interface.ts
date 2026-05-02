import { PaginatedResult } from '../../../shared/types/pagination';
import { Supplier } from '../entities/supplier';

export const SUPPLIER_REPOSITORY = 'SUPPLIER_REPOSITORY';

export interface ISupplierRepository {
  findAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResult<Supplier>>;
  findById(id: number): Promise<Supplier | null>;
  findByCnpj(cnpj: string): Promise<Supplier | null>;
  create(data: Omit<Supplier, 'id'>): Promise<Supplier>;
  update(id: number, data: Partial<Supplier>): Promise<Supplier>;
  remove(id: number): Promise<void>;
}
