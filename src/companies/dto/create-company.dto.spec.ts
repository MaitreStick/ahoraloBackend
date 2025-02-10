import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateComcityDto } from './create-comcity.dto.ts';

describe('CreateComcityDto', () => {
  let dto: CreateComcityDto;

  // Datos de prueba constantes
  const VALID_CITY_ID = 'bb3d7cbac2174dd30fe5e787131d951799abdd84';
  const VALID_COMPANY_ID = 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d';

  beforeEach(() => {
    dto = new CreateComcityDto();
  });

  describe('Instance Creation', () => {
    it('should create an instance', () => {
      expect(dto).toBeDefined();
      expect(dto).toBeInstanceOf(CreateComcityDto);
    });
  });

  describe('Validation Rules', () => {
    describe('Valid Data', () => {
      it('should validate a correct DTO', async () => {
        dto.city = VALID_CITY_ID;
        dto.company = VALID_COMPANY_ID;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });
    });

    describe('City Property Validation', () => {
      it('should fail when city is empty', async () => {
        dto.city = '';
        dto.company = VALID_COMPANY_ID;

        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });

      it('should fail when city is not a string', async () => {
        dto.city = 123 as any;
        dto.company = VALID_COMPANY_ID;

        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints).toHaveProperty('isString');
      });

      it('should fail when city is undefined', async () => {
        dto.company = VALID_COMPANY_ID;

        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('city');
      });
    });

    describe('Company Property Validation', () => {
      it('should fail when company is empty', async () => {
        dto.city = VALID_CITY_ID;
        dto.company = '';

        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });

      it('should fail when company is not a string', async () => {
        dto.city = VALID_CITY_ID;
        dto.company = 123 as any;

        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints).toHaveProperty('isString');
      });

      it('should fail when company is undefined', async () => {
        dto.city = VALID_CITY_ID;

        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('company');
      });
    });

    describe('Multiple Validation Errors', () => {
      it('should report multiple validation errors', async () => {
        dto.city = '';
        dto.company = '';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Swagger Documentation', () => {
    describe('City Property Metadata', () => {
      it('should have correct swagger metadata for city', () => {
        const metadata = Reflect.getMetadata('swagger/apiProperties', CreateComcityDto.prototype, 'city');

        expect(metadata).toBeDefined();
        expect(metadata).toEqual({
          description: 'The ID of the city',
          example: VALID_CITY_ID,
          nullable: false,
          minLength: 1
        });
      });
    });

    describe('Company Property Metadata', () => {
      it('should have correct swagger metadata for company', () => {
        const metadata = Reflect.getMetadata('swagger/apiProperties', CreateComcityDto.prototype, 'company');

        expect(metadata).toBeDefined();
        expect(metadata).toEqual({
          description: 'The ID of the company',
          example: VALID_COMPANY_ID,
          nullable: false,
          minLength: 1
        });
      });
    });
  });
});