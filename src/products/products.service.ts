import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ) { }

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], title, ...productDetails } = createProductDto;

      const generatedTags = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '') 
        .split(' ')
        .map(tag => tag.replace(/[^a-z0-9]/g, ''))
        .filter(tag => tag.length > 0);

      // const slug = title
      //   .toLowerCase()
      //   .replace(/\s+/g, '_')
      //   .replace(/'/g, '');

      const product = this.productRepository.create({
        ...productDetails,
        title,
        // slug,
        tags: generatedTags,
        images: images.map((image) => ({ url: image })),
        user,
      });

      await this.productRepository.save(product);

      return { ...product, images: product.images.map((img) => img.url) };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = PaginationDto;

    const products = await this.productRepository.find({
      skip: offset,
      take: limit,
      relations: {
        images: true,
      }
    })

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
  }

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }


    if (!product)
      throw new NotFoundException(`Product with ${term} not found`);

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    };
  }

  async findProductsByCode(code: string) {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      const product = await queryBuilder
        .where('prod.code = :code', { code })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

      if (!product) {
        throw new NotFoundException(`Product with code ${code} not found`);
      }

      return {
        ...product,
        images: product.images.map(img => img.url)
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate })

    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      }

      product.user = user;

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBException(error);
    }
  }

  async remove(id: string) {

    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, please check the logs');

  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findProductsByTag(term: string) {
    try {
      const terms = term.toLowerCase().split(' ');

      const query = this.productRepository
        .createQueryBuilder('prod')
        .leftJoinAndSelect('prod.images', 'prodImages');

      terms.forEach(t => {
        query.orWhere(':term = ANY(ARRAY(SELECT LOWER(unnest(prod.tags)) FROM products WHERE prod.id = products.id))', { term: t });
        query.orWhere('LOWER(prod.title) LIKE :titleTerm', { titleTerm: `%${t}%` });
      });

      const products = await query.getMany();

      return products.map(product => ({
        ...product,
        images: product.images.map(img => img.url)
      }));
    } catch (error) {
      this.handleDBException(error);
    }
  }
}
