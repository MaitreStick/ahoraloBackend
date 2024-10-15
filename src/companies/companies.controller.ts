import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './entities/company.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'company created', type: Company})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto){
    return this.companiesService.findAll( paginationDto );
  }

  @Get('search')
  async find(
    @Query('name') name: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<Company[]> {
    if (!name) {
      // Opcionalmente, podrías devolver todas las empresas si no se proporciona un nombre
      return this.companiesService.findAll({ offset, limit });
      // O lanzar una excepción
      // throw new BadRequestException('Name must be provided');
    }
    return this.companiesService.findByName(name, offset, limit);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Returns the city by ID', type: Company })
  @ApiResponse({ status: 404, description: 'City not found' })
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.findOnePlain(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin) 
  updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: CreateCompanyDto,
  ): Promise<any> {
    return this.companiesService.updateCompany(id, updateCompanyDto)
      .then(company => ({ company }))
      .catch(error => {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
        } else {
          throw new BadRequestException('Failed to update company');
        }
      });
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.remove(id);
  }
}
