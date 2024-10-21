import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsUUID()
  comcityId?: string;
}

