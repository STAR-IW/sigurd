import { ClassType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsEnum(ClassType, { message: 'Valid Class Type required' })
  classType: ClassType;
  @IsNotEmpty()
  startTime: Date;
  @IsNotEmpty()
  endTime: Date;
  @IsNotEmpty()
  capacity: number;
  @IsNotEmpty()
  instructorId: number;
}
