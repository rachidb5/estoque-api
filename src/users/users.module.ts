import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './presentation/users.controller';
import { UsersService } from './application/users.service';
import { UserEntity } from './infrastructure/typeorm/user.typeorm.entity';
import { UserTypeOrmRepository } from './infrastructure/typeorm/user.typeorm.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { PromotePrimaryAdminBootstrap } from './application/promote-primary-admin.bootstrap';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    PromotePrimaryAdminBootstrap,
  ],
  exports: [UsersService],
})
export class UsersModule {}
