import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';


@Entity({ name: 'product_images' })
export class ProductImage {

    @ApiProperty({
        example: 1,
        description: 'ID of the product image',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'https://example.com/image1.jpg',
        description: 'URL of the product image',
    })
    @Column()
    url: string;

    @ApiProperty({
        description: 'Product associated with this image',
        type: () => Product,
    })
    @ManyToOne(() => Product, (product) => product.images,
        { onDelete: 'CASCADE' })
    product: Product;

}