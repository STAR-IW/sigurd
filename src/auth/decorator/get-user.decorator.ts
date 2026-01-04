import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Custom decorator to extract user from HTTP request object
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
