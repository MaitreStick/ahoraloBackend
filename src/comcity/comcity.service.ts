import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateComcityDto } from './dto/create-comcity.dto';
import { Comcity } from './entities/comcity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CitiesService } from 'src/cities/cities.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { User } from 'src/auth/entities/user.entity';
import { isUUID } from 'class-validator';
import { City } from 'src/cities/entities/city.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class ComcityService {

  private readonly logger = new Logger('ProdcomcityService');

  constructor(

    @InjectRepository(Comcity)
    private readonly comcityRepository: Repository<Comcity>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private readonly cityService: CitiesService,
    private readonly companyService: CompaniesService,
    private readonly dataSource: DataSource,

  ) { }


  async create(createComcityDto: CreateComcityDto, user: User) {
    try {
      const { city, company } = createComcityDto;

      const cityEntity = await this.cityService.findOne(city);
      const companyEntity = await this.companyService.findOne(company);
      if (!cityEntity) {
        throw new BadRequestException('Product not found');
      } else if (!companyEntity) {
        throw new BadRequestException('Company not found');
      } else if (cityEntity && companyEntity) {
        const comcity = await this.comcityRepository.findOne({
          where: {
            city: cityEntity,
            company: companyEntity
          }
        });

        if (comcity) {
          throw new BadRequestException('Company already linked to city');
        }
      }

      const comcity = this.comcityRepository.create({
        city: cityEntity,
        company: companyEntity,
        user
      });

      await this.comcityRepository.save(comcity);
      return comcity;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async createWarehouse(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const { name, latitude, longitude, comcityId } = createWarehouseDto;

    const comcity = await this.comcityRepository.findOne({
      where: { id: comcityId },
    });

    if (!comcity) {
      throw new NotFoundException(`Comcity con ID "${comcityId}" no encontrado.`);
    }

    const warehouse = this.warehouseRepository.create({
      name,
      latitude,
      longitude,
      comcity,
    });

    return this.warehouseRepository.save(warehouse);
  }

  async updateWarehouse(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: ['comcity'],
    });

    if (!warehouse) {
      throw new NotFoundException(`Almacén con ID "${id}" no encontrado.`);
    }

    if (updateWarehouseDto.comcityId) {
      const comcity = await this.comcityRepository.findOne({
        where: { id: updateWarehouseDto.comcityId },
      });

      if (!comcity) {
        throw new NotFoundException(`Comcity con ID "${updateWarehouseDto.comcityId}" no encontrado.`);
      }

      warehouse.comcity = comcity;
    }

    // Actualizar los campos proporcionados
    Object.assign(warehouse, updateWarehouseDto);

    return this.warehouseRepository.save(warehouse);
  }

  async deleteWarehouse(id: string): Promise<void> {
    const result = await this.warehouseRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Almacén con ID "${id}" no encontrado.`);
    }
  }

  async deleteAllWarehouses(): Promise<void> {
    await this.warehouseRepository.clear();
  }

  async findAll(paginationDto: PaginationDto): Promise<Comcity[]> {
    const { limit = 10, offset = 0, search = '' } = paginationDto;

    const query = this.comcityRepository.createQueryBuilder('comcity')
      .leftJoinAndSelect('comcity.city', 'city')
      .leftJoinAndSelect('comcity.company', 'company')
      .leftJoinAndSelect('comcity.user', 'user')
      .skip(offset)
      .take(limit);

    if (search) {
      query.where('city.name ILIKE :search', { search: `%${search}%` });
    }

    const comcities = await query.getMany();

    return comcities;
  }

  async findOne(term: string) {
    let comCity: Comcity;
    if (isUUID(term)) {
      comCity = await this.comcityRepository.findOne({
        where: { id: term },
        relations: ['city', 'company', 'user']
      });
    }


    if (!comCity)
      throw new NotFoundException(`comCity with ${term} not found`);

    return comCity;
  }

  async findOnePlain(term: string) {
    const comcity = await this.findOne(term);
    return comcity;
  }

  async findOneById(id: string) {
    const comcity = await this.comcityRepository.findOne({
      where: { id },
      relations: ['city', 'company', 'user']  // Asegura que las relaciones se carguen
    });
    if (!comcity)
      throw new NotFoundException(`Comcity with ID '${id}' not found`);
    return comcity;
  }

  async updateComcity(id: string, updateComcityDto: CreateComcityDto): Promise<Comcity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let comcity = await queryRunner.manager.findOne(Comcity, { where: { id }, relations: ['city', 'company'] });

      if (!comcity) throw new NotFoundException(`Comcity with id ${id} not found`);

      const city = await this.cityRepository.findOne({ where: { id: updateComcityDto.city } });
      const company = await this.companyRepository.findOne({ where: { id: updateComcityDto.company } });

      if (!city || !company) {
        throw new NotFoundException('City or Company not found');
      }

      comcity.city = city;
      comcity.company = company;

      await queryRunner.manager.save(comcity);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return comcity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async remove(id: string) {
    const comCity = await this.findOneById(id);
    await this.comcityRepository.remove(comCity);
  }

  async findByCompanyIdAndCityId(companyId: string, cityId: string): Promise<Comcity> {
    const comcity = await this.comcityRepository.findOne({
      where: {
        company: { id: companyId },
        city: { id: cityId },
      },
      relations: ['city', 'company'],
    });

    if (!comcity) {
      throw new NotFoundException(`Comcity with company ID '${companyId}' and city ID '${cityId}' not found`);
    }

    return comcity;
  }

  async findAllByCompanyId(companyId: string): Promise<Comcity[]> {
    return this.comcityRepository.find({
      where: {
        company: { id: companyId },
      },
      relations: ['company', 'city'],
    });
  }

  async findAllByCityId(cityId: string): Promise<Comcity[]> {
    return this.comcityRepository.find({
      where: {
        city: { id: cityId },
      },
      relations: ['city', 'company'],
    });
  }

  async deleteAllComcity() {
    const query = this.comcityRepository.createQueryBuilder('comcity');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findByCompanyIds(companyIds: string[]): Promise<Warehouse[]> {
    return this.warehouseRepository
      .createQueryBuilder('warehouse')
      .innerJoinAndSelect('warehouse.comcity', 'comcity')
      .innerJoinAndSelect('comcity.company', 'company')
      .where('company.id IN (:...companyIds)', { companyIds })
      .getMany();
  }

  async findNearestWarehouses(comcityId: string, userLatitude: number, userLongitude: number) {
    // Obtener los almacenes asociados al comcity dado
    const warehouses = await this.dataSource
      .getRepository(Warehouse)
      .createQueryBuilder('warehouse')
      .innerJoin('warehouse.comcity', 'comcity')
      .where('comcity.id = :comcityId', { comcityId })
      .getMany();

    if (!warehouses || warehouses.length === 0) {
      return [];
    }

    // Calcular la distancia de cada almacén a la ubicación del usuario
    const warehousesWithDistance = warehouses.map((warehouse) => {
      const distance = this.calculateDistance(
        userLatitude,
        userLongitude,
        warehouse.latitude,
        warehouse.longitude
      );
      return {
        id: warehouse.id,
        name: warehouse.name,
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
        distance,
      };
    });

    // Ordenar los almacenes por distancia ascendente
    warehousesWithDistance.sort((a, b) => a.distance - b.distance);

    return warehousesWithDistance;
  }

  // Método para calcular la distancia entre dos puntos (Haversine formula)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const earthRadiusKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c * 1000; // Devuelve la distancia en metros
  }


  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, please check the logs');

  }

}
