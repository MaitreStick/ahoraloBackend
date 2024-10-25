import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";



export class CreateComcityDto {

    @ApiProperty({
        description: 'The ID of the city',
        example: 'bb3d7cbac2174dd30fe5e787131d951799abdd84',
        nullable: false,
        minLength: 1,
      })
    @IsString()
    @MinLength(1)
    city: string;

    @ApiProperty({
        description: 'The ID of the company',
        example: 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    company: string;

}
