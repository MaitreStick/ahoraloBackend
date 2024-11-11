import { IsArray, isNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CityDto {

  @ApiProperty({
    description: 'The name of the city',
    example: 'Bogotá',
  })
  @IsNotEmpty()
  name: string;


  @ApiProperty({
    description: 'The name of the department',
    example: 'Cundinamarca',
  })
  @IsNotEmpty()
  nameDep: string;
}

class CompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'Tech Solutions',
  })
  @IsNotEmpty()
  name: string;
}

class ComcityDto {
  @ApiProperty({
    description: 'City information',
    type: CityDto,
  })
  @ValidateNested()
  @Type(() => CityDto)
  city: CityDto;

  @ApiProperty({
    description: 'Company information',
    type: CompanyDto,
  })
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}

class ProductDto {
  @ApiProperty({
    description: 'The title of the product',
    example: 'Limpiapisos Fabuloso',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The code of the product',
    example: '56729648',
  })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: '["manzana","verde"]',
    description: 'Keywords for the product',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'Array of image URLs',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class CreateProdcomcityDto {
  @ApiProperty({
    description: 'Product information',
    type: ProductDto,
  })
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @ApiProperty({
    description: 'Comcity information',
    type: ComcityDto,
  })
  @ValidateNested()
  @Type(() => ComcityDto)
  comcity: ComcityDto;

  @ApiProperty({
    description: 'The date of the event',
    example: '2024-06-05',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'The price of the product',
    example: 10000,
  })
  @IsNotEmpty()
  price: number;
}