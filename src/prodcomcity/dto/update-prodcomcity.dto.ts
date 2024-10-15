import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductUpdateDto {
  @IsString()
  @MinLength(1)
  id: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  code: number;

  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateProdcomcityDto {
  @IsString()
  @MinLength(1)
  comcity: string;

  @ValidateNested()
  @Type(() => ProductUpdateDto)
  product: ProductUpdateDto;

  @IsDateString()
  date: Date;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
}
