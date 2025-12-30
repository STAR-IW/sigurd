import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  providers: [AuthService, PrismaModule, JwtService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
