import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinWaitlistDTO {
  @IsNotEmpty()
  @IsNumber()
  classId: number;
}
