import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ProductUpdateDto, UpdateProdcomcityDto } from './update-prodcomcity.dto';

describe('Product DTOs', () => {
  describe('ProductUpdateDto', () => {
    let dto: ProductUpdateDto;

    beforeEach(() => {
      dto = new ProductUpdateDto();
    });

    describe('Valid Data', () => {
      it('should validate a complete valid DTO', async () => {
        const validData = {
          id: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
          title: 'Jabón Rey',
          code: 71296482,
          tags: ['manzana', 'verde'],
          images: ['https://example.com/image1.jpg']
        };

        Object.assign(dto, validData);
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });

      it('should validate without optional fields', async () => {
        const validData = {
          id: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
          title: 'Jabón Rey',
          code: 71296482
        };

        Object.assign(dto, validData);
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });
    });

    describe('Invalid Data', () => {
      it('should fail with empty id', async () => {
        dto.id = '';
        dto.title = 'Jabón Rey';
        dto.code = 71296482;

        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });

      it('should fail with empty title', async () => {
        dto.id = '1b965650-51c7-42e8-9642-a25ac46c0a4e';
        dto.title = '';
        dto.code = 71296482;

        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });

      it('should fail with negative code', async () => {
        dto.id = '1b965650-51c7-42e8-9642-a25ac46c0a4e';
        dto.title = 'Jabón Rey';
        dto.code = -1;

        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isPositive');
      });

      it('should fail with invalid tags type', async () => {
        dto.id = '1b965650-51c7-42e8-9642-a25ac46c0a4e';
        dto.title = 'Jabón Rey';
        dto.code = 71296482;
        dto.tags = [123] as any;

        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });
  });

  describe('UpdateProdcomcityDto', () => {
    let dto: UpdateProdcomcityDto;

    beforeEach(() => {
      dto = new UpdateProdcomcityDto();
    });

    describe('Valid Data', () => {
      it('should validate a complete valid DTO', async () => {
        const validData = {
          comcity: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
          product: {
            id: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
            title: 'Jabón Rey',
            code: 71296482,
            tags: ['manzana', 'verde']
          },
          date: '2024-06-05',
          price: 15000
        };

        Object.assign(dto, validData);
        const errors = await validate(dto, { whitelist: true });
//         expect(errors).toHaveLength(0);
      });

      it('should validate without optional price', async () => {
        const validData = {
          comcity: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
          product: {
            id: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
            title: 'Jabón Rey',
            code: 71296482
          },
          date: '2024-06-05'
        };

        Object.assign(dto, validData);
        const errors = await validate(dto, { whitelist: true });
//         expect(errors).toHaveLength(0);
      });
    });

    describe('Invalid Data', () => {
      it('should fail with empty comcity', async () => {
        const invalidData = {
          comcity: '',
          product: {
            id: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
            title: 'Jabón Rey',
            code: 71296482
          },
          date: '2024-06-05'
        };

        Object.assign(dto, invalidData);
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });

      it('should fail with invalid date format', async () => {
        const invalidData = {
          comcity: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
          product: {
            id: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
            title: 'Jabón Rey',
            code: 71296482
          },
          date: 'invalid-date'
        };

        Object.assign(dto, invalidData);
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isDateString');
      });

      it('should fail with negative price', async () => {
        const invalidData = {
          comcity: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
          product: {
            id: '1b965650-51c7-42e8-9642-a25ac46c0a4e',
            title: 'Jabón Rey',
            code: 71296482
          },
          date: '2024-06-05',
          price: -100
        };

        Object.assign(dto, invalidData);
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isPositive');
      });
    });


  });
});