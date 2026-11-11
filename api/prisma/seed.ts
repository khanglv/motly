/**
 * Tạo dữ liệu ban đầu từ prisma/seed-data/*.json và tài khoản admin.
 * Chạy (trong thư mục api): pnpm db:seed
 *
 * - Nội dung chỉ được thêm khi bảng còn trống (chạy lại không ghi đè dữ liệu đã sửa trong CMS).
 * - Tài khoản admin luôn được tạo/cập nhật theo ADMIN_EMAIL / ADMIN_PASSWORD.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '../generated/prisma/client.js';
import type {
  FeaturedTheme,
  MenuCategory,
  ReviewSource
} from '../generated/prisma/enums.js';
import { DEFAULT_SETTINGS } from '../src/settings/settings.defaults.js';

type Localized<T = string> = { vi: T; en: T };

/** Dữ liệu mẫu ban đầu (prisma/seed-data/*.json), độc lập với code của web */
const load = <T>(name: string): T =>
  JSON.parse(readFileSync(new URL(`./seed-data/${name}.json`, import.meta.url), 'utf8')) as T;

const menuItems = load<
  { id: string; category: MenuCategory; name: Localized; description: Localized; price: number; image: string; tags: string[] }[]
>('menu');
const featuredRecords = load<
  {
    id: string;
    menuItemId: string;
    headline: Localized;
    story: Localized;
    highlights: Localized<string[]>;
    badge?: Localized;
    image?: string;
    theme: FeaturedTheme;
    order: number;
    active: boolean;
    startsAt?: string;
    endsAt?: string;
  }[]
>('featured');
const galleryImages = load<{ id: string; src: string; alt: Localized; width: number; height: number }[]>('gallery');
const reviews = load<
  { id: string; author: string; rating: number; content: Localized; date: string; source: ReviewSource }[]
>('reviews');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! })
});

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('Bỏ qua tạo admin: thiếu ADMIN_EMAIL hoặc ADMIN_PASSWORD');
    return;
  }
  if (password.length < 10) throw new Error('ADMIN_PASSWORD cần ít nhất 10 ký tự');

  const passwordHash = await bcrypt.hash(password, 12);
  // Chỉ giữ 1 tài khoản admin: xoá các tài khoản khác email
  await prisma.admin.deleteMany({ where: { email: { not: email } } });
  await prisma.admin.upsert({ where: { email }, create: { email, passwordHash }, update: { passwordHash } });
  console.log(`Admin: ${email}`);
}

async function seedContent() {
  if ((await prisma.menuItem.count()) === 0) {
    await prisma.menuItem.createMany({
      data: menuItems.map((m, order) => ({ ...m, order, tags: [...m.tags] }))
    });
    console.log(`Menu: ${menuItems.length} món`);
  }

  if ((await prisma.featured.count()) === 0) {
    await prisma.featured.createMany({
      data: featuredRecords.map((f) => ({
        ...f,
        startsAt: f.startsAt ? new Date(f.startsAt) : null,
        endsAt: f.endsAt ? new Date(f.endsAt) : null
      }))
    });
    console.log(`Nổi bật: ${featuredRecords.length} mục`);
  }

  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({ data: galleryImages.map((g, order) => ({ ...g, order })) });
    console.log(`Hình ảnh: ${galleryImages.length} ảnh`);
  }

  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({ data: reviews.map((r) => ({ ...r, date: new Date(r.date) })) });
    console.log(`Đánh giá: ${reviews.length}`);
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, data: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) },
    update: {}
  });
}

try {
  await seedAdmin();
  await seedContent();
} finally {
  await prisma.$disconnect();
}
