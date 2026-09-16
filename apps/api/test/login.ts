import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/modules-system/prisma/prisma.service.js';

describe('Auth Module E2E Test Suite (Senior QA Standards)', () => {
  let app: INestApplication;
  let prismaServiceMock: {
    users: {
      findUnique: ReturnType<typeof vi.fn>;
    };
  };

  const validTestUser = {
    id: '6aa96cea2e1f1c6704772585',
    email: 'tqlam150504@gmail.com',
    fullName: 'Trần Quốc Lâm',
    passwordHash: bcrypt.hashSync('lam12345', 10),
    role: 'users',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaServiceMock = {
      users: {
        findUnique: vi.fn(),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();

    // Mirror production configuration from main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await app.close();
  });

  describe('POST /api/auth/login - User Login Endpoint', () => {
    // ------------------------------------------------------------------------
    // 1. HAPPY PATH (POSITIVE TESTS)
    // ------------------------------------------------------------------------
    it('[TC-AUTH-001] Should login successfully with valid email and password', async () => {
      prismaServiceMock.users.findUnique.mockResolvedValue(validTestUser);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: validTestUser.email,
          password: 'lam12345',
        });

      expect(response.status).toBe(201); // NestJS default @Post response code
      expect(response.body).toHaveProperty('message', 'Đăng nhập thành công');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        id: validTestUser.id,
        email: validTestUser.email,
        fullName: validTestUser.fullName,
        role: validTestUser.role,
      });
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(typeof response.body.accessToken).toBe('string');
      expect(typeof response.body.refreshToken).toBe('string');
    });

    // ------------------------------------------------------------------------
    // 2. NEGATIVE TESTS - AUTHENTICATION FAILURES
    // ------------------------------------------------------------------------
    it('[TC-AUTH-002] Should fail with 400 Bad Request when email does not exist', async () => {
      prismaServiceMock.users.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent_user@example.com',
          password: 'lam12345',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Xin vui lòng đăng ký trước khi đăng nhập');
    });

    it('[TC-AUTH-003] Should fail with 400 Bad Request when password is incorrect', async () => {
      prismaServiceMock.users.findUnique.mockResolvedValue(validTestUser);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: validTestUser.email,
          password: 'wrongpassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Mật khẩu chưa chính xác');
    });

    it('[TC-AUTH-004] Should fail when user has no password (OAuth account)', async () => {
      prismaServiceMock.users.findUnique.mockResolvedValue({
        ...validTestUser,
        passwordHash: null,
      });

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: validTestUser.email,
          password: 'lam12345',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Tài khoản chưa có mật khẩu');
    });

    // ------------------------------------------------------------------------
    // 3. BOUNDARY & DTO VALIDATION TESTS
    // ------------------------------------------------------------------------
    it('[TC-AUTH-005] Should reject empty payload with 400 Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBeInstanceOf(Array);
      expect(response.body.message).toContain('Email không được để trống');
      expect(response.body.message).toContain('Mật khẩu không được để trống');
    });

    it('[TC-AUTH-006] Should reject invalid email format with 400 Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'invalid-email-format',
          password: 'lam12345',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Email không đúng định dạng');
    });

    it('[TC-AUTH-007] Should reject request when password field is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'tqlam150504@gmail.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Mật khẩu không được để trống');
    });

    it('[TC-AUTH-008] Should strip non-whitelisted properties from request payload', async () => {
      prismaServiceMock.users.findUnique.mockResolvedValue(validTestUser);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: validTestUser.email,
          password: 'lam12345',
          hackerField: 'malicious_data',
        });

      expect(response.status).toBe(201);
      expect(response.body).not.toHaveProperty('hackerField');
    });
  });
});
