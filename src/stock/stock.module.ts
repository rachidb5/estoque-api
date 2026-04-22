import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './presentation/stock.controller';
import { StockService } from './application/stock.service';
import { StockEntity } from './infrastructure/typeorm/stock.typeorm.entity';
import { StockTypeOrmRepository } from './infrastructure/typeorm/stock.typeorm.repository';
import { STOCK_REPOSITORY } from './domain/repositories/stock.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity])],
  controllers: [StockController],
  providers: [
    StockService,
    {
      provide: STOCK_REPOSITORY,
      useClass: StockTypeOrmRepository,
    },
  ],
})
export class StockModule {}
