import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ← ADICIONE ESTA LINHA
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // ← ADICIONE SE OUTROS MÓDULOS PRECISAREM DO UsersService
})
export class UsersModule {}
