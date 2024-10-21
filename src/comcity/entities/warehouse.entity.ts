import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Comcity } from '../../comcity/entities/comcity.entity';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @ManyToOne(() => Comcity, (comcity) => comcity.warehouses)
  comcity: Comcity;
}
