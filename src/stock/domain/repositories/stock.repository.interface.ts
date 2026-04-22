import { Stock } from '../entities/stock';
import { PaginatedResult } from '../../../shared/types/pagination';

export const STOCK_REPOSITORY = 'STOCK_REPOSITORY';

export interface IStockRepository {
  findAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResult<Stock>>;
  findById(id: number): Promise<Stock | null>;
  create(data: Omit<Stock, 'id'>): Promise<Stock>;
  update(id: number, data: Partial<Stock>): Promise<Stock>;
}
