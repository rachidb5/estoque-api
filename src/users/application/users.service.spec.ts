import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { UsersService } from './users.service';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../domain/repositories/user.repository.interface';
import { User } from '../domain/entities/user';

const mockUser: User = {
  id: 'uuid-123',
  username: 'testuser',
  email: 'test@test.com',
  phone: '+5511999999999',
  password: 'hashed_password',
  is_email_verified: false,
  email_verification_token: null,
  email_verification_expires: null,
  reset_password_token: null,
  reset_password_expires: null,
  is_active: true,
  created_at: new Date('2025-01-01'),
  updated_at: new Date('2025-01-01'),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockRepository: jest.Mocked<IUserRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: USER_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(USER_REPOSITORY);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      repository.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário quando encontrado', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@test.com');

      expect(repository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null quando não encontrado', async () => {
      repository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('naoexiste@test.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const dto = {
      username: 'novo',
      email: 'novo@test.com',
      phone: '+5511999999999',
      password: 'hashed',
    };

    it('deve criar e retornar o usuário', async () => {
      repository.create.mockResolvedValue({ id: 'new-uuid', ...dto } as User);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('new-uuid');
    });

    it('deve lançar BadRequestException em usuário duplicado', async () => {
      const dupError = Object.assign(
        new QueryFailedError('INSERT', [], new Error()),
        { code: 'ER_DUP_ENTRY' },
      );
      repository.create.mockRejectedValue(dupError);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'Já existe um usuário cadastrado com esses dados',
      );
    });

    it('deve lançar InternalServerErrorException em erro inesperado', async () => {
      repository.create.mockRejectedValue(new Error('unexpected'));

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
