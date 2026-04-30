import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './application/client.service';
import { CLIENT_REPOSITORY } from './domain/repositories/client.repository.interface';
import { ClientTypeOrmRepository } from './infrastructure/typeorm/client.typeorm.repository';
import { ClientEntity } from './infrastructure/typeorm/client.typeorm.entity';
import { ClientController } from './presentation/client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientController],
  providers: [
    ClientService,
    {
      provide: CLIENT_REPOSITORY,
      useClass: ClientTypeOrmRepository,
    },
  ],
  exports: [ClientService],
})
export class ClientModule {}
