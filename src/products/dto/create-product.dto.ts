import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {
    @ApiProperty({
        description: 'The title of the product (unique)',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'The slug of the product',
        nullable: false,
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'The tags of the product',
        type: [String],
        nullable: false,
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        description: 'The images of the product',
        type: [String],
        nullable: false,
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiProperty({
        description: 'The price of the product',
        nullable: false,
        type: Number,
        minimum: 0,
    })
    @IsNumber({}, { each: true, message: "Each value in codes must be a number." })
    @IsPositive({ each: true, message: "Each value in codes must be positive." })
    @IsOptional()
    code: number;

}
