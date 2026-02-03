import { FilterBookingDto } from './filter-booking.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryAllBookingsDto extends FilterBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  classId: number;
}
