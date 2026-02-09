import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user - should return access toke', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'password123',
          name: 'Test User',
          role: 'ADMIN',
          phone: '456465456',
        })
        .expect((res) => {
          console.log('Response:', res.body);
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    // it('should fail with duplicate email', async () => {
    //   const email = `duplicate${Date.now()}@example.com`;
    //
    //   await request(app.getHttpServer())
    //     .post('/auth/register')
    //     .send({ email, password: 'password123', name: 'User1' });
    //
    //   return request(app.getHttpServer())
    //     .post('/auth/register')
    //     .send({ email, password: 'password123', name: 'User2' })
    //     .expect(409);
    // });
  });
  //
  // describe('POST /auth/login', () => {
  //   it('should login with valid credentials', async () => {
  //     const email = `login${Date.now()}@example.com`;
  //
  //     // Register first
  //     await request(app.getHttpServer())
  //       .post('/auth/register')
  //       .send({ email, password: 'password123', name: 'Login User' });
  //
  //     // Then login
  //     return request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send({ email, password: 'password123' })
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body).toHaveProperty('access_token');
  //         authToken = res.body.access_token;
  //       });
  //   });
  //
  //   it('should fail with invalid credentials', () => {
  //     return request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send({ email: 'wrong@example.com', password: 'wrongpass' })
  //       .expect(401);
  //   });
  // });
  //
  // describe('GET /users/me', () => {
  //   it('should fail without token', () => {
  //     return request(app.getHttpServer()).get('/users/me').expect(401);
  //   });
  //
  //   it('should return user with valid token', async () => {
  //     const email = `profile${Date.now()}@example.com`;
  //
  //     // Register and get token
  //     const registerRes = await request(app.getHttpServer())
  //       .post('/auth/register')
  //       .send({ email, password: 'password123', name: 'Profile User' });
  //
  //     const token = registerRes.body.access_token;
  //
  //     return request(app.getHttpServer())
  //       .get('/users/me')
  //       .set('Authorization', `Bearer ${token}`)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body).toHaveProperty('email', email);
  //       });
  //   });
  // });
});
