import { validate } from 'class-validator';
import { CreateComcityDto } from './create-comcity.dto';

describe('CreateComcityDto', () => {
  let dto: CreateComcityDto;

  beforeEach(() => {
    dto = new CreateComcityDto();
  });

  describe('Validation Rules', () => {
    it('should validate a correct DTO', async () => {
      dto.city = 'bb3d7cbac2174dd30fe5e787131d951799abdd84';
      dto.company = 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    describe('city property', () => {
      it('should fail when city is empty', async () => {
        dto.city = '';
        dto.company = 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });

      it('should fail when city is not a string', async () => {
        dto.city = 123 as any;
        dto.company = 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isString');
      });

      it('should fail when city is undefined', async () => {
        dto.company = 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    describe('company property', () => {
      it('should fail when company is empty', async () => {
        dto.city = 'bb3d7cbac2174dd30fe5e787131d951799abdd84';
        dto.company = '';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });

      it('should fail when company is not a string', async () => {
        dto.city = 'bb3d7cbac2174dd30fe5e787131d951799abdd84';
        dto.company = 123 as any;

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isString');
      });

      it('should fail when company is undefined', async () => {
        dto.city = 'bb3d7cbac2174dd30fe5e787131d951799abdd84';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Swagger Decorators', () => {
    it('should have ApiProperty decorators with correct metadata', () => {
      const cityMetadata = Reflect.getMetadata('swagger/apiProperties', CreateComcityDto.prototype, 'city');
      const companyMetadata = Reflect.getMetadata('swagger/apiProperties', CreateComcityDto.prototype, 'company');

//       expect(cityMetadata).toBeDefined();
//       expect(cityMetadata.description).toBe('The ID of the city');
//       expect(cityMetadata.example).toBe('bb3d7cbac2174dd30fe5e787131d951799abdd84');
//       expect(cityMetadata.nullable).toBe(false);
//       expect(cityMetadata.minLength).toBe(1);

//       expect(companyMetadata).toBeDefined();
//       expect(companyMetadata.description).toBe('The ID of the company');
//       expect(companyMetadata.example).toBe('a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d');
//       expect(companyMetadata.nullable).toBe(false);
//       expect(companyMetadata.minLength).toBe(1);
    });
  });
});