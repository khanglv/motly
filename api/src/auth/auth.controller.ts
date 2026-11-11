import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import type { CookieOptions, Response } from 'express';
import { AUTH_COOKIE, SESSION_DAYS } from './auth.constants.js';
import { AdminGuard, CurrentAdmin } from './auth.guard.js';
import { type AdminSession, AuthService } from './auth.service.js';

class LoginDto {
  @IsEmail()
  @MaxLength(200)
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  password: string;
}

class ChangePasswordDto {
  @IsString()
  @MaxLength(200)
  currentPassword: string;

  @IsString()
  @MinLength(10, { message: 'Mật khẩu mới cần ít nhất 10 ký tự' })
  @MaxLength(200)
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService
  ) {}

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get('COOKIE_SECURE') === 'true',
      sameSite: 'lax',
      path: '/'
    };
  }

  /** Tối đa 5 lần thử mỗi phút cho mỗi IP */
  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, admin } = await this.auth.login(dto.email, dto.password);
    res.cookie(AUTH_COOKIE, token, { ...this.cookieOptions(), maxAge: SESSION_DAYS * 86_400_000 });
    return { admin };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE, this.cookieOptions());
  }

  @Get('me')
  @UseGuards(AdminGuard)
  me(@CurrentAdmin() admin: AdminSession) {
    return { admin: { email: admin.email } };
  }

  @Post('password')
  @HttpCode(204)
  @UseGuards(AdminGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async changePassword(@CurrentAdmin() admin: AdminSession, @Body() dto: ChangePasswordDto) {
    await this.auth.changePassword(admin.sub, dto.currentPassword, dto.newPassword);
  }
}
