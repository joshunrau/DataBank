import { beforeEach, describe, expect, it, spyOn } from 'bun:test';

import type { CreateAccountDto } from '../dto/create-account.dto';
import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { type MockedInstance, createMock } from '@douglasneuroinformatics/nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { I18nService } from '@/i18n/i18n.service';
import { MailService } from '@/mail/mail.service';
import { createUserDtoStubFactory } from '@/users/__tests__/stubs/create-user.dto.stub';
import type { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';

import { AuthService } from '../auth.service';
import { createAccountDtoStubFactory } from './stubs/create-account.dto.stub';
import { currentUserStubFactory } from './stubs/current-user.stub';
import { verifyAccountStubFactory } from './stubs/verify-account.dto.stub';

const validDate = Date.now() + 360000;
const expiredDate = Date.now() - 10000;

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: MockedInstance<UsersService>;
  let cryptoService: MockedInstance<CryptoService>;
  let jwtService: MockedInstance<JwtService>;

  // called before every test to intialize the AuthService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (propertyPath: string) => propertyPath
          }
        },
        {
          provide: CryptoService,
          useValue: createMock(CryptoService)
        },
        {
          provide: I18nService,
          useValue: createMock(I18nService)
        },
        { provide: JwtService, useValue: createMock(JwtService) },
        {
          provide: MailService,
          useValue: createMock(MailService)
        },
        {
          provide: UsersService,
          useValue: createMock(UsersService)
        }
      ]
    }).compile();
    // get all the services we need from the moduleRef
    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    cryptoService = moduleRef.get(CryptoService);
    jwtService = moduleRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  let createAccountDto: CreateAccountDto;
  let createUserDto: CreateUserDto;
  let verifyAccountDto: VerifyAccountDto;
  let currentUser: CurrentUser;

  beforeEach(() => {
    createAccountDto = createAccountDtoStubFactory();
    createUserDto = createUserDtoStubFactory();
    verifyAccountDto = verifyAccountStubFactory();
    currentUser = currentUserStubFactory();
    jwtService.signAsync.mockResolvedValue('accessToken');
  });

  describe('createAccount', () => {
    it('calls the usersService.createUser and returns the created account', async () => {
      const mockUser = {
        ...createAccountDto,
        isVerified: false,
        role: 'standard'
      };
      usersService.createUser.mockResolvedValue(mockUser);
      const result = await authService.createAccount(createAccountDto);
      expect(result).toMatchObject(mockUser);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // can use spyOn insead: spyOn(usersService, 'findByEmail').mockResolvedValue(createUserDto);
      usersService.findByEmail.mockResolvedValue(createUserDto);
      cryptoService.comparePassword.mockResolvedValue(true);
    });

    it('should throw an UnauthorizedException when given an invalid email when calling usersService.findByEmail', () => {
      const { password } = createUserDto;
      usersService.findByEmail.mockResolvedValue(undefined);
      expect(authService.login('invalid@example.com', password)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw an UnauthorizedException when given an invalid password when calling cryptoService.comparePassword', () => {
      const { email } = createUserDto;
      cryptoService.comparePassword.mockResolvedValue(false);
      expect(authService.login(email, 'invalidPassword')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should return an access token when given valid credentials', async () => {
      const { email, password } = createUserDto;
      const result = await authService.login(email, password);
      expect(result.accessToken).toEqual('accessToken');
    });
  });

  describe('sendVerificationCode', () => {
    const locale: Locale = 'en';

    it('should throw NotFoundException if the user is not found when calling usersService.findByEmail', () => {
      usersService.findByEmail.mockResolvedValue(undefined);
      expect(authService.sendVerificationCode(currentUser, locale)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should use an existing verification code if the date is not expired', async () => {
      const user: User = {
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: true,
        lastName: 'User',
        role: 'standard',
        verificationCode: {
          attemptsMade: 0,
          expiry: validDate,
          value: 456
        }
      };
      usersService.findByEmail.mockResolvedValue(user);
      const result = await authService.sendVerificationCode(currentUser, locale);
      // check to see if the logic inside sendVerificationCode works with a valid date
      expect(result.attemptsMade).toBe(0);
      expect(result.expiry).toBe(validDate);
    });

    it('should update the user.verificationCode when the date is expired', async () => {
      // Use Record<string, any> to have updateOne function within the User type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: User & Record<string, any> = {
        email: 'test@example.com',
        firstName: 'Test',
        hashedPassword: 'hashedPassword',
        isVerified: true,
        lastName: 'User',
        role: 'standard',
        updateOne: () => null,
        verificationCode: {
          attemptsMade: 0,
          expiry: expiredDate,
          value: 456
        }
      };

      // Mock the mongoose updateOne() function
      const mockUpdateOne = jest.fn(() => user.updateOne());
      // The resolved value can be anything
      mockUpdateOne.mockResolvedValue({});
      usersService.findByEmail.mockResolvedValue(user);
      const result = await authService.sendVerificationCode(currentUser, locale);
      // check to see if the logic inside sendVerificationCode works with an expired date
      expect(result.attemptsMade).toBe(0);
      expect(result.expiry).toBeGreaterThanOrEqual(Date.now());
    });
  });
});
