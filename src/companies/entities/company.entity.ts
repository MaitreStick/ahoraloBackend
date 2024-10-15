import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'companies'})
export class Company {

    @ApiProperty({

        example: '2f4e2f63-4d73-423a-b8da-3aaf8efb4a34',
        description: 'company ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ApiProperty({
        example: 'Exito',
        description: 'company name',
        uniqueItems: true,
    })
    @Column('text', { 
        unique: true,
     })
    name: string;
}
