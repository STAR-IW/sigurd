import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryInstructorScheduleDto {
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Date)
  startTime: Date;
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Date)
  endTime: Date;
}
