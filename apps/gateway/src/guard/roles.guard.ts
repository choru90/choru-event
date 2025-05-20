// src/auth/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './constants';

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
    // 1) 메타데이터로부터 필요한 역할 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      // 역할 지정이 없으면 로그인만 되어 있으면 OK
      return true;
    }

    // 2) request.user 에서 역할 목록 꺼내오기 (JwtStrategy.validate() 에서 user.roleList 으로 리턴)
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as {
      userId: string;
      email: string;
      roleList: string[];
    };
    if (!user || !user.roleList) {
      throw new ForbiddenException('권한이 없습니다 (no roles)');
    }

    // 3) 하나라도 겹치는 역할이 있으면 허용
    const hasRole = requiredRoles.some((role) => user.roleList.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        `필요 권한(${requiredRoles.join(',')})이 없습니다.`,
      );
    }

    return true;
  }
}
