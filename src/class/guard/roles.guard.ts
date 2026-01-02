import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload-interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    //decorator(roles),current route method
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    //request is generic -ts doesn't know 'user' in generic express req
    const user = request.user as JwtPayload;

    if (!user || !user.role) {
      console.log('No user or no role, denying access');

      return false;
    }
    return roles.includes(user.role);
  }
}
