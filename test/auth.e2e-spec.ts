import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker/locale/en';

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
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  describe('POST /auth/register', () => {
    it('should register a new user - should return access token', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
          name: faker.person.firstName(),
          role: 'ADMIN',
          phone: faker.phone.number(),
        })
        .expect((res) => {
          console.log('Response:', res.body);
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should fail with duplicate email', async () => {
      const duplicatedEmail = faker.internet.email();

      await request(app.getHttpServer()).post('/auth/register').send({
        email: duplicatedEmail,
        password: faker.internet.password(),
        name: faker.person.firstName(),
        role: 'ADMIN',
        phone: faker.phone.number(),
      });

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: duplicatedEmail,
          password: faker.internet.password(),
          name: faker.person.firstName(),
          role: 'ADMIN',
          phone: faker.phone.number(),
        })
        .expect((res: any) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toMatch('Credentials already exists');
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const testUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.firstName(),
        role: 'ADMIN',
        phone: faker.phone.number(),
      };

      // Register first
      await request(app.getHttpServer()).post('/auth/register').send(testUser);

      // Then login - send ALL fields
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser) // Send the full object, not just email/password
        .expect(201)
        .expect((res: any) => {
          expect(res.body).toHaveProperty('access_token');
          authToken = res.body.access_token;
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: faker.internet.email(),
          password: 'wrongpassword',

        })
        .expect(401)
        .expect((res: any) => {
          expect(res.body).toHaveProperty('message');
        });
    });
  });

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
