import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';
import { Prodcomcity } from 'src/prodcomcity/entities/prodcomcity.entity';
import { Comcity } from 'src/comcity/entities/comcity.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { 
        unique: true 
    })
    email: string;

    @Column('text', {
        select: false
    }
    )
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', { 
        default: true 
    })
    isActive: boolean;

    @Column('text', { 
        array: true,
        default: ['user'] 
    })
    roles: string[];

    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;

    @OneToMany(
        () => Prodcomcity,
        ( prodComCity ) => prodComCity.user
    )
    prodComCity: Prodcomcity;
    
    @OneToMany(
        () => Comcity,
        ( comCity ) => comCity.user
    )
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
