import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { WaitlistService } from '../waitlist/waitlist.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [WaitlistService],
})
export class BookingModule {}
