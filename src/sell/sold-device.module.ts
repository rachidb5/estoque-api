import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoldDeviceController } from './presentation/sold-device.controller';
import { SoldDeviceService } from './application/sold-device.service';
import { SoldDeviceEntity } from './infrastructure/typeorm/sold-device.typeorm.entity';
import { SoldDeviceTypeOrmRepository } from './infrastructure/typeorm/sold-device.typeorm.repository';
import { SOLD_DEVICE_REPOSITORY } from './domain/repositories/sold-device.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([SoldDeviceEntity])],
  controllers: [SoldDeviceController],
  providers: [
    SoldDeviceService,
    {
      provide: SOLD_DEVICE_REPOSITORY,
      useClass: SoldDeviceTypeOrmRepository,
    },
  ],
  exports: [SoldDeviceService],
})
export class SoldDeviceModule {}
