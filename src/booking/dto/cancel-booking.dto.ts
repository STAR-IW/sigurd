import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  bookingId: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  classId: number;
}
