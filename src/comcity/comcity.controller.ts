import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Res, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { ComcityService } from './comcity.service';
import { CreateComcityDto } from './dto/create-comcity.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { Comcity } from './entities/comcity.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@ApiTags('Company City')
@Controller('comcity')
export class ComcityController {
  constructor(private readonly comcityService: ComcityService) { }

  @Post()
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new city-company relationship' })
  @ApiResponse({ status: 201, description: 'City with company created', type: Comcity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(
    @Body() createComcityDto: CreateComcityDto,
    @GetUser() user: User,
  ) {
    return this.comcityService.create(createComcityDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all city-company relationships' })
  @ApiResponse({ status: 200, description: 'List of all city-company relationships', type: [Comcity] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.comcityService.findAll(paginationDto);
  }

  @Post('warehouses')
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createWarehouse(@Body() createWarehouseDto: CreateWarehouseDto) {
    try {
      return await this.comcityService.createWarehouse(createWarehouseDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @Get('by-company-and-city')
  @ApiOperation({ summary: 'Get city-company relationship by company ID and city ID' })
  @ApiResponse({ status: 200, description: 'City-company relationship found', type: Comcity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getByCompanyAndCity(
    @Query('companyId') companyId: string,
    @Query('cityId') cityId: string,
  ): Promise<Comcity> {
    if (!companyId || !cityId) {
      throw new BadRequestException('companyId and cityId are required');
    }
    return this.comcityService.findByCompanyIdAndCityId(companyId, cityId);
  }

  @Get('by-city/:cityId')
  @ApiOperation({ summary: 'Get all city-company relationships by city ID' })
  @ApiResponse({ status: 200, description: 'List of city-company relationships', type: [Comcity] })
  async getByCityId(@Param('cityId') cityId: string): Promise<Comcity[]> {
    return this.comcityService.findAllByCityId(cityId);
  }


  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get all city-company relationships by company ID' })
  @ApiResponse({ status: 200, description: 'List of city-company relationships', type: [Comcity] })
  async getByCompanyId(@Param('companyId') companyId: string): Promise<Comcity[]> {
    return this.comcityService.findAllByCompanyId(companyId);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Find a city-company relationship by ID or name' })
  @ApiResponse({ status: 200, description: 'City-company relationship found', type: Comcity })
  @ApiResponse({ status: 404, description: 'City-company relationship not found' })
  findOne(@Param('term') term: string) {
    return this.comcityService.findOnePlain(term);
  }

  @Post('warehouses/by-company-ids')
  @ApiOperation({ summary: 'Get warehouses by company IDs' })
  @ApiResponse({ status: 200, description: 'List of warehouses found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getWarehousesByCompanyIds(@Body() body: { companyIds: string[] }) {
    const { companyIds } = body;
    return this.comcityService.findByCompanyIds(companyIds);
  }
  
  @Post('nearest-warehouses')
  @ApiOperation({ summary: 'Get nearest warehouses based on user location' })
  @ApiResponse({ status: 200, description: 'List of nearest warehouses' })
  @ApiResponse({ status: 400, description: 'Bad request: Required parameters missing' })
  async getNearestWarehouses(
    @Body() body: { comcityId: string; userLatitude: number; userLongitude: number }
  ) {
    const { comcityId, userLatitude, userLongitude } = body;

    if (!comcityId || userLatitude === undefined || userLongitude === undefined) {
      throw new BadRequestException('comcityId, userLatitude, and userLongitude are required.');
    }

    return this.comcityService.findNearestWarehouses(comcityId, userLatitude, userLongitude);
  }


  @Patch(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiOperation({ summary: 'Update a city-company relationship' })
  @ApiResponse({ status: 200, description: 'City-company relationship updated', type: Comcity })
  @ApiResponse({ status: 404, description: 'City-company relationship not found' })
  updateComcity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateComcityDto: CreateComcityDto,
  ): Promise<any> {
    return this.comcityService.updateComcity(id, updateComcityDto)
      .then(comcity => ({ comcity }))
      .catch(error => {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
        } else {
          throw new BadRequestException('Failed to update comcity');
        }
      });
  }

  @Patch('warehouses/:id')
  @ApiOperation({ summary: 'Actualizar un almacén' })
  @ApiResponse({ status: 200, description: 'Almacén actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Almacén no encontrado.' })
  async updateWarehouse(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    try {
      return await this.comcityService.updateWarehouse(id, updateWarehouseDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @Delete('warehouses/:id')
  @ApiOperation({ summary: 'Delete a warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse deleted successfully' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async deleteWarehouse(@Param('id') id: string) {
    try {
      return await this.comcityService.deleteWarehouse(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('warehouses')
  @ApiOperation({ summary: 'Delete all warehouses' })
  @ApiResponse({ status: 200, description: 'All warehouses deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async deleteAllWarehouses() {
    try {
      return await this.comcityService.deleteAllWarehouses();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a city-company relationship' })
  @ApiResponse({ status: 200, description: 'City-company relationship deleted successfully' })
  @ApiResponse({ status: 404, description: 'City-company relationship not found' })
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.comcityService.remove(id);
  }
}
