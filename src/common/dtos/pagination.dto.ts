import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString, Min } from "class-validator";


export class PaginationDto {
    @ApiProperty({
        default: 10,
        description: 'Number of items per page',
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number )
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'Number of items to skip',
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number;

    @ApiProperty({
        description: 'Search query for filtering cities',
        required: false,
    })
    @IsOptional()
    @IsString()
    search?: string;

}