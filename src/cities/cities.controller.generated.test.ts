import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from './entities/city.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CitiesController } from './cities.controller';

jest.mock('@nestjs/common');
jest.mock('./cities.service');
jest.mock('./dto/create-city.dto');
jest.mock('./dto/update-city.dto');
jest.mock('src/auth/decorators');
jest.mock('src/auth/interfaces');
jest.mock('@nestjs/swagger');
jest.mock('./entities/city.entity');
jest.mock('src/common/dtos/pagination.dto');

describe('CitiesController', () => {
  let instance;

  beforeEach(() => {
    instance = new CitiesController();
  });

  it('instance should be an instanceof CitiesController', () => {
    expect(instance instanceof CitiesController).toBeTruthy();
  });

  it('should have a method create()', () => {
    // instance.create(createCityDto);
    expect(false).toBeTruthy();
  });

  it('should have a method findAll()', () => {
    // instance.findAll(paginationDto);
    expect(false).toBeTruthy();
  });

  it('should have a method find()', () => {
    // instance.find(name,department,offset,limit);
    expect(false).toBeTruthy();
  });

  it('should have a method findOneById()', () => {
    // instance.findOneById(id);
    expect(false).toBeTruthy();
  });

  it('should have a method updateCity()', () => {
    // instance.updateCity(id,updateCityDto);
    expect(false).toBeTruthy();
  });

  it('should have a method remove()', () => {
    // instance.remove(id);
    expect(false).toBeTruthy();
  });
});