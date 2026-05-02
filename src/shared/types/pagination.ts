export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StockPaginationFilters {
  observation?: 'with' | 'without';
  supplier?: string;
}

export interface SoldDevicePaginationFilters {
  status?: 'completed' | 'pending';
  condition?: string;
  seller?: string;
  startDate?: string;
  endDate?: string;
}

export function normalizePagination(page = 1, limit = 10) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}

export function normalizeSearch(search?: string) {
  const normalized = search?.trim().slice(0, 120);
  return normalized || undefined;
}
