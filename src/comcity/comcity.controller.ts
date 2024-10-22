import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Res, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { ComcityService } from './comcity.service';
import { CreateComcityDto } from './dto/create-comcity.dto';
import { UpdateComcityDto } from './dto/update-comcity.dto';
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
  @ApiResponse({ status: 201, description: 'City with company created', type: Comcity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  create(
    @Body() createComcityDto: CreateComcityDto,
    @GetUser() user: User,
  ) {
    return this.comcityService.create(createComcityDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.comcityService.findAll(paginationDto);
  }

  @Post('warehouses')
  async createWarehouse(@Body() createWarehouseDto: CreateWarehouseDto) {
    try {
      return await this.comcityService.createWarehouse(createWarehouseDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @Get('by-company-and-city')
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
  async getByCityId(@Param('cityId') cityId: string): Promise<Comcity[]> {
    return this.comcityService.findAllByCityId(cityId);
  }


  @Get('by-company/:companyId')
  async getByCompanyId(@Param('companyId') companyId: string): Promise<Comcity[]> {
    return this.comcityService.findAllByCompanyId(companyId);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.comcityService.findOnePlain(term);
  }

  @Post('nearest-warehouses')
  async getNearestWarehouses(
    @Body() body: { comcityId: string; userLatitude: number; userLongitude: number }
  ) {
    const { comcityId, userLatitude, userLongitude } = body;

    if (!comcityId || userLatitude === undefined || userLongitude === undefined) {
      throw new BadRequestException('comcityId, userLatitude, and userLongitude are required.');
    }

    return this.comcityService.findNearestWarehouses(comcityId, userLatitude, userLongitude);
  }

  @Post('by-company-ids')
  async getWarehousesByCompanyIds(@Body() body: { companyIds: string[] }) {
    const { companyIds } = body;
    return this.comcityService.findByCompanyIds(companyIds);
  }

  @Patch(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
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

  @ApiOperation({ summary: 'Actualizar un almacén' })
  @ApiResponse({ status: 200, description: 'Almacén actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Almacén no encontrado.' })
  @Patch('warehouses/:id')
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
  async deleteWarehouse(@Param('id') id: string) {
    try {
      return await this.comcityService.deleteWarehouse(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('warehouses')
  async deleteAllWarehouses() {
    try {
      return await this.comcityService.deleteAllWarehouses();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.comcityService.remove(id);
  }
}
