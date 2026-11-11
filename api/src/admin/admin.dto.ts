import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf
} from 'class-validator';
import { FeaturedTheme, MenuCategory, ReviewSource } from '../../generated/prisma/enums.js';
import { IsImageUrl } from '../common/image-url.js';
import { LocalizedListDto, LocalizedShortDto, LocalizedTextDto, Nested } from '../common/localized.dto.js';

export const MENU_TAGS = ['signature', 'best-seller', 'new'] as const;

/* ---------- Menu ---------- */

export class CreateMenuItemDto {
  /** Mã món dạng slug (a-z, 0-9, dấu gạch), dùng làm id và để liên kết món nổi bật */
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: 'Mã món chỉ gồm chữ thường, số và dấu gạch ngang' })
  @MaxLength(60)
  id: string;

  @IsEnum(MenuCategory) category: MenuCategory;
  @Nested(LocalizedShortDto) name: LocalizedShortDto;
  @Nested(LocalizedTextDto) description: LocalizedTextDto;

  @IsInt() @Min(0) @Max(10_000_000) price: number;
  @IsImageUrl() image: string;

  @IsArray()
  @ArrayMaxSize(3)
  @IsIn(MENU_TAGS, { each: true })
  tags: string[];

  @IsOptional() @IsInt() @Min(0) @Max(9999) order?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

/** Không đổi được id sau khi tạo (món nổi bật trỏ tới id) */
export class UpdateMenuItemDto extends PartialType(OmitType(CreateMenuItemDto, ['id'] as const)) {}

/* ---------- Món nổi bật ---------- */

const emptyToNull = ({ value }: { value: unknown }) => (value === '' ? null : value);

export class CreateFeaturedDto {
  @IsString() @MaxLength(60) menuItemId: string;
  @Nested(LocalizedShortDto) headline: LocalizedShortDto;
  @Nested(LocalizedTextDto) story: LocalizedTextDto;
  @Nested(LocalizedListDto) highlights: LocalizedListDto;

  @IsOptional() @ValidateIf((_, v) => v !== null) @Nested(LocalizedShortDto) badge?: LocalizedShortDto | null;

  @IsOptional() @Transform(emptyToNull) @ValidateIf((_, v) => v !== null) @IsImageUrl() image?: string | null;

  @IsEnum(FeaturedTheme) theme: FeaturedTheme;
  @IsOptional() @IsInt() @Min(0) @Max(9999) order?: number;
  @IsOptional() @IsBoolean() active?: boolean;

  @IsOptional() @Transform(emptyToNull) @ValidateIf((_, v) => v !== null) @IsDateString() startsAt?: string | null;
  @IsOptional() @Transform(emptyToNull) @ValidateIf((_, v) => v !== null) @IsDateString() endsAt?: string | null;
}

export class UpdateFeaturedDto extends PartialType(CreateFeaturedDto) {}

/* ---------- Hình ảnh ---------- */

export class CreateGalleryImageDto {
  @IsImageUrl() src: string;
  @Nested(LocalizedShortDto) alt: LocalizedShortDto;
  @IsInt() @Min(1) @Max(10_000) width: number;
  @IsInt() @Min(1) @Max(10_000) height: number;
  @IsOptional() @IsInt() @Min(0) @Max(9999) order?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdateGalleryImageDto extends PartialType(CreateGalleryImageDto) {}

/* ---------- Đánh giá ---------- */

export class CreateReviewDto {
  @IsString() @MaxLength(80) author: string;
  @IsInt() @Min(1) @Max(5) rating: number;
  @Nested(LocalizedTextDto) content: LocalizedTextDto;
  /** YYYY-MM-DD */
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Ngày dạng YYYY-MM-DD' }) date: string;
  @IsEnum(ReviewSource) source: ReviewSource;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

/** Đổi thứ tự hàng loạt: danh sách id theo thứ tự mới */
export class ReorderDto {
  @IsArray()
  @ArrayMaxSize(500)
  @IsString({ each: true })
  ids: string[];
}
