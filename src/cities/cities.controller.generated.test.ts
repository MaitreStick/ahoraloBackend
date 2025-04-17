import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';

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
  let instance: CitiesController;

  let mockCitiesService: Partial<CitiesService>;

  beforeEach(() => {
    mockCitiesService = {
      // Add mock implementations of CitiesService methods if needed
    };
    instance = new CitiesController(mockCitiesService as CitiesService);
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