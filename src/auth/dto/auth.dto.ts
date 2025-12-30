import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Role } from '@prisma/client';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  name: string;
  @IsEnum(Role, { message: 'Valid role required' })
  role: Role;
  @IsString()
  phone: string;
}
