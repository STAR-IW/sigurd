import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ClassType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';


export class ClassResponseDto {
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
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  instructorName: string;
}
