import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @IsNotEmpty()
  @ApiProperty()
  classId: number;
}
