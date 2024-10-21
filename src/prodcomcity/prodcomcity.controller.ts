import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Res, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProdcomcityService } from './prodcomcity.service';
import { CreateProdcomcityDto } from './dto/create-prodcomcity.dto';
import { UpdateProdcomcityDto } from './dto/update-prodcomcity.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { Prodcomcity } from './entities/prodcomcity.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Product Company City')
@Controller('prodcomcity')
export class ProdcomcityController {
  constructor(private readonly prodcomcityService: ProdcomcityService) { }

  @Post()
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'Product with city and company created', type: Prodcomcity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  create(
    @Body() createProdcomcityDto: CreateProdcomcityDto,
    @GetUser() user: User,
  ) {
    return this.prodcomcityService.create(createProdcomcityDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.prodcomcityService.findAll(paginationDto);
  }

  @Get('/by-city-and-company/:cityId/:companyId')
  async findAllByCityAndCompany(
    @Query('cityId') cityId?: string,
    @Query('companyId') companyId?: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<Prodcomcity[]> {
    return await this.prodcomcityService.findAllByCityAndCompanyId(cityId, companyId, page, limit);
  }


  @Get('/by-company/:companyId')
  @ApiResponse({ status: 200, description: 'Products by company', type: [Prodcomcity] })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getByCompany(@Param('companyId') companyId: string) {
    const results = await this.prodcomcityService.findAllByCompanyId(companyId);
    if (results.length === 0) {
      return [];
    }
    return results;
  }

  @Get('/by-city/:cityId')
  @ApiResponse({ status: 200, description: 'Products by city', type: [Prodcomcity] })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getByCity(@Param('cityId') cityId: string) {
    const results = await this.prodcomcityService.findAllByCityId(cityId);
    if (results.length === 0) {
      return [];
    }
    return results;
  }


  @Post('lowest-prices-by-tags')
  async getLowestPricesByTags(
    @Body() body: { tags: string[]; cityId: string }
  ) {
    const { tags, cityId } = body;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      throw new BadRequestException('El campo "tags" es requerido y debe ser un arreglo no vacío.');
    }
    if (!cityId) {
      throw new BadRequestException('El campo "cityId" es requerido.');
    }

    return this.prodcomcityService.findLowestPricesByTags(tags, cityId);
  }

  @Post('lowest-prices-by-codes')
  async getLowestPricesByCodes(
    @Body() body: { codes: number[]; cityId: string }
  ) {
    const { codes, cityId } = body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      throw new BadRequestException('El campo "codes" es requerido y debe ser un arreglo no vacío.');
    }
    if (!cityId) {
      throw new BadRequestException('El campo "cityId" es requerido.');
    }

    return this.prodcomcityService.findLowestPricesByCodes(codes, cityId);
  }




  @Get('/:comcityId/:productId')
  async findProdcomcity(@Param('comcityId') comcityId: string, @Param('productId') productId: string): Promise<Prodcomcity> {
    const prodcomcity = await this.prodcomcityService.findProdcomcityByComcityAndProduct(comcityId, productId);
    if (!prodcomcity) {
      throw new NotFoundException('Prodcomcity not found with the provided comcityId and productId');
    }
    return prodcomcity;
  }

  @Get('search')
  async searchProdcomcities(
    @Query('term') term: string,
    @Query('cityId') cityId?: string,
    @Query('companyId') companyId?: string,
    @Query('page') page: string = '0',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return await this.prodcomcityService.findProdcomcitiesBySearch(
      term,
      cityId,
      companyId,
      pageNumber,
      limitNumber,
    );
  }


  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.prodcomcityService.findOnePlain(term);
  }


  @Patch(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  async updateProdcomcity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProdcomcityDto: UpdateProdcomcityDto,
    @GetUser() user: User,
  ): Promise<any> {
    try {
      const prodcomcity = await this.prodcomcityService.updateProdcomcity(id, updateProdcomcityDto, user);
      return { prodcomcity };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException('Failed to update prodcomcity');
      }
    }
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.prodcomcityService.remove(id);
  }
}
