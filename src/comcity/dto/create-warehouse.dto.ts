import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'The name of the warehouse',
    example: 'Main Warehouse',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The latitude of the warehouse location',
    example: 40.712776,
    nullable: false,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the warehouse location',
    example: -74.005974,
    nullable: false,
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'The UUID of the comcity associated with the warehouse',
    example: 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  comcityId: string;
}
