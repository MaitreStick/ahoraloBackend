import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";



@Entity({ name: 'cities'})
export class City {

    @ApiProperty({
        example: '2f4e2f63-4d73-423a-b8da-3aaf8efb4a34',
        description: 'city ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Bogota',
        description: 'city name'
    })
    @Column('text')
    name: string;

    @ApiProperty({
        example: 'Huila',
        description: 'department name',
    })
    @Column('text')
    nameDep: string;
}

