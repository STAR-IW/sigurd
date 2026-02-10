import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker/locale/en';
import { PrismaClient } from '@prisma/client';

describe('Booking (e2e)', () => {
  const prisma = new PrismaClient();

  let app: INestApplication;
  let adminToken: string;
  let user1Token: string;
  let user2Token: string;
  let classId: number;
  let bookingId: number;
  let instructorId : number;

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

    // // Register admin (use seeded admin or create new)
    // const adminRes = await request(app.getHttpServer())
    //   .post('/auth/login')
    //   .send({ email: 'marty@delorian.com"', password: '12345' });
    // adminToken = adminRes.body.access_token;

    // Register two test users
    const user1Res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password().toString(),
        role: 'ADMIN',
        phone: '231231',
      });
    user1Token = user1Res.body.access_token as string;
    const user2Res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password().toString(),
        role: 'ADMIN',
        phone: '231231',
      });
    user2Token = user2Res.body.access_token as string;
    // Create a test class with capacity 1
    const classRes = await request(app.getHttpServer())
      .post('/classes')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        classType: 'CARDIO',
        startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endTime: new Date(Date.now() + 90000000).toISOString(),
        capacity: 1,
        instructorId: 1, // Use seeded instructor
      });
    classId = classRes.body.id;
  });

  afterAll(async () => {
    // await prisma.booking.delete({ where: { id: bookingId } });
    // await prisma.class.delete({ where: { id: classId } });

    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /booking', () => {
    it('should book a class successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${user1Token.replace(/['"]/g, '')}`)
        .send({ classId: classId })
        .expect(201);

      expect(res.body).toHaveProperty('updatedBooking');
      bookingId = res.body.updatedBooking.id;
    });

    it('should add to waitlist when class is full', async () => {
      const res = await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ classId })
        .expect(201);

      expect(res.body).toHaveProperty('position', 1);
      expect(res.body.message).toContain('waitlist');
    });

    it('should fail when booking without authentication', () => {
      return request(app.getHttpServer())
        .post('/booking')
        .send({ classId })
        .expect(401);
    });
  });
  describe('GET /booking', () => {
    it('should get user bookings', async () => {
      const res = await request(app.getHttpServer())
        .get('/booking')
        .set('Authorization', `Bearer ${user1Token.replace(/['"]/g, '')}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /booking/:id', () => {
    it('should cancel booking', async () => {
      await request(app.getHttpServer())
        .delete(`/booking/${bookingId}`)
        .set('Authorization', `Bearer ${user1Token.replace(/['"]/g, '')}`)
        .send({ bookingId, classId })
        .expect(200);
    });

    it('should fail when canceling non-existent booking', () => {
      return request(app.getHttpServer())
        .delete('/booking/99999')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ bookingId: 99999, classId: 999 })
        .expect(404);
    });
  });
});
