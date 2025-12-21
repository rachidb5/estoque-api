import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find();
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: Stock[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    // Cria o objeto de where para busca
    const whereCondition = search
      ? [
          { imei: ILike(`%${search}%`) },
          { cor: ILike(`%${search}%`) },
          { observacao: ILike(`%${search}%`) },
        ]
      : {};

    // Executa as queries em paralelo
    const [data, total] = await Promise.all([
      this.stockRepository.find({
        where: whereCondition,
        skip,
        take: limit,
        order: { id: 'DESC' }, // Ordena por ID decrescente (mais recentes primeiro)
      }),
      this.stockRepository.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne({ where: { id } });
    if (!stock) {
      throw new NotFoundException(`Stock com ID ${id} não encontrado`);
    }
    return stock;
  }

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    try {
      const stock = this.stockRepository.create(createStockDto);
      return await this.stockRepository.save(stock);
    } catch (error) {
      // 🔹 Erros do banco (constraint, campo inválido, etc)
      if (error instanceof QueryFailedError) {
        // Exemplo: campo UNIQUE duplicado
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if ((error as any).code === 'ER_DUP_ENTRY') {
          throw new BadRequestException(
            'Já existe um produto cadastrado com esses dados',
          );
        }

        throw new BadRequestException('Erro ao salvar no banco de dados');
      }

      // 🔹 Erro inesperado
      throw new InternalServerErrorException('Erro interno ao criar o produto');
    }
  }

  async update(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
    const stock = await this.findOne(id);
    Object.assign(stock, updateStockDto);
    return this.stockRepository.save(stock);
  }

  // async remove(id: number): Promise<void> {
  //   const stock = await this.findOne(id);
  //   await this.stockRepository.remove(stock);
  // }
}
