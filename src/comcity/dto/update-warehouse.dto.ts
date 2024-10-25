import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class UpdateWarehouseDto {
  @ApiPropertyOptional({
    description: 'The name of the warehouse',
    example: 'Updated Warehouse Name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'The latitude of the warehouse location',
    example: 40.712776,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'The longitude of the warehouse location',
    example: -74.005974,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'The UUID of the comcity associated with the warehouse',
    example: 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d',
  })
  @IsOptional()
  @IsUUID()
  comcityId?: string;
}

