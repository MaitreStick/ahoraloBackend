import { validate } from 'class-validator';
import { CreateCityDto } from './create-city.dto';

describe('CreateCityDto', () => {
  let dto: CreateCityDto;

  beforeEach(() => {
    dto = new CreateCityDto();
  });

  describe('name validation', () => {
    it('should validate a correct name', async () => {
      dto.name = 'Medellín';
      dto.nameDep = 'Antioquia';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when name is empty', async () => {
      dto.name = '';
      dto.nameDep = 'Antioquia';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail when name is not a string', async () => {
      dto.name = 123 as any;
      dto.nameDep = 'Antioquia';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when name is undefined', async () => {
      dto.nameDep = 'Antioquia';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('nameDep validation', () => {
    it('should validate a correct department name', async () => {
      dto.name = 'Medellín';
      dto.nameDep = 'Antioquia';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when department name is empty', async () => {
      dto.name = 'Medellín';
      dto.nameDep = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail when department name is not a string', async () => {
      dto.name = 'Medellín';
      dto.nameDep = 123 as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when department name is undefined', async () => {
      dto.name = 'Medellín';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('complete DTO validation', () => {
    it('should validate a complete valid DTO', async () => {
      const validDto = new CreateCityDto();
      validDto.name = 'Medellín';
      validDto.nameDep = 'Antioquia';
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });

    it('should fail when all fields are missing', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(2); // Debería tener dos errores, uno por cada campo requerido
    });

    it('should fail when all fields are empty strings', async () => {
      dto.name = '';
      dto.nameDep = '';
      const errors = await validate(dto);
      expect(errors.length).toBe(2);
    });
  });

});