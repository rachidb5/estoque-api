import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<Pick<AuthService, 'register' | 'login'>>;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('deve chamar authService.register e retornar o token', async () => {
      const dto = {
        username: 'user',
        email: 'user@test.com',
        phone: '+5511999999999',
        password: 'senha123',
      };
      service.register.mockResolvedValue({ access_token: 'token-mock' });

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ access_token: 'token-mock' });
    });
  });

  describe('login', () => {
    it('deve chamar authService.login e retornar o token', async () => {
      const dto = { email: 'user@test.com', password: 'senha123' };
      service.login.mockResolvedValue({ access_token: 'token-mock' });

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ access_token: 'token-mock' });
    });
  });
});
