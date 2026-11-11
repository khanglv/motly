import { Injectable } from '@nestjs/common';
import type { Featured, GalleryImage, MenuItem, Review } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { DEFAULT_SETTINGS } from '../settings/settings.defaults.js';
import type { SiteSettingsDto } from '../settings/settings.dto.js';

/*
 * Chuyển dòng DB sang đúng dạng "Record" mà web dùng (src/types/index.ts bên web):
 * trường dịch giữ dạng { vi, en }, ngày dạng chuỗi ISO, bỏ các trường chỉ dùng trong CMS.
 */

const toMenuRecord = (m: MenuItem) => ({
  id: m.id,
  category: m.category,
  name: m.name,
  description: m.description,
  price: m.price,
  image: m.image,
  tags: m.tags
});

const toFeaturedRecord = (f: Featured) => ({
  id: f.id,
  menuItemId: f.menuItemId,
  headline: f.headline,
  story: f.story,
  highlights: f.highlights,
  ...(f.badge ? { badge: f.badge } : {}),
  ...(f.image ? { image: f.image } : {}),
  theme: f.theme,
  order: f.order,
  active: f.active,
  ...(f.startsAt ? { startsAt: f.startsAt.toISOString() } : {}),
  ...(f.endsAt ? { endsAt: f.endsAt.toISOString() } : {})
});

const toGalleryRecord = (g: GalleryImage) => ({
  id: g.id,
  src: g.src,
  alt: g.alt,
  width: g.width,
  height: g.height
});

const toReviewRecord = (r: Review) => ({
  id: r.id,
  author: r.author,
  rating: r.rating,
  content: r.content,
  date: r.date.toISOString().slice(0, 10),
  source: r.source
});

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<SiteSettingsDto> {
    const row = await this.prisma.siteSettings.findUnique({ where: { id: 1 } });
    return row ? { ...DEFAULT_SETTINGS, ...(row.data as object) } : DEFAULT_SETTINGS;
  }

  /** Toàn bộ nội dung đang hiển thị, một lần gọi (web cache theo tag "content") */
  async getPublicContent() {
    const [menu, featured, gallery, reviews, settings] = await Promise.all([
      this.prisma.menuItem.findMany({ where: { active: true }, orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
      // Lọc theo thời gian chạy ở web (để hết hạn đúng giờ dù cache)
      this.prisma.featured.findMany({
        where: { active: true, menuItem: { active: true } },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
      }),
      this.prisma.galleryImage.findMany({ where: { active: true }, orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
      this.prisma.review.findMany({ where: { active: true }, orderBy: { date: 'desc' } }),
      this.getSettings()
    ]);

    return {
      menuItems: menu.map(toMenuRecord),
      featuredRecords: featured.map(toFeaturedRecord),
      galleryImages: gallery.map(toGalleryRecord),
      reviews: reviews.map(toReviewRecord),
      settings,
      updatedAt: new Date().toISOString()
    };
  }
}
