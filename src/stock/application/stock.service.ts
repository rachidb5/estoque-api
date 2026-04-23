import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { IStockRepository } from '../domain/repositories/stock.repository.interface';
import { STOCK_REPOSITORY } from '../domain/repositories/stock.repository.interface';
import { Stock } from '../domain/entities/stock';
import { CreateStockDto } from '../presentation/dto/create-stock.dto';
import { UpdateStockDto } from '../presentation/dto/update-stock.dto';
import { PaginatedResult } from '../../shared/types/pagination';

@Injectable()
export class StockService {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
  ) {}

  async findAllPaginated(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<PaginatedResult<Stock>> {
    return this.stockRepository.findAllPaginated(page, limit, search);
  }

  async findOne(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      throw new NotFoundException(`Stock com ID ${id} não encontrado`);
    }
    return stock;
  }

  async create(dto: CreateStockDto): Promise<Stock> {
    try {
      return await this.stockRepository.create(dto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if ((error as any).code === 'ER_DUP_ENTRY') {
          throw new BadRequestException(
            'Já existe um produto cadastrado com esses dados',
          );
        }
        throw new BadRequestException('Erro ao salvar no banco de dados');
      }
      throw new InternalServerErrorException('Erro interno ao criar o produto');
    }
  }

  async update(id: number, dto: UpdateStockDto): Promise<Stock> {
    await this.findOne(id);
    try {
      return await this.stockRepository.update(id, dto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Erro ao atualizar no banco de dados');
      }
      throw new InternalServerErrorException(
        'Erro interno ao atualizar o produto',
      );
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.stockRepository.remove(id);
  }
}
