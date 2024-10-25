import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Comcity } from '../../comcity/entities/comcity.entity';

@Entity()
export class Warehouse {

  @ApiProperty({
    description: 'Warehouse ID',
    example: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the warehouse',
    example: 'Central Warehouse',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The latitude of the warehouse location',
    example: 40.712776,
  })
  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the warehouse location',
    example: -74.005974,
  })
  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @ApiProperty({
    description: 'The comcity associated with the warehouse',
    type: () => Comcity,
  })
  @ManyToOne(() => Comcity, (comcity) => comcity.warehouses)
  comcity: Comcity;
}
