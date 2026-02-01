import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WaitListResponseDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  position: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  classId: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;
  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  joinedAt: Date;
  @IsOptional()
  @IsString()
  @ApiProperty()
  message: string;
}
