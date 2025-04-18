import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCityDto } from 'src/cities/dto/create-city.dto';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';

export class ProductUpdateDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
  })
  @IsString()
  @MinLength(1)
  id: string;

  @ApiProperty({
    description: 'The title of the product',
    example: 'Jabón Rey',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'The code of the product',
    example: 71296482,
  })
  @IsNumber()
  @IsPositive()
  code: number;

  @ApiProperty({
    example: '["manzana","verde"]',
    description: 'Keywords for the product',
  })
  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'Array of image URLs',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}

class UpdateComcityDto {
  @ValidateNested()
  @Type(() => CreateCityDto)
  city: CreateCityDto;

  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;
}

export class UpdateProdcomcityDto {
  @ApiProperty({
    description: 'The UUID of the comcity associated with the company and city',
    example: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
  })
  @IsString()
  @MinLength(1)
  @ValidateNested()
  @Type(() => UpdateComcityDto)
  comcity: UpdateComcityDto;

  @ApiProperty({
    description: 'Product update information',
    type: ProductUpdateDto,
  })
  @ValidateNested()
  @Type(() => ProductUpdateDto)
  product: ProductUpdateDto;

  @ApiProperty({
    description: 'The date of the event',
    example: '2024-06-05',
    type: String,
    format: 'date',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    description: 'The price of the product',
    example: 15000,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
}
