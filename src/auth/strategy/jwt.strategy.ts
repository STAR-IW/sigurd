import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
//Validate access token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET') as string,
    });
  }
  //attach what's exported from verify to the request
  async validate(payload: { sub: number; email: string }) {
    // return { userId: payload.sub, username: payload.username };
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      omit: { password: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
