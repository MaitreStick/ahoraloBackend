import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCompanyDto {

    @ApiProperty({
        description: 'The name of the company (unique)',
        example: 'Carulla',
        nullable: false,
        minLength: 1,
      })
    @IsString()
    @MinLength(1)
    name: string;
}
