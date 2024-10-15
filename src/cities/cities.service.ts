import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { City } from './entities/city.entity';
import { validate as isUUID} from 'uuid';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CitiesService {

  private readonly logger = new Logger('CitiesService');

  constructor(

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private dataSource: DataSource
  ) {}

  async create(createCityDto: CreateCityDto) {

    try {
      const city = this.cityRepository.create(createCityDto);
      await this.cityRepository.save(city);
      return city;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;
    
    const cities = await this.cityRepository.find({
      skip: offset,
      take: limit
    });

    return cities;
  }

  async findOne(term: string, depName?: string) {
    if (isUUID(term)) {
      return this.findOneById(term);
    } else {
      if (!depName) {
        throw new BadRequestException("Department name must be provided for non-UUID searches");
      }
      const queryBuilder = this.cityRepository.createQueryBuilder('city');
      const city = await queryBuilder
        .where('UPPER(city.name) = :name AND UPPER(city.nameDep) = :nameDep', {
          name: term.toUpperCase(),
          nameDep: depName.toUpperCase()
        })
        .getOne();
      if (!city)
        throw new NotFoundException(`City with name '${term}' in department '${depName}' not found`);
      return city;
    }
  }

  async findByName(name: string, department?: string, offset: number = 0, limit: number = 10): Promise<City[]> {
    const queryBuilder = this.cityRepository.createQueryBuilder('city');
  
    queryBuilder
      .where('LOWER(city.name) LIKE :name', { name: `%${name.toLowerCase()}%` })
      .offset(offset)
      .limit(limit);
  
    if (department) {
      queryBuilder.andWhere('LOWER(city.nameDep) = :department', { department: department.toLowerCase() });
    }
  
    const cities = await queryBuilder.getMany();
    if (!cities || cities.length === 0) {
      return [];
    }
    return cities;
  }
  


  async findOnePlain(term: string, depName?: string) {
    const city = await this.findOne(term, depName); 
    return city;
  }

  async findOneById(id: string) {
    const city = await this.cityRepository.findOneBy({ id });
    if (!city)
      throw new NotFoundException(`City with ID '${id}' not found`);
    return city;
  }
  
  

  async updateCity(id: string, updateCityDto: CreateCityDto): Promise<City> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let city = await queryRunner.manager.findOne(City, { where: { id } });

      if (!city) throw new NotFoundException(`City with id ${id} not found`);

      city.name = updateCityDto.name;
      city.nameDep = updateCityDto.nameDep;

      await queryRunner.manager.save(city);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return city;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async remove(id: string) {
    const city = await this.findOneById(id);
    await this.cityRepository.remove(city);
  }
  

  async deleteAllCities() {
    const query = this.cityRepository.createQueryBuilder('city');

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
