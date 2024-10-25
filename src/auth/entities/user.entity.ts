import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';
import { Prodcomcity } from 'src/prodcomcity/entities/prodcomcity.entity';
import { Comcity } from 'src/comcity/entities/comcity.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'Unique identifier of the user',
        type: 'string',
        format: 'uuid',
        example: 'bb3d7cbac2174dd30fe5e787131d951799abdd84',
    })
    id: string;

    @Column('text', {
        unique: true
    })
    @ApiProperty({
        description: 'The email of the user (unique)',
        type: 'string',
        example: 'janedoe@gmail.com',
    })
    email: string;

    @Column('text', {
        select: false
    })
    @ApiProperty({
        description: 'The password of the user',
        type: 'string',
        example: 'Jane123',
    })
    password: string;

    @Column('text')
    @ApiProperty({
        description: 'The full name of the user',
        type: 'string',
        example: 'Jane Doe',
    })
    fullName: string;

    @Column('bool', {
        default: true
    })
    @ApiProperty({
        description: 'Indicates whether the user is active',
        type: 'boolean',
        example: true,
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    @ApiProperty({
        description: 'Roles assigned to the user',
        type: 'array',
        items: { type: 'string' },
        example: ['user'],
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    @ApiProperty({
        description: 'Products associated with the user',
        type: () => Product,
        isArray: true,
    })
    product: Product;

    @OneToMany(
        () => Prodcomcity,
        (prodComCity) => prodComCity.user
    )
    @ApiProperty({
        description: 'Prodcomcity records associated with the user',
        type: () => Prodcomcity,
        isArray: true,
    })
    prodComCity: Prodcomcity;

    @OneToMany(
        () => Comcity,
        (comCity) => comCity.user
    )
    @ApiProperty({
        description: 'Comcity records associated with the user',
        type: () => Comcity,
        isArray: true,
    })
    comCity: Comcity;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
