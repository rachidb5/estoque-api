import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class PromoteUsersToAdminBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(PromoteUsersToAdminBootstrap.name);

  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    const updatedUsers = await this.usersService.promoteAllToAdmin();
    this.logger.log(`${updatedUsers} usuario(s) promovido(s) para admin`);
  }
}
