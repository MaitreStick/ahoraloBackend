import AuthController  from  "./auth.controller";
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGoogleLoginDto } from './dto/login-google-user.dto';
import { User } from './entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

    const mockAuthService = {
    create: jest.fn(),
    login: jest.fn(),
    checkAuthStatus: jest.fn(),
    signInGoogle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('debe llamar a authService.create con el DTO proporcionado y retornar su valor', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: '123456'
      } as CreateUserDto;
      const result = { id: 'user123', ...createUserDto, status: 'created' };

      authService.create.mockResolvedValue(result);

      await expect(controller.createUser(createUserDto)).resolves.toEqual(result);
      expect(authService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('loginUser', () => {
    it('debe llamar a authService.login con el DTO proporcionado y retornar su valor', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: '123456'
      } as LoginUserDto;
      const result = { token: 'jwt.token.here', user: { id: 'user123' } };

      authService.login.mockResolvedValue(result);

      await expect(controller.loginUser(loginUserDto)).resolves.toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe('checkAuthStatus', () => {
    it('debe llamar a authService.checkAuthStatus con el usuario proporcionado y retornar su valor', async () => {
      const user: User = {
        id: 'user123',
        email: 'test@example.com'
      } as User;
      const result = { status: 'authenticated', user };

      authService.checkAuthStatus.mockResolvedValue(result);

      await expect(controller.checkAuthStatus(user)).resolves.toEqual(result);
      expect(authService.checkAuthStatus).toHaveBeenCalledWith(user);
    });
  });

  describe('googleLogin', () => {
    it('debe llamar a authService.signInGoogle con el DTO proporcionado y retornar su valor', async () => {
      const googleLoginDto: AuthGoogleLoginDto = {
        token: 'google-token'
      } as AuthGoogleLoginDto;
      const result = { token: 'jwt.token.here', user: { id: 'user123' } };

      authService.signInGoogle.mockResolvedValue(result);

      await expect(controller.googleLogin(googleLoginDto)).resolves.toEqual(result);
      expect(authService.signInGoogle).toHaveBeenCalledWith(googleLoginDto);
    });
  });
});