import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { ProdcomcityModule } from 'src/prodcomcity/prodcomcity.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ConfigModule,
    ProdcomcityModule,
    ProductsModule
  ],
})
export class FilesModule {}
