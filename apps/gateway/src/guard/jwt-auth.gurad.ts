import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Passport 전략 이름 'jwt'를 사용하는 인증 가드
 * 컨트롤러나 핸들러에 @UseGuards(JwtAuthGuard) 로 적용
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
