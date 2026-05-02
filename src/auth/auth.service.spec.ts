import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/application/users.service';

const mockUser = {
  id: 'uuid-123',
  email: 'test@test.com',
  username: 'testuser',
  role: 'vendedor',
  phone: '+5511999999999',
  password: '',
  is_active: true,
  is_email_verified: false,
  email_verification_token: null,
  email_verification_expires: null,
  reset_password_token: null,
  reset_password_expires: null,
  refresh_token_hash: null,
  refresh_token_expires: null,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<
    Pick<
      UsersService,
      | 'findByEmail'
      | 'findByRefreshTokenHash'
      | 'create'
      | 'setRefreshToken'
      | 'clearRefreshToken'
    >
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      findByRefreshTokenHash: jest.fn(),
      create: jest.fn(),
      setRefreshToken: jest.fn(),
      clearRefreshToken: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('jwt-token-mock'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const dto = {
      username: 'testuser',
      email: 'test@test.com',
      phone: '+5511999999999',
      password: 'senha123',
    };

    it('deve registrar usuário e retornar access_token', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser as any);
      usersService.setRefreshToken.mockResolvedValue(mockUser as any);

      const result = await service.register(dto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(usersService.create).toHaveBeenCalled();
      expect(result).toEqual({
        access_token: 'jwt-token-mock',
        expires_in: '15m',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('deve lançar ConflictException se email já existe', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      await expect(service.register(dto)).rejects.toThrow('Email já cadastrado');
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('deve fazer hash da senha antes de criar o usuário', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser as any);
      usersService.setRefreshToken.mockResolvedValue(mockUser as any);

      await service.register(dto);

      const createArg = (usersService.create as jest.Mock).mock.calls[0][0];
      expect(createArg.password).not.toBe(dto.password);
      expect(createArg.password).toMatch(/^\$2b\$/);
    });

    it('deve assinar JWT com id e email do usuário', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser as any);
      usersService.setRefreshToken.mockResolvedValue(mockUser as any);

      await service.register(dto);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('login', () => {
    const dto = { email: 'test@test.com', password: 'senha123' };

    it('deve autenticar e retornar access_token', async () => {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      } as any);
      usersService.setRefreshToken.mockResolvedValue(mockUser as any);

      const result = await service.login(dto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual({
        access_token: 'jwt-token-mock',
        expires_in: '15m',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('deve lançar UnauthorizedException se usuário não existe', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(dto)).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar UnauthorizedException se senha está incorreta', async () => {
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        password: 'hash-errado',
      } as any);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(dto)).rejects.toThrow('Credenciais inválidas');
    });
  });
});
