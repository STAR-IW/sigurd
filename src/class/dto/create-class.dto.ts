import { ClassType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @IsNotEmpty()
  @IsEnum(ClassType, { message: 'Valid Class Type required' })
  @ApiProperty({ example: 'WEIGHT_LIFTING' })
  classType: ClassType;
  @IsNotEmpty()
  @ApiProperty({ example: '2050-02-04T18:10:13.460Z' })
  startTime: Date;
  @IsNotEmpty()
  @ApiProperty({ example: '2055-02-04T18:10:13.460Z' })
  endTime: Date;
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  capacity: number;
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  instructorId: number;
}
