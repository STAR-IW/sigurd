import { IsOptional } from 'class-validator';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterBookingDto {
  @IsOptional()
  status: Status;
  @IsOptional()
  @Type(() => Date)
  startTime: Date;
  @IsOptional()
  @Type(() => Date)
  endTime: Date;
}
