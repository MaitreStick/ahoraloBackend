import { Module } from '@nestjs/common';
import { ComcityService } from './comcity.service';
import { ComcityController } from './comcity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Comcity } from './entities/comcity.entity';
import { CitiesModule } from 'src/cities/cities.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  controllers: [ComcityController],
  providers: [ComcityService],
  imports: [
    TypeOrmModule.forFeature([ Comcity ]),
    AuthModule,
    CitiesModule,
    CompaniesModule
  ],
  exports: [
    ComcityService,
    TypeOrmModule,
  ]
})
export class ComcityModule {}
