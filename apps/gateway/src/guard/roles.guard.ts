// src/auth/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './constants';
import { JwtPayload } from '../../../auth/src/auth/types/jwt-payload.interface';

/**
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('ADMIN', 'OPERATOR')
 *
 * JwtAuthGuard 로 먼저 인증된 뒤,
 * RolesGuard 가 user.roleList 에 필수 역할이 있는지 검사합니다.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest<{
      user?: JwtPayload;
    }>();

    const user = request.user;
    console.log('role test', user, !user?.roleList);
    if (!user?.roleList) {
      throw new ForbiddenException('권한이 없습니다 (no roles)');
    }

    const hasRole = requiredRoles.some((role) => user.roleList.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        `필요 권한(${requiredRoles.join(',')})이 없습니다.`,
      );
    }

    return true;
  }
}
