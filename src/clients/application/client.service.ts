import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Client } from '../domain/entities/client';
import {
  CLIENT_REPOSITORY,
  IClientRepository,
} from '../domain/repositories/client.repository.interface';
import { CreateClientDto } from '../presentation/dto/create-client.dto';
import { UpdateClientDto } from '../presentation/dto/update-client.dto';
import {
  normalizePagination,
  PaginatedResult,
} from '../../shared/types/pagination';

@Injectable()
export class ClientService {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async findAllPaginated(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<PaginatedResult<Client>> {
    const pagination = normalizePagination(page, limit);

    return this.clientRepository.findAllPaginated(
      pagination.page,
      pagination.limit,
      search,
    );
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return client;
  }

  async create(dto: CreateClientDto): Promise<Client> {
    try {
      return await this.clientRepository.create(this.normalizePayload(dto));
    } catch (error) {
      this.handleWriteError(error, 'Erro interno ao criar o cliente');
    }
  }

  async update(id: number, dto: UpdateClientDto): Promise<Client> {
    await this.findOne(id);

    try {
      return await this.clientRepository.update(id, this.normalizePayload(dto));
    } catch (error) {
      this.handleWriteError(error, 'Erro interno ao atualizar o cliente');
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    try {
      await this.clientRepository.remove(id);
    } catch {
      throw new InternalServerErrorException('Erro interno ao remover o cliente');
    }
  }

  private normalizePayload<T extends CreateClientDto | UpdateClientDto>(
    payload: T,
  ): T {
    const normalized = {
      ...payload,
      cpf: payload.cpf?.replace(/\D/g, ''),
      telefone: payload.telefone?.replace(/\D/g, ''),
      cep: payload.cep?.replace(/\D/g, ''),
      estado: payload.estado?.toUpperCase(),
    };

    if (payload.total_compras !== undefined) {
      return {
        ...normalized,
        total_compras: Number(payload.total_compras),
      };
    }

    return normalized;
  }

  private handleWriteError(error: unknown, fallbackMessage: string): never {
    if (error instanceof QueryFailedError) {
      const code = (error as any).code;

      if (code === 'ER_DUP_ENTRY' || code === '23505') {
        throw new BadRequestException('Já existe um cliente com esse CPF');
      }

      throw new BadRequestException('Erro ao salvar no banco de dados');
    }

    throw new InternalServerErrorException(fallbackMessage);
  }
}
