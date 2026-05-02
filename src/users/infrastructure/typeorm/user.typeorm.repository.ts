import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.typeorm.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  findByRefreshTokenHash(refreshTokenHash: string): Promise<User | null> {
    return this.repo.findOne({
      where: { refresh_token_hash: refreshTokenHash },
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } }) as Promise<User>;
  }

  async updateAllRoles(role: 'vendedor' | 'gestor' | 'admin'): Promise<number> {
    const result = await this.repo
      .createQueryBuilder()
      .update(UserEntity)
      .set({ role })
      .execute();
    return result.affected ?? 0;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
