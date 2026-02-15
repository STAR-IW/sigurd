import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { InstructorModule } from './instructor/instructor.module';
import { BookingModule } from './booking/booking.module';
import { ClassModule } from './class/class.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { EventsModule } from './events/events.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    //rate limiter
    ThrottlerModule.forRoot({
      throttlers: [
        {
          // in msc - 60 seconds
          ttl: 60000,
          //requests per minute
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    WaitlistModule,
    InstructorModule,
    BookingModule,
    ClassModule,
    AuthModule,
    RedisModule,
    EventsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      // rate limiter - Prevents spamming on all endpoints
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
