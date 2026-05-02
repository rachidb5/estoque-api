import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoldDeviceEntity } from '../sell/infrastructure/typeorm/sold-device.typeorm.entity';
import { StockEntity } from '../stock/infrastructure/typeorm/stock.typeorm.entity';

export interface CommercialDashboardResponse {
  sales: SoldDeviceEntity[];
  stockSummary: {
    total: number;
    totalValue: number;
  };
}

@Injectable()
export class CommercialDashboardService {
  constructor(
    @InjectRepository(SoldDeviceEntity)
    private readonly soldDeviceRepository: Repository<SoldDeviceEntity>,
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
  ) {}

  async getCommercialDashboard(): Promise<CommercialDashboardResponse> {
    const [sales, stockRaw] = await Promise.all([
      this.soldDeviceRepository.find({
        order: {
          data: 'DESC',
          id: 'DESC',
        },
      }),
      this.stockRepository
        .createQueryBuilder('stock')
        .select('COUNT(stock.id)', 'total')
        .addSelect('COALESCE(SUM(stock.valor_unitario), 0)', 'totalValue')
        .getRawOne<{ total: string; totalValue: string }>(),
    ]);

    return {
      sales,
      stockSummary: {
        total: Number(stockRaw?.total ?? 0),
        totalValue: Number(stockRaw?.totalValue ?? 0),
      },
    };
  }
}
