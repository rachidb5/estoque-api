import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users.service';

const PRIMARY_ADMIN_ID = '37197909-ac0b-43ad-b48f-537b41f45655';
const PRIMARY_ADMIN_EMAIL = 'jordan.rachid@gmail.com';

@Injectable()
export class PromotePrimaryAdminBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(PromotePrimaryAdminBootstrap.name);

  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    const user =
      (await this.usersService.findOne(PRIMARY_ADMIN_ID)) ??
      (await this.usersService.findByEmail(PRIMARY_ADMIN_EMAIL));

    if (!user) {
      this.logger.warn('Usuario admin principal ainda nao encontrado');
      return;
    }

    if (user.role === 'admin') {
      return;
    }

    await this.usersService.update(user.id, { role: 'admin' });
    this.logger.log(`Usuario ${user.email} promovido para admin`);
  }
}
