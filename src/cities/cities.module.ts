import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from './entities/city.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  imports: [
    TypeOrmModule.forFeature([ City ]),
    AuthModule
  ],
  exports: [
    CitiesService,
    TypeOrmModule,
  ]
})
export class CitiesModule {}
