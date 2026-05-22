import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

const mockUser = {
  _id: '64f88dc579e295bc66f70621',
  name: 'John',
  email: 'john@gmail.com',
  password: '$2b$10$hashedpassword',
  role: 'user',
  save: jest.fn(),
};

const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({ name: 'John', email: 'john@gmail.com', password: '123456' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should register a new user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const newUser = { ...mockUser, save: jest.fn().mockResolvedValue(mockUser) };
      jest.spyOn(service, 'register').mockResolvedValue({
        token: 'mock-token',
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role as any,
          avatar: null,
        },
      });

      const result = await service.register({
        name: 'John',
        email: 'john@gmail.com',
        password: '123456',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('john@gmail.com');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@gmail.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return token on successful login', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as any);

      const result = await service.login({
        email: 'john@gmail.com',
        password: '123456',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('john@gmail.com');
    });
  });
});
