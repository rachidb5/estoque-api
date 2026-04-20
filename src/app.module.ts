import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { StockModule } from './stock/stock.module';
import { Stock } from './stock/entities/stock.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { SoldDevice } from './sell/entities/sold-device.entity';
import { AuthModule } from './auth/auth.module';
import { SoldDeviceModule } from './sell/sold-device.module';

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
        entities: [Stock, User, SoldDevice],
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
    AuthModule,
  ],
})
export class AppModule {}
