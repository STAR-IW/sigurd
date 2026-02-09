// login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'marty@delorian.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345' })
  password: string;
}
