import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../../generated/prisma/client.js';

/** Đổi lỗi Prisma thường gặp sang mã HTTP dễ hiểu cho CMS */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const map: Record<string, [number, string]> = {
      P2025: [HttpStatus.NOT_FOUND, 'Không tìm thấy dữ liệu'],
      P2002: [HttpStatus.CONFLICT, 'Mã này đã tồn tại'],
      P2003: [HttpStatus.BAD_REQUEST, 'Món được liên kết không tồn tại']
    };
    const [status, message] = map[error.code] ?? [HttpStatus.INTERNAL_SERVER_ERROR, 'Lỗi cơ sở dữ liệu'];
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) this.logger.error(error.message);
    res.status(status).json({ statusCode: status, message });
  }
}
