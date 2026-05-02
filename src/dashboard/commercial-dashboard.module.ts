import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoldDeviceEntity } from '../sell/infrastructure/typeorm/sold-device.typeorm.entity';
import { StockEntity } from '../stock/infrastructure/typeorm/stock.typeorm.entity';
import { CommercialDashboardController } from './commercial-dashboard.controller';
import { CommercialDashboardService } from './commercial-dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([SoldDeviceEntity, StockEntity])],
  controllers: [CommercialDashboardController],
  providers: [CommercialDashboardService],
})
export class CommercialDashboardModule {}
