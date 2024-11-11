import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Manzana Verde',
        description: 'Product title',
        uniqueItems: true,
    })
    @Column('text')
    title: string;

    @ApiProperty({
        example: 'manzana_verde',
        description: 'Product SLUG - for SEO',
        uniqueItems: true,
    })
    @Column('text')
    slug: string;

    @ApiProperty({
        example: '["manzana","verde"]',
        description: 'Keywords for the product',
    })
    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[];

    @ApiProperty({
        example: 372437,
        description: 'Code of the product in this Comcity entry',
    })
    @Column('float', {
        default: 0,
    })
    code: number;

    @ApiProperty({
        example: '["1760176-00-A_0_2000.jpg", "1760176-00-A_1.jpg"]',
        description: 'Product images',
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ApiProperty({
        description: 'User associated with this product',
        type: () => User,
    })
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User


    @BeforeInsert()
    @BeforeUpdate()
    normalizeData() {
        // Generar slug si no existe
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '_')
            .replace(/'/g, '');

        // Solo generar tags si no están definidos
        if (!this.tags || this.tags.length === 0) {
            this.tags = this.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, '')
                .split(' ')
                .map(tag => tag.replace(/[^a-z0-9]/g, ''))
                .filter(tag => tag.length > 0);
        }
    }

}