import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ClassType } from '@prisma/client';


export class QueryClassDto {
  @IsOptional()
  @IsEnum(ClassType, { message: 'Valid Class Type required' })
  classType: ClassType;
  @IsOptional()
  instructorId: number;
  @IsOptional()
  startTime: Date;
  @IsOptional()
  endTime: Date;
}
