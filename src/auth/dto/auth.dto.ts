import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'marty@delorian.com' })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12345' })
  password: string;
  @IsString()
  @ApiProperty({ example: 'Marty McFly' })
  name: string;
  @IsEnum(Role, { message: 'Valid role required' })
  @ApiProperty({ example: 'ADMIN' })
  role: Role;
  @IsString()
  @ApiProperty({ example: '055511111' })
  phone: string;
}
