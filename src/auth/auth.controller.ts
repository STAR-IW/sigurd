import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //POST /auth/register
  @ApiOperation({ summary: 'Register a new user to the application' })
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return await this.authService.register(authDto);
  }
  //POST /auth/login
  @ApiOperation({ summary: 'Login a user to the application' })
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return await this.authService.login(authDto);
  }
}
