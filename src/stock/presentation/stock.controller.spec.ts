import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from '../application/stock.service';
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

describe('StockController', () => {
  let controller: StockController;
  let service: jest.Mocked<StockService>;

  beforeEach(async () => {
    const mockService = {
      findAllPaginated: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [{ provide: StockService, useValue: mockService }],
    }).compile();

    controller = module.get<StockController>(StockController);
    service = module.get(StockService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('deve chamar findAllPaginated com valores padrão', async () => {
      service.findAllPaginated.mockResolvedValue(mockPaginated);

      const result = await controller.findAll(1, 10, undefined);

      expect(service.findAllPaginated).toHaveBeenCalledWith(1, 10, undefined, {
        observation: undefined,
        supplier: undefined,
      });
      expect(result).toEqual(mockPaginated);
    });

    it('deve passar parâmetros de busca corretamente', async () => {
      service.findAllPaginated.mockResolvedValue(mockPaginated);

      await controller.findAll(2, 5, 'iphone');

      expect(service.findAllPaginated).toHaveBeenCalledWith(2, 5, 'iphone', {
        observation: undefined,
        supplier: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto pelo id', async () => {
      service.findOne.mockResolvedValue(mockStock);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStock);
    });
  });

  describe('create', () => {
    it('deve criar e retornar o produto', async () => {
      const dto = { modelo: 'iPhone 13', imei: '111', valor_unitario: 5000 };
      service.create.mockResolvedValue({ id: 1, ...dto } as Stock);

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe(1);
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o produto', async () => {
      const dto = { modelo: 'iPhone 14' };
      service.update.mockResolvedValue({ ...mockStock, modelo: 'iPhone 14' });

      const result = await controller.update(1, dto as any);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result.modelo).toBe('iPhone 14');
    });
  });
});
