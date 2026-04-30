import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { SoldDeviceService } from './sold-device.service';
import {
  ISoldDeviceRepository,
  SOLD_DEVICE_REPOSITORY,
} from '../domain/repositories/sold-device.repository.interface';
import { SoldDevice } from '../domain/entities/sold-device';

const mockSoldDevice: SoldDevice = {
  id: 1,
  data: '2025-11-10',
  aparelho: 'iPhone 15 Pro Max',
  cor: 'Titânio Natural',
  condicao: 'Novo',
  imei: '355678901234567',
  fornecedor: 'Apple Store',
  valor_compra: 8500,
  comprador: 'Carlos Silva',
  numero_telefone: '+5511987654321',
  aparelho_recebido: true,
  observacao: 'Caixa lacrada',
  valor_recebido: 8500,
  preco_vista: 8200,
  preco_cartao: 8800,
  valor_entrega: 25,
  valor_capa_pelicula: 150,
  valor_total_venda: 8375,
};

const mockPaginated = {
  data: [mockSoldDevice],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('SoldDeviceService', () => {
  let service: SoldDeviceService;
  let repository: jest.Mocked<ISoldDeviceRepository>;

  beforeEach(async () => {
    const mockRepository: jest.Mocked<ISoldDeviceRepository> = {
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoldDeviceService,
        { provide: SOLD_DEVICE_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<SoldDeviceService>(SoldDeviceService);
    repository = module.get(SOLD_DEVICE_REPOSITORY);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPaginated', () => {
    it('deve delegar ao repositório e retornar resultado paginado', async () => {
      repository.findAllPaginated.mockResolvedValue(mockPaginated);

      const result = await service.findAllPaginated(1, 10);

      expect(repository.findAllPaginated).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockPaginated);
    });

    it('deve passar o termo de busca ao repositório', async () => {
      repository.findAllPaginated.mockResolvedValue({
        ...mockPaginated,
        data: [],
        total: 0,
      });

      await service.findAllPaginated(1, 10, 'carlos');

      expect(repository.findAllPaginated).toHaveBeenCalledWith(
        1,
        10,
        'carlos',
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar a venda quando encontrada', async () => {
      repository.findById.mockResolvedValue(mockSoldDevice);

      const result = await service.findOne(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSoldDevice);
    });

    it('deve lançar NotFoundException quando não encontrada', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(99)).rejects.toThrow(
        'Venda com ID 99 não encontrada',
      );
    });
  });

  describe('create', () => {
    const dto = {
      data: '2025-11-10',
      aparelho: 'iPhone 15',
      imei: '999888777666555',
      valor_compra: 7000,
      comprador: 'Ana',
      aparelho_recebido: false,
      valor_recebido: 0,
      preco_vista: 7200,
      preco_cartao: 7500,
      valor_entrega: 0,
      valor_capa_pelicula: 0,
      valor_total_venda: 7200,
    };

    it('deve criar e retornar a venda', async () => {
      repository.create.mockResolvedValue({ id: 2, ...dto } as SoldDevice);

      const result = await service.create(dto as any);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe(2);
    });

    it('deve lançar BadRequestException em IMEI duplicado (PostgreSQL)', async () => {
      const dupError = Object.assign(
        new QueryFailedError('INSERT', [], new Error()),
        { code: '23505' },
      );
      repository.create.mockRejectedValue(dupError);

      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(dto as any)).rejects.toThrow(
        'Já existe um registro com esse IMEI',
      );
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
    });

    it('deve lançar InternalServerErrorException em erro inesperado', async () => {
      repository.create.mockRejectedValue(new Error('unexpected'));

      await expect(service.create(dto as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    const dto = { comprador: 'João' };

    it('deve atualizar e retornar a venda', async () => {
      repository.findById.mockResolvedValue(mockSoldDevice);
      repository.update.mockResolvedValue({
        ...mockSoldDevice,
        comprador: 'João',
      });

      const result = await service.update(1, dto as any);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
      expect(result.comprador).toBe('João');
    });

    it('deve lançar NotFoundException se venda não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(99, dto as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover a venda quando encontrada', async () => {
      repository.findById.mockResolvedValue(mockSoldDevice);
      repository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se venda não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('deve lançar InternalServerErrorException em erro inesperado', async () => {
      repository.findById.mockResolvedValue(mockSoldDevice);
      repository.remove.mockRejectedValue(new Error('unexpected'));

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
