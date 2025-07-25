import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user with hashed password and return success message', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      expect(result).toEqual({
        message:
          'Registration successful. Please check your email for verification.',
      });
    });

    it('should return success message if email already exists', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        message:
          'Registration successful. Please check your email for verification.',
      });
    });

    it('should not return user data in response', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.register(registerDto);

      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('username');
      expect(result).not.toHaveProperty('email');
      expect(result).toHaveProperty('message');
    });
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return user if credentials are valid', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedPassword');
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedPassword');
      expect(result).toBeNull();
    });

    it('should not return password in result', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    const userId = 1;
    const mockToken = 'jwt-token-here';

    it('should return JWT token for valid user id', () => {
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = service.login(userId);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
      });
      expect(result).toEqual({
        access_token: 'jwt-token-here',
      });
    });

    it('should include correct payload in JWT', () => {
      mockJwtService.sign.mockReturnValue(mockToken);

      service.login(userId);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
      });
    });
  });

  describe('getProfile', () => {
    const userId = 1;

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return user profile without password', async () => {
      mockUsersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getProfile(userId);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      const result = await service.getProfile(userId);

      expect(mockUsersRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });
});
