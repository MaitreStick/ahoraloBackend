import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class CompaniesService {

  private readonly logger = new Logger('CompaniesService');

  constructor(

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private dataSource: DataSource,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = this.companyRepository.create(createCompanyDto);
      await this.companyRepository.save(company);
      return company;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;
    
    const companies = await this.companyRepository.find({
      skip: offset,
      take: limit
    });

    return companies;
  }

  async findByName(name: string, offset: number = 0, limit: number = 10): Promise<Company[]> {
    const queryBuilder = this.companyRepository.createQueryBuilder('company');

    queryBuilder
      .where('LOWER(company.name) LIKE :name', { name: `%${name.toLowerCase()}%` })
      .offset(offset)
      .limit(limit);

    const companies = await queryBuilder.getMany();

    if (!companies || companies.length === 0) {
      return []; // Puedes devolver un arreglo vacío o lanzar una excepción
    }

    return companies;
  }


  async findOne(term: string) {
    let company: Company;
    if( isUUID(term) ) {
      company = await this.companyRepository.findOneBy({ id: term  });
    } else {
      const queryBuilder = this.companyRepository.createQueryBuilder('company');
      company = await queryBuilder
      .where('UPPER(name) = :name', { 
        name: term.toUpperCase()
      })
      .getOne();
    }

    
    if (!company)
      throw new NotFoundException(`company ${term} not found`);
    
    return company;
  }

  async findOnePlain(term: string) {
    const company = await this.findOne(term); 
    return company;
  }

  async updateCompany(id: string, updateCompanyDto: CreateCompanyDto): Promise<Company> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let company = await queryRunner.manager.findOne(Company, { where: { id } });

      if (!company) throw new NotFoundException(`Company with id ${id} not found`);

      company.name = updateCompanyDto.name;

      await queryRunner.manager.save(company);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return company;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);
  }

  async deleteAllCompanies() {
    const query = this.companyRepository.createQueryBuilder('company');

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
