import { Prisma } from '../../generated/prisma/client.js';

/** Đổi DTO (class instance) thành giá trị JSON thuần để lưu vào cột Json */
export const toJson = (value: unknown): Prisma.InputJsonValue =>
  JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;

/** Cột Json cho phép null: undefined = không đổi, null = xoá */
export const toNullableJson = (value: unknown) =>
  value === undefined ? undefined : value === null ? Prisma.DbNull : toJson(value);
