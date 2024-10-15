import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";



export class CreateCityDto {

    @ApiProperty({
        description: 'The name of the city (unique)',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    name: string; 
    
    @ApiProperty({
        description: 'The name of the department (unique)',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    nameDep: string; 


}
