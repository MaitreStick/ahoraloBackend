import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";



export class CreateComcityDto {

    @ApiProperty({
        description: 'The id of the city',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    city: string;

    @ApiProperty({
        description: 'The id of the company',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    company: string;

}
