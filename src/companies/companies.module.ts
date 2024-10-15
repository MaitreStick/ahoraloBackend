import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    TypeOrmModule.forFeature([ Company ]),
    AuthModule
  ],
  exports: [
    CompaniesService,
    TypeOrmModule,
  ]
})
export class CompaniesModule {}
