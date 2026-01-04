import { IsNotEmpty, IsNumber } from 'class-validator';

export class CancelBookingDto {
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;
}
