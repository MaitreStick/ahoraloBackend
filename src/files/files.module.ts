import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from 'src/products/products.module';
import { ProdcomcityModule } from 'src/prodcomcity/prodcomcity.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ConfigModule,
    forwardRef(() => ProductsModule), 
    ProdcomcityModule
  ],
  exports: [FilesService],
})
export class FilesModule {}
