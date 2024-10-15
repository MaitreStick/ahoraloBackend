import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Comcity } from "src/comcity/entities/comcity.entity";


@Entity({ name: 'prodcomcity'})
export class Prodcomcity {

    @ApiProperty({
        example: '2f4e2f63-4d73-423a-b8da-3aaf8efb4a34',
        description: 'Prodcomcity ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'e02022ee-0c19-4438-8f0a-c20fc519c8a0',
        description: 'Comcity entity associated with this Prodcomcity entry',
        type: () => Comcity,
    })
    @ManyToOne(() => Comcity)
    @JoinColumn()
    comcity: Comcity;

    @ApiProperty({
        example: 'e151cbe2-5f7a-4088-9a2d-b2f3719e563b',
        description: 'Product entity associated with this Prodcomcity entry',
        type: () => Product,
    })
    @ManyToOne(() => Product)
    @JoinColumn()
    product?: Product;

    @ApiProperty({
        example: 1000,
        description: 'Price of the product in this Comcity entry',
    })
    @Column('float', {
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: '2024-05-06T08:30:00.000Z',
        description: 'Date associated with this Prodcomcity entry',
        type: 'Date',
        format: 'date-time',
    })
    @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(
        () => User,
        ( user ) => user.prodComCity,
        { eager: true }
    )
    user: User

}
