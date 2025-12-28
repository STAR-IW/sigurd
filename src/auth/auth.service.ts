import { Body, ForbiddenException, Injectable, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(authDto: AuthDto) {
    try {
      const hash = await bcrypt.hash(authDto.password, 12);
      authDto.password = hash;
      return await this.prisma.user.create({
        data: {
          email: authDto.email,
          password: authDto.password,
          role: Role.ADMIN,
          phone: '3423434',
        },
        select: {
          email: true,
          role: true,
          phone: true,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials already exists');
        }
      }
      throw err;
    }
  }
  async login(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const passwordMatch = await bcrypt.compare(authDto.password, user.password);

    if (!passwordMatch) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
