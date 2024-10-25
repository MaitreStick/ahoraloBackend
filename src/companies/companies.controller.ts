import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './entities/company.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created', type: Company })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies with pagination' })
  @ApiResponse({ status: 200, description: 'List of all companies', type: [Company] })
  findAll(@Query() paginationDto: PaginationDto){
    return this.companiesService.findAll( paginationDto );
  }

  @Get('search')
  @ApiOperation({ summary: 'Search companies by name' })
  @ApiResponse({ status: 200, description: 'List of companies matching the search criteria', type: [Company] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async find(
    @Query('name') name: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<Company[]> {
    if (!name) {
      return this.companiesService.findAll({ offset, limit });
    }
    return this.companiesService.findByName(name, offset, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({ status: 200, description: 'Returns the company by ID', type: Company })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.findOnePlain(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company by ID' })
  @ApiResponse({ status: 200, description: 'Company updated successfully', type: Company })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Company not found' })
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
  @ApiOperation({ summary: 'Delete a company by ID' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.remove(id);
  }
}
