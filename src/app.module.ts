import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ProdcomcityModule } from './prodcomcity/prodcomcity.module';
import { ComcityModule } from './comcity/comcity.module';
import { CitiesModule } from './cities/cities.module';
import { CompaniesModule } from './companies/companies.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_LINK,
      // host: process.env.DB_HOST,
      // port: +process.env.DB_PORT,
      // database: 'postgres',
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule,

    ProdcomcityModule,

    ComcityModule,

    CitiesModule,

    CompaniesModule,

    AuditLogModule,

  ],
})
export class AppModule {}