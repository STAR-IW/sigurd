import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { InstructorModule } from './instructor/instructor.module';
import { BookingModule } from './booking/booking.module';
import { ClassModule } from './class/class.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    WaitlistModule,
    InstructorModule,
    BookingModule,
    ClassModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
