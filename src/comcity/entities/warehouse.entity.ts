import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comcity } from './comcity.entity';

@Entity({ name: 'warehouse' })
export class Warehouse {
  @ApiProperty({ example: '1b965650-51c7-42e8-9642-a25ac46c0a4e' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Central Warehouse' })
  @Column()
  name: string;

  @ApiProperty({ example: 40.712776 })
  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @ApiProperty({ example: -74.005974 })
  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  /* ────── NUEVO: columna FK explícita ────── */
  @ApiProperty({
    description: 'FK → comcity.id',
    example: 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d',
  })
  @Column('uuid')
  comcityId: string;

  @ManyToOne(() => Comcity, (c) => c.warehouses, { eager: false })
  @JoinColumn({ name: 'comcityId' })          // enlaza la FK
  comcity: Comcity;
}