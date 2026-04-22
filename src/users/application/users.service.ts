import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { IUserRepository } from '../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { User } from '../domain/entities/user';
import { CreateUserDto } from '../presentation/dto/create-user.dto';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.create(dto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if ((error as any).code === 'ER_DUP_ENTRY') {
          throw new BadRequestException(
            'Já existe um usuário cadastrado com esses dados',
          );
        }
        throw new BadRequestException('Erro ao salvar no banco de dados');
      }
      throw new InternalServerErrorException('Erro interno ao criar o usuário');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    return this.userRepository.remove(id);
  }
}
