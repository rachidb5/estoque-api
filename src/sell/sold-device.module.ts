import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoldDeviceController } from './sold-device.controller';
import { SoldDeviceService } from './sold-device.service';
import { SoldDevice } from './entities/sold-device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SoldDevice])],
  controllers: [SoldDeviceController],
  providers: [SoldDeviceService],
  exports: [SoldDeviceService], // opcional (caso outro módulo use o service)
})
export class SoldDeviceModule {}
