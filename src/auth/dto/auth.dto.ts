import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
  @IsString()
  @ApiProperty()
  name: string;
  @IsEnum(Role, { message: 'Valid role required' })
  @ApiProperty()
  role: Role;
  @IsString()
  @ApiProperty()
  phone: string;
}
