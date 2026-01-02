import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ClassType } from '@prisma/client';


export class ClassResponseDto {
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
  @IsNotEmpty()
  @IsString()
  instructorName: string;
}
