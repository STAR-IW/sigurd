import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { WaitlistModule } from '../waitlist/waitlist.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [WaitlistModule],
})
export class BookingModule {}
