import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";



export class CreateProdcomcityOcrDto {

    @ApiProperty({
        description: 'The UUID of the comcity associated with the company and city',
        example: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    comcity: string;

    @ApiProperty({
        description: 'The UUID of the product',
        example: '2c965650-51c7-42e8-9642-a25ac46c0a4e',
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
        example: 10000,
        nullable: false,
        type: Number,
        minimum: 0,
    })
    @IsNumber({}, { each: true, message: "Each value in prices must be a number." })
    @IsPositive({ each: true, message: "Each value in prices must be positive." })
    @IsOptional()
    price?: number;
}