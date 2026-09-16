import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/modules-system/prisma/prisma.service.js';

describe('Skillora E2E Verification (Analysis & Resources Modules)', () => {
  let app: INestApplication;

  const prismaMock = {
    users: {
      findUnique: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('1. Resources Module (GET /api/resources & POST /api/resources)', () => {
    it('should return initial seed resources on GET /api/resources', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/resources')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(8);
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('skill_tags');
    });

    it('should filter resources by difficulty', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/resources?difficulty=beginner')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((item: any) => {
        expect(item.difficulty).toBe('beginner');
      });
    });

    it('should create a new teacher resource on POST /api/resources', async () => {
      const newResource = {
        title: 'Thực chiến Microservices với NestJS và Kafka',
        type: 'project',
        difficulty: 'advanced',
        skill_tags: ['NestJS', 'Kafka', 'Microservices', 'Docker'],
        url: 'https://nestjs.com/microservices',
        author: 'TS. Nguyễn Khoa',
        description: 'Đồ án mẫu kết nối NestJS microservices qua Kafka message broker.',
      };

      const res = await request(app.getHttpServer())
        .post('/api/resources')
        .send(newResource)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(newResource.title);
      expect(res.body.difficulty).toBe('advanced');
    });
  });

  describe('2. Analysis Module (POST /api/analyses & GET /api/analyses/:id)', () => {
    let createdAnalysisId: string;

    it('should reject analysis request when cv_file is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/analyses')
        .field('target_role', 'backend_developer')
        .expect(400);
    });

    it('should accept multipart CV upload, run deterministic gap engine, and return analysis', async () => {
      const dummyCv = Buffer.from('Nguyen Van A - IT Student. Skills: JavaScript, TypeScript, Git.');

      const res = await request(app.getHttpServer())
        .post('/api/analyses')
        .attach('cv_file', dummyCv, 'resume.pdf')
        .field('target_role', 'backend_developer')
        .expect(201);

      expect(res.body).toHaveProperty('analysis_id');
      expect(res.body.status).toBe('completed');
      expect(res.body.target_role).toBe('backend_developer');

      // Scores checks
      expect(res.body.scores).toHaveProperty('readiness_score');
      expect(res.body.scores).toHaveProperty('ats_score');
      expect(res.body.scores).toHaveProperty('academic_score');
      expect(typeof res.body.scores.readiness_score).toBe('number');

      // Gaps and actions
      expect(Array.isArray(res.body.gap_items)).toBe(true);
      expect(res.body.gap_items.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body.prioritized_actions)).toBe(true);
      expect(res.body.prioritized_actions.length).toBeGreaterThan(0);

      // Recommendations matching teacher resources
      expect(Array.isArray(res.body.recommended_resources)).toBe(true);

      createdAnalysisId = res.body.analysis_id;
    });

    it('should retrieve analysis by ID on GET /api/analyses/:id', async () => {
      expect(createdAnalysisId).toBeDefined();

      const res = await request(app.getHttpServer())
        .get(`/api/analyses/${createdAnalysisId}`)
        .expect(200);

      expect(res.body.analysis_id).toBe(createdAnalysisId);
      expect(res.body.status).toBe('completed');
    });

    it('should return 404 for nonexistent analysis ID', async () => {
      await request(app.getHttpServer())
        .get('/api/analyses/nonexistent_id_12345')
        .expect(404);
    });
  });

  describe('3. Roadmap Generation Module (POST /api/roadmaps/generate)', () => {
    it('should generate a 4-week structured curriculum with teacher resources', async () => {
      const payload = {
        target_role: 'backend_developer',
        starting_level: 'beginner',
        gap_items: [
          {
            skill_id: 'nestjs_typescript',
            skill_name: 'NestJS & TypeScript',
            severity: 'high',
            category: 'core',
            current_level: 'missing',
            target_level: 'intermediate',
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post('/api/roadmaps/generate')
        .send(payload)
        .expect(201);

      expect(res.body).toHaveProperty('roadmap_id');
      expect(res.body.target_role).toBe('backend_developer');
      expect(Array.isArray(res.body.phases)).toBe(true);
      expect(res.body.phases.length).toBeGreaterThanOrEqual(1);
    });
  });
});
