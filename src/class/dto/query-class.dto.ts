import { IsEnum, IsOptional } from 'class-validator';
import { ClassType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class QueryClassDto {
  @IsOptional()
  @IsEnum(ClassType, { message: 'Valid Class Type required' })
  @ApiPropertyOptional()
  classType: ClassType;
  @IsOptional()
  @ApiPropertyOptional()
  instructorId: number;
  @IsOptional()
  @ApiPropertyOptional()
  startTime: Date;
  @IsOptional()
  @ApiPropertyOptional()
  endTime: Date;
}
