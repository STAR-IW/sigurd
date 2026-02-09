import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //POST /auth/register
  @ApiOperation({ summary: 'Register a new user to the application' })
  @Post('register')
  async register(@Body() signupDto: SignupDto) {
    return await this.authService.register(signupDto);
  }
  //POST /auth/login
  @ApiOperation({ summary: 'Login a user to the application' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
