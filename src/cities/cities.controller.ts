import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from './entities/city.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({ status: 201, description: 'city created', type: City})
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies with pagination' })
  @ApiResponse({ status: 200, description: 'Returns a list of cities', type: [City] })
  findAll(@Query() paginationDto: PaginationDto){
    return this.citiesService.findAll( paginationDto );
  }

  
  @Get('search')
  @ApiOperation({ summary: 'Search companies by name' })
  @ApiResponse({ status: 200, description: 'Returns cities matching the search criteria', type: [City] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  find(
    @Query('name') name: string,
    @Query('department') department?: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    if (!name) {
      return this.citiesService.findAll({ limit, offset });
    }
    return this.citiesService.findByName(name, department, offset, limit);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({ status: 200, description: 'Returns the city by ID', type: City })
  @ApiResponse({ status: 404, description: 'City not found' })
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.citiesService.findOneById(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiOperation({ summary: 'Update a company by ID' })
  @ApiResponse({ status: 200, description: 'City updated successfully', type: City })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'City not found' })
  updateCity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCityDto: CreateCityDto,
  ): Promise<any> {
    return this.citiesService.updateCity(id, updateCityDto)
      .then(city => ({ city }))
      .catch(error => {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
        } else {
          throw new BadRequestException('Failed to update city');
        }
      });
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a company by ID' })
  @ApiResponse({ status: 200, description: 'City deleted successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.citiesService.remove(id);
  }
}
