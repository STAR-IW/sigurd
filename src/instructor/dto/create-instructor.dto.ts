import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Specialty } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstructorDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  userId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Yeah buddy!' })
  bio: string;

  @IsEnum(Specialty)
  @ApiProperty({ example: 'WEIGHT_LIFTING' })
  specialties: Specialty;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  isActive: boolean;
}
