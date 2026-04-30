import { SoldDevice } from '../entities/sold-device';
import {
  PaginatedResult,
  SoldDevicePaginationFilters,
} from '../../../shared/types/pagination';

export const SOLD_DEVICE_REPOSITORY = 'SOLD_DEVICE_REPOSITORY';

export interface ISoldDeviceRepository {
  findAllPaginated(
    page: number,
    limit: number,
    search?: string,
    filters?: SoldDevicePaginationFilters,
  ): Promise<PaginatedResult<SoldDevice>>;
  findById(id: number): Promise<SoldDevice | null>;
  create(data: Omit<SoldDevice, 'id'>): Promise<SoldDevice>;
  update(id: number, data: Partial<SoldDevice>): Promise<SoldDevice>;
  remove(id: number): Promise<void>;
}
