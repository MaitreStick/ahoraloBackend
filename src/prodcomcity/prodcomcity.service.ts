import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProdcomcityDto } from './dto/create-prodcomcity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, EntityManager, In, Repository } from 'typeorm';
import { Prodcomcity } from './entities/prodcomcity.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ProductsService } from 'src/products/products.service';
import { ComcityService } from 'src/comcity/comcity.service';
import { isUUID } from 'class-validator';
import { Comcity } from 'src/comcity/entities/comcity.entity';
import { Product } from 'src/products/entities/product.entity';
import { UpdateProdcomcityDto } from './dto/update-prodcomcity.dto';
import { ProductImage } from 'src/products/entities';
import { City } from 'src/cities/entities/city.entity';
import { Company } from 'src/companies/entities/company.entity';
import { CreateProdcomcityOcrDto } from './dto/create-prodcomcity-ocr.dto';

@Injectable()
export class ProdcomcityService {

  private readonly logger = new Logger('ProdcomcityService');

  constructor(

    @InjectRepository(Prodcomcity)
    private readonly prodcomcityRepository: Repository<Prodcomcity>,
    @InjectRepository(Comcity)
    private readonly comcityRepository: Repository<Comcity>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly productService: ProductsService,
    private readonly comcityService: ComcityService,
    private readonly dataSource: DataSource,

  ) { }


  async createSeed(createProdcomcityOcrDto: CreateProdcomcityOcrDto, user: User) {
    try {
      const { product, comcity, ...prodcomcityDetails } = createProdcomcityOcrDto;

      const productEntity = await this.productService.findOne(product);
      const comcityEntity = await this.comcityService.findOne(comcity);
      if (!productEntity) {
        throw new BadRequestException('Product not found');
      } else if (!comcityEntity) {
        throw new BadRequestException('Comcity not found');
      }

      const prodcomcity = this.prodcomcityRepository.create({
        ...prodcomcityDetails,
        product: productEntity,
        comcity: comcityEntity,
        user
      });

      await this.prodcomcityRepository.save(prodcomcity);
      return prodcomcity;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async create(createProdcomcityDto: CreateProdcomcityDto, user: User): Promise<Prodcomcity> {
    try {
      const { product: productDto, comcity: comcityDto, date, price } = createProdcomcityDto;

      // Handle Company
      let company = await this.companyRepository.findOne({ where: { name: comcityDto.company.name } });
      if (!company) {
        company = this.companyRepository.create({ name: comcityDto.company.name });
        await this.companyRepository.save(company);
      }

      // Handle City
      let city = await this.cityRepository.findOne({
        where: { name: comcityDto.city.name, nameDep: comcityDto.city.nameDep },
      });
      if (!city) {
        city = this.cityRepository.create({ name: comcityDto.city.name, nameDep: comcityDto.city.nameDep });
        await this.cityRepository.save(city);
      }

      // Handle Comcity
      let comcity = await this.comcityRepository.findOne({
        where: { company: { id: company.id }, city: { id: city.id } },
        relations: ['company', 'city'],
      });
      if (!comcity) {
        comcity = this.comcityRepository.create({ company, city });
        await this.comcityRepository.save(comcity);
      }

      const codeNumber = Number(productDto.code);
      if (isNaN(codeNumber)) {
        throw new BadRequestException('Invalid code value');
      }

      // Handle Product
      let product = await this.productRepository.findOne({ where: { code: codeNumber } });
      if (!product) {
        product = this.productRepository.create({
          title: productDto.title,
          code: codeNumber,
          user,
          images: productDto.images?.map((imageUrl) => ({ url: imageUrl })),
        });
        await this.productRepository.save(product);
      }

      // Create Prodcomcity
      const prodcomcity = this.prodcomcityRepository.create({
        product,
        comcity,
        date: date ?? new Date(),
        price,
        user,
      });

      await this.prodcomcityRepository.save(prodcomcity);

      return prodcomcity;
    } catch (error) {
      this.handleDBException(error);
      throw new InternalServerErrorException('An error occurred while creating Prodcomcity');
    }
  }



  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;

    const prodcomcities = await this.prodcomcityRepository.find({
      skip: offset,
      take: limit,
      relations: ['product', 'comcity', 'user', 'comcity.city', 'comcity.company'],
    });

    return prodcomcities;
  }

  async findOne(term: string) {
    let ProdComcity: Prodcomcity;
    if (isUUID(term)) {
      ProdComcity = await this.prodcomcityRepository.findOne({
        where: { id: term },
        relations: ['product', 'comcity', 'user', 'comcity.city', 'comcity.company']
      });
    }
    if (!ProdComcity)
      throw new NotFoundException(`ProdComcity with ${term} not found`);

    return ProdComcity;
  }

  async findOnePlain(term: string) {
    const ProdComcity = await this.findOne(term);
    return ProdComcity;
  }

  async findOneById(id: string) {
    const prodcomcity = await this.prodcomcityRepository.findOneBy({ id });
    if (!prodcomcity)
      throw new NotFoundException(`ProdComcity with ID '${id}' not found`);
    return prodcomcity;
  }

  async findProdcomcityByComcityAndProduct(comcityId: string, productId: string): Promise<Prodcomcity | null> {
    return await this.prodcomcityRepository.findOne({
      where: {
        comcity: { id: comcityId },
        product: { id: productId }
      },
      relations: ['product', 'comcity', 'user', 'comcity.city', 'comcity.company']
    });
  }

  private async executeInTransaction<T>(userId: string, operation: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`SELECT set_config('app.current_user_id', $1, true)`, [userId]);

      const result = await operation(queryRunner.manager);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBException(error);
      throw error; // Es importante volver a lanzar el error
    } finally {
      await queryRunner.release();
    }
  }

  async updateProdcomcityOcr(id: string, updateProdcomcityOcrDto: CreateProdcomcityOcrDto): Promise<Prodcomcity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let prodcomcity = await queryRunner.manager.findOne(Prodcomcity, { where: { id }, relations: ['comcity', 'product'] });

      if (!prodcomcity) throw new NotFoundException(`Prodcomcity with id ${id} not found`);

      const comcity = await this.comcityRepository.findOne({ where: { id: updateProdcomcityOcrDto.comcity } });
      const product = await this.productRepository.findOne({ where: { id: updateProdcomcityOcrDto.product } });

      if (!comcity || !product) {
        throw new NotFoundException('Comcity or Product not found');
      }

      prodcomcity.comcity = comcity;
      prodcomcity.product = product;
      prodcomcity.date = updateProdcomcityOcrDto.date;
      if (updateProdcomcityOcrDto.price !== undefined) {
        prodcomcity.price = updateProdcomcityOcrDto.price;
      }

      await queryRunner.manager.save(prodcomcity);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return prodcomcity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }




  async remove(id: string) {
    const prodcomCity = await this.findOneById(id);
    if (!prodcomCity) {
      throw new NotFoundException(`Prodcomcity with ID '${id}' not found`);
    }
    await this.prodcomcityRepository.remove(prodcomCity);
  }


  async updateProdcomcity(
    id: string,
    updateProdcomcityDto: UpdateProdcomcityDto,
    user: User,
  ): Promise<Prodcomcity> {
    return this.executeInTransaction(user.id.toString(), async (manager) => {
      // Obtener el Prodcomcity existente
      const prodcomcity = await manager.findOne(Prodcomcity, {
        where: { id },
        relations: ['comcity', 'product'],
      });

      if (!prodcomcity) {
        throw new NotFoundException(`Prodcomcity with id ${id} not found`);
      }

      // Obtener comcity utilizando el mismo manager
      const comcity = await manager.findOne(Comcity, {
        where: { id: updateProdcomcityDto.comcity },
      });

      if (!comcity) {
        throw new NotFoundException(`Comcity with id ${updateProdcomcityDto.comcity} not found`);
      }

      // Obtener el producto y actualizar sus campos
      const productData = updateProdcomcityDto.product;

      if (!productData || !productData.id) {
        throw new NotFoundException('Product id is required in product data');
      }

      const product = await manager.findOne(Product, {
        where: { id: productData.id },
        relations: ['images'],
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${productData.id} not found`);
      }

      // Actualizar los campos obligatorios del producto
      product.title = productData.title;
      product.code = productData.code;
      product.user = user;

      // Actualizar las imágenes del producto si se proporcionan
      if (productData.images) {
        // Eliminar las imágenes existentes
        await manager.delete(ProductImage, { product: { id: product.id } });

        // Crear y asignar nuevas imágenes
        product.images = productData.images.map((imageUrl) =>
          manager.create(ProductImage, { url: imageUrl, product }),
        );
      }

      // Guardar el producto actualizado
      await manager.save(product);

      // Actualizar los campos de Prodcomcity
      prodcomcity.comcity = comcity;
      prodcomcity.product = product;
      prodcomcity.date = updateProdcomcityDto.date || prodcomcity.date;

      if (updateProdcomcityDto.price !== undefined) {
        prodcomcity.price = updateProdcomcityDto.price;
      }

      // Guardar el Prodcomcity actualizado
      await manager.save(prodcomcity);

      return prodcomcity;
    });
  }

  // async remove(id: string, user: User): Promise<void> {
  //   return this.executeInTransaction(user.id.toString(), async (manager) => {
  //     const prodcomcity = await manager.findOne(Prodcomcity, { where: { id } });

  // if (!prodcomcity) {
  //   throw new NotFoundException(`Prodcomcity with ID '${id}' not found`);
  // }

  //     await manager.remove(prodcomcity);
  //   });
  // }



  // async findAllByCompanyName(companyName: string): Promise<Prodcomcity[]> {
  //   const comcities = await this.comcityService.findAllByCompanyName(companyName);
  //   const comcityIds = comcities.map(cc => cc.id);

  //   if (comcityIds.length === 0) {
  //     return []; 
  //   }

  //   return this.prodcomcityRepository.find({
  //     where: {
  //       comcity: {
  //         id: In(comcityIds),
  //       },
  //     },
  //     relations: ['product', 'comcity', 'user', 'comcity.city', 'comcity.company'],
  //   });
  // }

  async findAllByCityId(cityId: string): Promise<Prodcomcity[]> {
    const products = await this.prodcomcityRepository.find({
      where: {
        comcity: {
          city: {
            id: cityId,
          },
        },
      },
      relations: [
        'product',
        'comcity',
        'user',
        'comcity.city',
        'comcity.company',
      ],
    });

    if (products.length === 0) {
      throw new NotFoundException(`No products found for city ID ${cityId}`);
    }

    return products;
  }

  async findAllByCompanyId(companyId: string): Promise<Prodcomcity[]> {
    const products = await this.prodcomcityRepository.find({
      where: {
        comcity: {
          company: {
            id: companyId,
          },
        },
      },
      relations: [
        'product',
        'comcity',
        'user',
        'comcity.city',
        'comcity.company',
      ],
    });

    if (products.length === 0) {
      throw new NotFoundException(`No products found for city ID ${companyId}`);
    }

    return products;
  }

  async findAllByCityAndCompanyId(
    cityId?: string,
    companyId?: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<Prodcomcity[]> {
    const whereConditions: any = {};

    if (cityId) {
      whereConditions.comcity = {
        ...whereConditions.comcity,
        city: {
          id: cityId,
        },
      };
    }

    if (companyId) {
      whereConditions.comcity = {
        ...whereConditions.comcity,
        company: {
          id: companyId,
        },
      };
    }

    const [products, total] = await this.prodcomcityRepository.findAndCount({
      where: whereConditions,
      relations: [
        'product',
        'comcity',
        'user',
        'comcity.city',
        'comcity.company',
      ],
      skip: page * limit,
      take: limit,
    });

    if (products.length === 0) {
      throw new NotFoundException(`No products found for the provided criteria.`);
    }

    return products;
  }

  async findProdcomcitiesBySearch(
    term: string,
    cityId?: string,
    companyId?: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<Prodcomcity[]> {
    try {
      const terms = term.toLowerCase().split(' ');
  
      const query = this.prodcomcityRepository
        .createQueryBuilder('prodcomcity')
        .leftJoinAndSelect('prodcomcity.product', 'product')
        .leftJoinAndSelect('prodcomcity.comcity', 'comcity')
        .leftJoinAndSelect('comcity.company', 'company')
        .leftJoinAndSelect('comcity.city', 'city')
        .leftJoinAndSelect('product.images', 'images');
  
      // Aplicar los filtros por los términos de búsqueda
      if (terms.length > 0) {
        query.where(
          new Brackets((qb) => {
            terms.forEach((t) => {
              qb.orWhere('LOWER(product.title) LIKE :titleTerm', { titleTerm: `%${t}%` })
                .orWhere(':tag = ANY(product.tags)', { tag: t })
                .orWhere('product.code::text LIKE :codeTerm', { codeTerm: `%${t}%` });
            });
          }),
        );
      }
  
      // Aplicar el filtro por ciudad si se proporciona `cityId`
      if (cityId) {
        query.andWhere('city.id = :cityId', { cityId });
      }
  
      // Aplicar el filtro por empresa si se proporciona `companyId`
      if (companyId) {
        query.andWhere('company.id = :companyId', { companyId });
      }
  
      // Aplicar la paginación
      query.take(limit).skip(page * limit);
  
      // Obtener los resultados de la consulta
      const prodcomcities = await query.getMany();
  
      if (prodcomcities.length === 0) {
        throw new NotFoundException(`No products found for the provided criteria.`);
      }
  
      return prodcomcities;
    } catch (error) {
      this.handleDBException(error);
      throw new InternalServerErrorException('An error occurred while searching Prodcomcity');
    }
  }

  async findProductsByTags(tags: string[]): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.tags @> ARRAY[:...tags]', { tags })
      .getMany();
  }


  async findLowestPricesByTags(tags: string[]): Promise<any[]> {
    const products = await this.findProductsByTags(tags);
    const productIds = products.map(product => product.id);

    if (productIds.length === 0) {
      return [];
    }

    const prices = await this.prodcomcityRepository
      .createQueryBuilder('pcc')
      .select('company.id', 'companyId')
      .addSelect('company.name', 'companyName')
      .addSelect('MIN(pcc.price)', 'lowestPrice')
      .addSelect('product.title', 'productTitle')
      .addSelect('product.id', 'productId')
      .innerJoin('pcc.product', 'product')
      .innerJoin('pcc.comcity', 'comcity')
      .innerJoin('comcity.company', 'company')
      .where('pcc.productId IN (:...productIds)', { productIds })
      .groupBy('company.id')
      .addGroupBy('company.name')
      .addGroupBy('product.id')
      .addGroupBy('product.title')
      .getRawMany();

    return prices.map(price => ({
      companyId: price.companyId,
      companyName: price.companyName,
      productId: price.productId,
      productTitle: price.productTitle,
      lowestPrice: parseFloat(price.lowestPrice),
    }));
  }



  async deleteAllProdComcity() {
    const query = this.prodcomcityRepository.createQueryBuilder('prodcomcity');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, please check the logs');

  }
}
