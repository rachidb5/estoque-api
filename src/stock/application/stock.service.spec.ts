import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { StockService } from './stock.service';
import {
  IStockRepository,
  STOCK_REPOSITORY,
} from '../domain/repositories/stock.repository.interface';
import { Stock } from '../domain/entities/stock';

const mockStock: Stock = {
  id: 1,
  modelo: 'iPhone 13',
  imei: '123456789012345',
  fornecedor: 'Apple Store',
  cor: 'Preto',
  observacao: 'Novo',
  valor_unitario: 5000,
};

const mockPaginated = {
  data: [mockStock],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('StockService', () => {
  let service: StockService;
  let repository: jest.Mocked<IStockRepository>;

  beforeEach(async () => {
    const mockRepository: jest.Mocked<IStockRepository> = {
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        { provide: STOCK_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    repository = module.get(STOCK_REPOSITORY);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPaginated', () => {
    it('deve delegar ao repositório e retornar resultado paginado', async () => {
      repository.findAllPaginated.mockResolvedValue(mockPaginated);

      const result = await service.findAllPaginated(1, 10);

      expect(repository.findAllPaginated).toHaveBeenCalledWith(1, 10, undefined);
      expect(result).toEqual(mockPaginated);
    });

    it('deve passar o termo de busca ao repositório', async () => {
      repository.findAllPaginated.mockResolvedValue({
        ...mockPaginated,
        data: [],
        total: 0,
      });

      await service.findAllPaginated(1, 10, 'iphone');

      expect(repository.findAllPaginated).toHaveBeenCalledWith(1, 10, 'iphone');
    });
  });

  describe('findOne', () => {
    it('deve retornar o produto quando encontrado', async () => {
      repository.findById.mockResolvedValue(mockStock);

      const result = await service.findOne(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStock);
    });

    it('deve lançar NotFoundException quando não encontrado', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(99)).rejects.toThrow(
        'Stock com ID 99 não encontrado',
      );
    });
  });

  describe('create', () => {
    const dto = {
      modelo: 'iPhone 13',
      imei: '111222333444555',
      valor_unitario: 5000,
    };

    it('deve criar e retornar o produto', async () => {
      repository.create.mockResolvedValue({ id: 2, ...dto } as Stock);

      const result = await service.create(dto as any);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe(2);
      expect(result.modelo).toBe('iPhone 13');
    });

    it('deve lançar BadRequestException em IMEI duplicado (MySQL)', async () => {
      const dupError = Object.assign(
        new QueryFailedError('INSERT', [], new Error()),
        { code: 'ER_DUP_ENTRY' },
      );
      repository.create.mockRejectedValue(dupError);

      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(dto as any)).rejects.toThrow(
        'Já existe um produto cadastrado com esses dados',
      );
    });

    it('deve lançar BadRequestException em erro de banco genérico', async () => {
      const dbError = new QueryFailedError('INSERT', [], new Error());
      repository.create.mockRejectedValue(dbError);

      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar InternalServerErrorException em erro inesperado', async () => {
      repository.create.mockRejectedValue(new Error('unexpected'));

      await expect(service.create(dto as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    const dto = { modelo: 'iPhone 14' };

    it('deve atualizar e retornar o produto', async () => {
      repository.findById.mockResolvedValue(mockStock);
      repository.update.mockResolvedValue({ ...mockStock, modelo: 'iPhone 14' });

      const result = await service.update(1, dto as any);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
      expect(result.modelo).toBe('iPhone 14');
    });

    it('deve lançar NotFoundException se produto não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(99, dto as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException em erro de banco ao atualizar', async () => {
      repository.findById.mockResolvedValue(mockStock);
      repository.update.mockRejectedValue(
        new QueryFailedError('UPDATE', [], new Error()),
      );

      await expect(service.update(1, dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
