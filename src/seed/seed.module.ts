import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from './../products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { CitiesModule } from 'src/cities/cities.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { ComcityModule } from 'src/comcity/comcity.module';
import { ProdcomcityModule } from 'src/prodcomcity/prodcomcity.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductsModule,
    AuthModule,
    CitiesModule,
    CompaniesModule,
    ComcityModule,
    ProdcomcityModule
  ],
})
export class SeedModule {}
