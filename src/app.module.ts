import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { StockModule } from './stock/stock.module';
import { StockEntity } from './stock/infrastructure/typeorm/stock.typeorm.entity';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/infrastructure/typeorm/user.typeorm.entity';
import { SoldDeviceEntity } from './sell/infrastructure/typeorm/sold-device.typeorm.entity';
import { AuthModule } from './auth/auth.module';
import { SoldDeviceModule } from './sell/sold-device.module';
import { ClientModule } from './clients/client.module';
import { ClientEntity } from './clients/infrastructure/typeorm/client.typeorm.entity';
import { SupplierModule } from './suppliers/supplier.module';
import { SupplierEntity } from './suppliers/infrastructure/typeorm/supplier.typeorm.entity';
import { CommercialDashboardModule } from './dashboard/commercial-dashboard.module';

@Module({
  imports: [
    // 🔹 ENV GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 🔹 TYPEORM VIA process.env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [
          StockEntity,
          UserEntity,
          SoldDeviceEntity,
          ClientEntity,
          SupplierEntity,
        ],
        synchronize: true, // 🔴 OBRIGATÓRIO
        dropSchema: false, // 🔴 GARANTA
        migrationsRun: false, // 🔴 GARANTA
        retryAttempts: 30,
        retryDelay: 2000,
      }),
    }),

    StockModule,
    UsersModule,
    SoldDeviceModule,
    ClientModule,
    SupplierModule,
    CommercialDashboardModule,
    AuthModule,
  ],
})
export class AppModule {}
