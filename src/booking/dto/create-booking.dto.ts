import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  classId: number;
}
