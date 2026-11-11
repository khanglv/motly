import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';

export interface AdminSession {
  sub: string;
  email: string;
}

/** Hash giả dùng khi email không tồn tại, để thời gian phản hồi giống nhau (tránh dò email) */
const DUMMY_HASH = bcrypt.hashSync('no-such-admin-placeholder', 12);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async login(email: string, password: string): Promise<{ token: string; admin: { email: string } }> {
    const admin = await this.prisma.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
    const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
    if (!admin || !ok) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const payload: AdminSession = { sub: admin.id, email: admin.email };
    return { token: await this.jwt.signAsync(payload), admin: { email: admin.email } };
  }

  async verify(token: string): Promise<AdminSession> {
    try {
      const session = await this.jwt.verifyAsync<AdminSession>(token);
      // Tài khoản đã bị xoá thì phiên cũ không còn hiệu lực
      const exists = await this.prisma.admin.count({ where: { id: session.sub } });
      if (!exists) throw new Error('admin not found');
      return session;
    } catch {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn');
    }
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin || !(await bcrypt.compare(currentPassword, admin.passwordHash))) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash: await bcrypt.hash(newPassword, 12) }
    });
  }
}
