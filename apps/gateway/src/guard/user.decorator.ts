import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../../auth/src/auth/types/jwt-payload.interface';

type ReqWithUser = { user?: JwtPayload };

export const User = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | string | string[] | undefined => {
    const req = ctx.switchToHttp().getRequest<ReqWithUser>();
    const user = req.user;
    if (!user) {
      return undefined;
    }
    return data ? user[data] : user;
  },
);
