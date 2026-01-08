/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      // 🔹 Erros do banco (constraint, campo inválido, etc)
      console.log(error);
      if (error instanceof QueryFailedError) {
        // Exemplo: campo UNIQUE duplicado
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if ((error as any).code === 'ER_DUP_ENTRY') {
          throw new BadRequestException(
            'Já existe um usuário cadastrado com esses dados',
          );
        }

        throw new BadRequestException('Erro ao salvar no banco de dados');
      }

      // 🔹 Erro inesperado
      throw new InternalServerErrorException('Erro interno ao criar o usuário');
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
