import {
  type CanActivate,
  createParamDecorator,
  type ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import type { Request } from 'express';
import { AUTH_COOKIE } from './auth.constants.js';
import { type AdminSession, AuthService } from './auth.service.js';

type AuthedRequest = Request & { admin?: AdminSession };

/** Chỉ cho admin đã đăng nhập (cookie httpOnly chứa JWT) */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const token = (req.cookies as Record<string, string> | undefined)?.[AUTH_COOKIE];
    if (!token) throw new UnauthorizedException('Chưa đăng nhập');
    req.admin = await this.auth.verify(token);
    return true;
  }
}

/** Lấy phiên admin hiện tại trong controller: `@CurrentAdmin() admin: AdminSession` */
export const CurrentAdmin = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest<AuthedRequest>().admin
);
