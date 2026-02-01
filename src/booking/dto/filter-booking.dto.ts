import { IsOptional } from 'class-validator';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import {  ApiPropertyOptional } from '@nestjs/swagger';

export class FilterBookingDto {
  @IsOptional()
  @ApiPropertyOptional()
  status: Status;
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  startTime: Date;
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  endTime: Date;
}
