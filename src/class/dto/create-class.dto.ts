import { ClassType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @IsNotEmpty()
  @IsEnum(ClassType, { message: 'Valid Class Type required' })
  @ApiProperty()
  classType: ClassType;
  @IsNotEmpty()
  @ApiProperty()
  startTime: Date;
  @IsNotEmpty()
  @ApiProperty()
  endTime: Date;
  @IsNotEmpty()
  @ApiProperty()
  capacity: number;
  @IsNotEmpty()
  @ApiProperty()
  instructorId: number;
}
