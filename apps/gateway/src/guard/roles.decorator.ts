import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from './constants';

/**
 * @Roles('ADMIN', 'OPERATOR')
 * 메타데이터로 필요한 역할 목록을 저장
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
