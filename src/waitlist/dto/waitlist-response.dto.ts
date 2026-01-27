import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class WaitListResponseDto {
  @IsNotEmpty()
  @IsNumber()
  position: number;
  @IsNotEmpty()
  @IsNumber()
  classId: number;
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  @IsNotEmpty()
  @IsDate()
  joinedAt: Date;
  @IsOptional()
  @IsString()
  message: string;
}
