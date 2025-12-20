import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockModule } from './stock/stock.module';
import { Stock } from './stock/entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'estoque',
      entities: [Stock], // or [__dirname + '/**/*.entity{.ts,.js}']
      synchronize: true,
    }),
    StockModule,
  ],
})
export class AppModule {}
