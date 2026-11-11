import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { AdminGuard } from '../auth/auth.guard.js';
import { toJson, toNullableJson } from '../common/json.js';
import { ContentService } from '../content/content.service.js';
import { WebRevalidateService } from '../content/web-revalidate.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { SiteSettingsDto } from '../settings/settings.dto.js';
import {
  CreateFeaturedDto,
  CreateGalleryImageDto,
  CreateMenuItemDto,
  CreateReviewDto,
  ReorderDto,
  UpdateFeaturedDto,
  UpdateGalleryImageDto,
  UpdateMenuItemDto,
  UpdateReviewDto
} from './admin.dto.js';

/*
 * API cho CMS (cần đăng nhập). Mỗi thao tác ghi xong đều báo web làm mới cache.
 * GET trả về cả mục đang ẩn (active = false) để CMS quản lý.
 */

const toDate = (v: string | null | undefined) => (v === undefined ? undefined : v === null ? null : new Date(v));

@Controller('admin/menu')
@UseGuards(AdminGuard)
export class AdminMenuController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web: WebRevalidateService
  ) {}

  @Get()
  list() {
    return this.prisma.menuItem.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }] });
  }

  @Post()
  async create(@Body() dto: CreateMenuItemDto) {
    const item = await this.prisma.menuItem.create({
      data: { ...dto, name: toJson(dto.name), description: toJson(dto.description) }
    });
    this.web.trigger();
    return item;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...dto,
        name: dto.name && toJson(dto.name),
        description: dto.description && toJson(dto.description)
      }
    });
    this.web.trigger();
    return item;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.prisma.menuItem.delete({ where: { id } });
    this.web.trigger();
  }

  @Put('order')
  @HttpCode(204)
  async reorder(@Body() dto: ReorderDto) {
    await this.prisma.$transaction(
      dto.ids.map((id, order) => this.prisma.menuItem.update({ where: { id }, data: { order } }))
    );
    this.web.trigger();
  }
}

@Controller('admin/featured')
@UseGuards(AdminGuard)
export class AdminFeaturedController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web: WebRevalidateService
  ) {}

  @Get()
  list() {
    return this.prisma.featured.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  }

  @Post()
  async create(@Body() dto: CreateFeaturedDto) {
    const item = await this.prisma.featured.create({
      data: {
        ...dto,
        headline: toJson(dto.headline),
        story: toJson(dto.story),
        highlights: toJson(dto.highlights),
        badge: toNullableJson(dto.badge),
        startsAt: toDate(dto.startsAt),
        endsAt: toDate(dto.endsAt)
      }
    });
    this.web.trigger();
    return item;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFeaturedDto) {
    const item = await this.prisma.featured.update({
      where: { id },
      data: {
        ...dto,
        headline: dto.headline && toJson(dto.headline),
        story: dto.story && toJson(dto.story),
        highlights: dto.highlights && toJson(dto.highlights),
        badge: toNullableJson(dto.badge),
        startsAt: toDate(dto.startsAt),
        endsAt: toDate(dto.endsAt)
      }
    });
    this.web.trigger();
    return item;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.prisma.featured.delete({ where: { id } });
    this.web.trigger();
  }
}

@Controller('admin/gallery')
@UseGuards(AdminGuard)
export class AdminGalleryController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web: WebRevalidateService
  ) {}

  @Get()
  list() {
    return this.prisma.galleryImage.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  }

  @Post()
  async create(@Body() dto: CreateGalleryImageDto) {
    const order = dto.order ?? (await this.prisma.galleryImage.count());
    const item = await this.prisma.galleryImage.create({ data: { ...dto, order, alt: toJson(dto.alt) } });
    this.web.trigger();
    return item;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGalleryImageDto) {
    const item = await this.prisma.galleryImage.update({
      where: { id },
      data: { ...dto, alt: dto.alt && toJson(dto.alt) }
    });
    this.web.trigger();
    return item;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.prisma.galleryImage.delete({ where: { id } });
    this.web.trigger();
  }

  @Put('order')
  @HttpCode(204)
  async reorder(@Body() dto: ReorderDto) {
    await this.prisma.$transaction(
      dto.ids.map((id, order) => this.prisma.galleryImage.update({ where: { id }, data: { order } }))
    );
    this.web.trigger();
  }
}

@Controller('admin/reviews')
@UseGuards(AdminGuard)
export class AdminReviewsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web: WebRevalidateService
  ) {}

  @Get()
  list() {
    return this.prisma.review.findMany({ orderBy: { date: 'desc' } });
  }

  @Post()
  async create(@Body() dto: CreateReviewDto) {
    const item = await this.prisma.review.create({
      data: { ...dto, content: toJson(dto.content), date: new Date(dto.date) }
    });
    this.web.trigger();
    return item;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    const item = await this.prisma.review.update({
      where: { id },
      data: {
        ...dto,
        content: dto.content && toJson(dto.content),
        date: dto.date ? new Date(dto.date) : undefined
      }
    });
    this.web.trigger();
    return item;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.prisma.review.delete({ where: { id } });
    this.web.trigger();
  }
}

@Controller('admin/settings')
@UseGuards(AdminGuard)
export class AdminSettingsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly content: ContentService,
    private readonly web: WebRevalidateService
  ) {}

  @Get()
  get() {
    return this.content.getSettings();
  }

  @Put()
  async save(@Body() dto: SiteSettingsDto) {
    const data = toJson(dto);
    await this.prisma.siteSettings.upsert({ where: { id: 1 }, create: { id: 1, data }, update: { data } });
    this.web.trigger();
    return this.content.getSettings();
  }
}
