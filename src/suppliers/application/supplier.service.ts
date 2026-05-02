import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { normalizePagination, PaginatedResult } from '../../shared/types/pagination';
import { Supplier } from '../domain/entities/supplier';
import {
  SUPPLIER_REPOSITORY,
} from '../domain/repositories/supplier.repository.interface';
import type { ISupplierRepository } from '../domain/repositories/supplier.repository.interface';
import { CreateSupplierDto } from '../presentation/dto/create-supplier.dto';
import { UpdateSupplierDto } from '../presentation/dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async findAllPaginated(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<PaginatedResult<Supplier>> {
    const pagination = normalizePagination(page, limit);

    return this.supplierRepository.findAllPaginated(
      pagination.page,
      pagination.limit,
      search,
    );
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new NotFoundException(`Fornecedor com ID ${id} nao encontrado`);
    }

    return supplier;
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    try {
      return await this.supplierRepository.create(this.normalizePayload(dto));
    } catch (error) {
      this.handleWriteError(error, 'Erro interno ao criar o fornecedor');
    }
  }

  async update(id: number, dto: UpdateSupplierDto): Promise<Supplier> {
    await this.findOne(id);

    try {
      return await this.supplierRepository.update(id, this.normalizePayload(dto));
    } catch (error) {
      this.handleWriteError(error, 'Erro interno ao atualizar o fornecedor');
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    try {
      await this.supplierRepository.remove(id);
    } catch {
      throw new InternalServerErrorException(
        'Erro interno ao remover o fornecedor',
      );
    }
  }

  private normalizePayload<T extends CreateSupplierDto | UpdateSupplierDto>(
    payload: T,
  ): T {
    return {
      ...payload,
      cnpj: payload.cnpj?.replace(/\D/g, ''),
      telefone: payload.telefone?.replace(/\D/g, ''),
      cep: payload.cep?.replace(/\D/g, ''),
      estado: payload.estado?.toUpperCase(),
    };
  }

  private handleWriteError(error: unknown, fallbackMessage: string): never {
    if (error instanceof QueryFailedError) {
      const code = (error as any).code;

      if (code === 'ER_DUP_ENTRY' || code === '23505') {
        throw new BadRequestException('Ja existe um fornecedor com esse CNPJ');
      }

      throw new BadRequestException('Erro ao salvar no banco de dados');
    }

    throw new InternalServerErrorException(fallbackMessage);
  }
}
