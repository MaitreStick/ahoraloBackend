import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Res, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { ComcityService } from './comcity.service';
import { CreateComcityDto } from './dto/create-comcity.dto';
import { UpdateComcityDto } from './dto/update-comcity.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { Comcity } from './entities/comcity.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.comcityService.remove(id);
  }
}
