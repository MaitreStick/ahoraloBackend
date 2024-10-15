import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { CitiesService } from 'src/cities/cities.service';
import { CompaniesService } from 'src/companies/companies.service';
import { ComcityService } from 'src/comcity/comcity.service';
import specialAssignments, { productCodes } from './helpers/specialAssignments';
import { ProdcomcityService } from 'src/prodcomcity/prodcomcity.service';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    private readonly citiesService: CitiesService,
    private readonly companiesService: CompaniesService,
    private readonly comcityService: ComcityService,
    private readonly prodcomcityService: ProdcomcityService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ) {}

  async runSeed(): Promise<string> {

    try {
      await this.prodcomcityService.deleteAllProdComcity();
      await this.comcityService.deleteAllComcity();
      await this.deleteTables();
      const adminUser = await this.insertUsers();

      await this.insertNewProducts(adminUser);
      await this.insertNewCities();
      await this.insertNewCompanies();
      await this.insertNewComCities(adminUser);
      await this.insertNewProdComCities(adminUser);

      return 'SEED EXECUTED';
    } catch (error) {
      console.log('Error durante el proceso de seed:', error);
      throw error;
    } 
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()

  }

  private async insertUsers() {

    const seedUsers = initialData.users;
    
    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push( this.userRepository.create( user ) )
    });

    const dbUsers = await this.userRepository.save( seedUsers )

    return dbUsers[0];
  }


  private async insertNewProducts( user: User ) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push( this.productsService.create( product, user ) );
    });

    await Promise.all( insertPromises );


    return true;
  }

  private async insertNewCities() {
    await this.citiesService.deleteAllCities();

    const cities = initialData.cities;

    const insertPromises = [];

    cities.forEach( city => {
      insertPromises.push( this.citiesService.create( city ) );
    });

    await Promise.all( insertPromises );


    return true;
  }
  
  private async insertNewCompanies() {
    await this.companiesService.deleteAllCompanies();

    const companies = initialData.companies;

    const insertPromises = [];

    companies.forEach( company => {
      insertPromises.push( this.companiesService.create( company ) );
    });

    await Promise.all( insertPromises );


    return true;
  }


  async insertNewComCities(user: User) {

    const companies = await this.companiesService.findAll({limit: 0, offset: 0});
    const cities = await this.citiesService.findAll({limit: 0, offset: 0});

    for (const company of companies) {
        if (specialAssignments[company.name]) {
            const targetCities = cities.filter(city =>
                specialAssignments[company.name].includes(`${city.name}-${city.nameDep}`)
            );
            for (const city of targetCities) {
                await this.comcityService.create({city: city.id, company: company.id}, user);
            }
        } 
    }

    console.log("seed completed with ids");
    return true;
  } 

  private async insertNewProdComCities(user: User) {
    await this.prodcomcityService.deleteAllProdComcity();
  
    const products = await this.productsService.findAll({ limit: 0, offset: 0 });
    const comcities = await this.comcityService.findAll({ limit: 0, offset: 0 });
  
    const insertPromises = [];
  
    const citiesByCompany = {};
    for (const company in specialAssignments) {
        citiesByCompany[company] = specialAssignments[company];
    }
  
    const productsByCompany = {};
    for (const company in productCodes) {
      productsByCompany[company] = productCodes[company].map(code => parseInt(code));
  }
        
    for (const product of products) {
      const company = Object.keys(productsByCompany).find(company =>
          productsByCompany[company].includes(product.code)
      );
  
      if (!company) {
          console.log("company not found for product", product.code);
          continue;
      }
  
      const validComcities = comcities.filter(comcity => 
          comcity.company.name === company &&
          citiesByCompany[company].includes(`${comcity.city.name}-${comcity.city.nameDep}`)
      );
  
      for (const validComcity of validComcities) {
          insertPromises.push(
              this.prodcomcityService.createSeed({
                  product: product.id,
                  comcity: validComcity.id,
                  price: 0, 
                  date: new Date(), 
              }, user)
          );
      }
    }  
 
    await Promise.all(insertPromises);
  
    console.log("ProdComCities seeded successfully with price set to 0");
    return true;
  } 
}