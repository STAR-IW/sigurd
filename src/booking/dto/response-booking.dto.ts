import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseBookingDto {
  @IsNumber()
  @ApiProperty()
  bookingId: number;
}
