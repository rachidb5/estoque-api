import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './application/supplier.service';
import { SUPPLIER_REPOSITORY } from './domain/repositories/supplier.repository.interface';
import { SupplierTypeOrmRepository } from './infrastructure/typeorm/supplier.typeorm.repository';
import { SupplierEntity } from './infrastructure/typeorm/supplier.typeorm.entity';
import { SupplierController } from './presentation/supplier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierEntity])],
  controllers: [SupplierController],
  providers: [
    SupplierService,
    {
      provide: SUPPLIER_REPOSITORY,
      useClass: SupplierTypeOrmRepository,
    },
  ],
  exports: [SupplierService],
})
export class SupplierModule {}
