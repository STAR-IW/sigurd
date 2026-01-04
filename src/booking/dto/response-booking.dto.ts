import { IsNumber } from 'class-validator';
import { ClassType } from '@prisma/client';

export class ResponseBookingDto {
  @IsNumber()
  bookingId: number;
}
