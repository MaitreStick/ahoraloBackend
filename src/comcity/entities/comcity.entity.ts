import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from '../../cities/entities/city.entity';
import { Company } from '../../companies/entities/company.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Warehouse } from './warehouse.entity';


@Entity({ name: 'comcity' })
export class Comcity {

    @ApiProperty({
        example: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
        description: 'comCity ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: '1b965650-51c7-42e8-9643-a25ac46c0a4f',
        description: 'city ID',
        uniqueItems: true,
    })
    @ManyToOne(() => City)
    @JoinColumn()
    city: City;

    @ApiProperty({
        example: '1b965123-51c7-42e9-9643-a25ac46c0a3d',
        description: 'company ID',
        uniqueItems: true,
    })
    @ManyToOne(() => Company)
    @JoinColumn()
    company: Company;

    @ManyToOne(
        () => User,
        (user) => user.comCity,
        { eager: true }
    )
    user: User

    @OneToMany(() => Warehouse, (warehouse) => warehouse.comcity)
    warehouses: Warehouse[];

}