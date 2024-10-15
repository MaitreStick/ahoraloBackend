import { Module } from '@nestjs/common';
import { ProdcomcityService } from './prodcomcity.service';
import { ProdcomcityController } from './prodcomcity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prodcomcity } from './entities/prodcomcity.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { ComcityModule } from 'src/comcity/comcity.module';
import { CitiesModule } from 'src/cities/cities.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { Product } from 'src/products/entities';
import { Comcity } from 'src/comcity/entities/comcity.entity';
import { Company } from 'src/companies/entities/company.entity';
import { City } from 'src/cities/entities/city.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [ProdcomcityController],
  providers: [ProdcomcityService],
  imports: [
    TypeOrmModule.forFeature([ Prodcomcity, Product, Comcity, Company, City, User ]),
    AuthModule,
    ProductsModule,
    ComcityModule,
    CitiesModule,
    CompaniesModule
  ],
  exports: [
    ProdcomcityService,
    TypeOrmModule,
  ]
})
export class ProdcomcityModule {}
