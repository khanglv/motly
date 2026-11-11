import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';

/** Chuỗi có bản dịch: { vi, en } */
export class LocalizedTextDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  vi: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  en: string;
}

/** Chuỗi ngắn có bản dịch (tên, tiêu đề) */
export class LocalizedShortDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  vi: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  en: string;
}

/** Danh sách chuỗi có bản dịch: { vi: string[], en: string[] } */
export class LocalizedListDto {
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  vi: string[];

  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  en: string[];
}

/** Dùng cho trường lồng: @ValidateNested + @Type */
export const Nested = (cls: new () => object) =>
  applyDecorators(ValidateNested(), Type(() => cls));
