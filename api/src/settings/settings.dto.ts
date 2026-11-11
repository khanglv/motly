import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsString,
  Matches,
  MaxLength
} from 'class-validator';
import { Nested } from '../common/localized.dto.js';

const HTTPS_URL = /^https:\/\/[^\s"'<>]+$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

class AddressLinesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  vi: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  en: string[];
}

class AddressDto {
  @IsString() @MaxLength(120) street: string;
  @IsString() @MaxLength(120) ward: string;
  @IsString() @MaxLength(120) district: string;
  @IsString() @MaxLength(120) city: string;
  /** Dòng địa chỉ hiển thị theo ngôn ngữ */
  @Nested(AddressLinesDto) lines: AddressLinesDto;
  /** Chuỗi tìm kiếm trên Google Maps (bản đồ nhúng + chỉ đường) */
  @IsString() @MaxLength(240) mapQuery: string;
}

class HoursDto {
  @Matches(TIME, { message: 'Giờ mở cửa dạng HH:mm' }) opens: string;
  @Matches(TIME, { message: 'Giờ đóng cửa dạng HH:mm' }) closes: string;
}

class SocialDto {
  @IsString()
  @Matches(/^$|^https:\/\/[^\s"'<>]+$/, { message: 'Link Facebook phải bắt đầu bằng https:// hoặc để trống' })
  facebook: string;
}

class GrabFoodDto {
  @Matches(/^[\w-]{3,64}$/, { message: 'Mã cửa hàng GrabFood không hợp lệ' }) merchantId: string;
  @Matches(HTTPS_URL, { message: 'Link GrabFood phải bắt đầu bằng https://' }) webUrl: string;
  @IsBoolean() webUrlIsStorePage: boolean;
}

class DeliveryDto {
  @Nested(GrabFoodDto) grabfood: GrabFoodDto;
  /** Để trống thì nút ShopeeFood ẩn */
  @IsString()
  @Matches(/^$|^https:\/\/[^\s"'<>]+$/, { message: 'Link ShopeeFood phải bắt đầu bằng https:// hoặc để trống' })
  shopeefood: string;
}

/** Thông tin quán chỉnh được trong CMS (giống kiểu SiteSettings bên web) */
export class SiteSettingsDto {
  /** Dạng E.164 cho link tel:, ví dụ +84388738680 */
  @Matches(/^\+\d{8,15}$/, { message: 'Số điện thoại dạng +84xxxxxxxxx' }) phone: string;
  /** Số hiển thị, ví dụ 0388 738 680 */
  @IsString() @MaxLength(30) phoneDisplay: string;
  @Nested(AddressDto) address: AddressDto;
  @Nested(HoursDto) hours: HoursDto;
  @Nested(SocialDto) social: SocialDto;
  @Nested(DeliveryDto) delivery: DeliveryDto;
}
