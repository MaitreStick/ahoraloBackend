import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  nameDep: string;
}

class CompanyDto {
  @IsNotEmpty()
  name: string;
}

class ComcityDto {
  @ValidateNested()
  @Type(() => CityDto)
  city: CityDto;

  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}

class ProductDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  code: string;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class CreateProdcomcityDto {
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @ValidateNested()
  @Type(() => ComcityDto)
  comcity: ComcityDto;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  price: number;
}























// import { ApiProperty } from "@nestjs/swagger";
// import { IsDate, IsDateString, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";



// export class CreateProdcomcityDto {

//     @ApiProperty({
//         description: 'The id of the comcity which is associated with the company and city',
//         nullable: false,
//         minLength: 1,
//     })
//     @IsString()
//     @MinLength(1)
//     comcity: string;

//     @ApiProperty({
//         description: 'The id of the product',
//         nullable: false,
//         minLength: 1,
//     })
//     @IsString()
//     @MinLength(1)
//     product: string;

//     @ApiProperty({
//         description: 'The date associated with the event',
//         example: '2024-06-05', 
//         type: String,
//         format: 'date',
//     })
//     @IsDateString()
//     date: Date;

//     @ApiProperty({
//         description: 'The price of the product',
//         nullable: false,
//         type: Number,
//         minimum: 0,
//     })
//     @IsNumber({}, { each: true, message: "Each value in prices must be a number." })
//     @IsPositive({ each: true, message: "Each value in prices must be positive." })
//     @IsOptional()
//     price?: number;
// }
