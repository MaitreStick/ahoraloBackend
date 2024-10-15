import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";



export class CreateProdcomcityOcrDto {

    @ApiProperty({
        description: 'The id of the comcity which is associated with the company and city',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    comcity: string;

    @ApiProperty({
        description: 'The id of the product',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    product: string;

    @ApiProperty({
        description: 'The date associated with the event',
        example: '2024-06-05', 
        type: String,
        format: 'date',
    })
    @IsDateString()
    date: Date;

    @ApiProperty({
        description: 'The price of the product',
        nullable: false,
        type: Number,
        minimum: 0,
    })
    @IsNumber({}, { each: true, message: "Each value in prices must be a number." })
    @IsPositive({ each: true, message: "Each value in prices must be positive." })
    @IsOptional()
    price?: number;
}