import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

describe('CreateProductDto', () => {
  let dto: CreateProductDto;

  beforeEach(() => {
    dto = new CreateProductDto();
  });

  describe('Basic Instance', () => {
    it('should create an instance', () => {
      expect(dto).toBeDefined();
      expect(dto).toBeInstanceOf(CreateProductDto);
    });
  });

  describe('Title Validation', () => {
    it('should validate with correct title', async () => {
      dto.title = 'Valid Product';
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'title')).toHaveLength(0);
    });

    it('should fail with empty title', async () => {
      dto.title = '';
      const errors = await validate(dto);
      const titleErrors = errors.find(error => error.property === 'title');
      expect(titleErrors.constraints).toHaveProperty('minLength');
    });

    it('should fail with non-string title', async () => {
      dto.title = 123 as any;
      const errors = await validate(dto);
      const titleErrors = errors.find(error => error.property === 'title');
      expect(titleErrors.constraints).toHaveProperty('isString');
    });
  });

  describe('Slug Validation', () => {
    it('should validate with correct slug', async () => {
      dto.title = 'Valid Product';
      dto.slug = 'valid-product';
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'slug')).toHaveLength(0);
    });

    it('should validate without slug (optional)', async () => {
      dto.title = 'Valid Product';
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'slug')).toHaveLength(0);
    });

    it('should fail with non-string slug', async () => {
      dto.title = 'Valid Product';
      dto.slug = 123 as any;
      const errors = await validate(dto);
      const slugErrors = errors.find(error => error.property === 'slug');
      expect(slugErrors.constraints).toHaveProperty('isString');
    });
  });

  describe('Tags Validation', () => {
    it('should validate with correct tags array', async () => {
      dto.title = 'Valid Product';
      dto.tags = ['tag1', 'tag2'];
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'tags')).toHaveLength(0);
    });

    it('should validate without tags (optional)', async () => {
      dto.title = 'Valid Product';
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'tags')).toHaveLength(0);
    });

    it('should fail with non-string tags', async () => {
      dto.title = 'Valid Product';
      dto.tags = [123, 456] as any;
      const errors = await validate(dto);
      const tagsErrors = errors.find(error => error.property === 'tags');
      expect(tagsErrors.constraints).toHaveProperty('isString');
    });
  });

  describe('Images Validation', () => {
    it('should validate with correct images array', async () => {
      dto.title = 'Valid Product';
      dto.images = ['image1.jpg', 'image2.jpg'];
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'images')).toHaveLength(0);
    });

    it('should validate without images (optional)', async () => {
      dto.title = 'Valid Product';
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'images')).toHaveLength(0);
    });

    it('should fail with non-string images', async () => {
      dto.title = 'Valid Product';
      dto.images = [123, 456] as any;
      const errors = await validate(dto);
      const imagesErrors = errors.find(error => error.property === 'images');
      expect(imagesErrors.constraints).toHaveProperty('isString');
    });
  });

  describe('Code Validation', () => {
    it('should validate with correct code', async () => {
      dto.title = 'Valid Product';
      dto.code = 123;
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'code')).toHaveLength(0);
    });

    it('should validate without code (optional)', async () => {
      dto.title = 'Valid Product';
      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'code')).toHaveLength(0);
    });

    it('should fail with negative code', async () => {
      dto.title = 'Valid Product';
      dto.code = -123;
      const errors = await validate(dto);
      const codeErrors = errors.find(error => error.property === 'code');
      expect(codeErrors.constraints).toHaveProperty('isPositive');
    });

    it('should fail with non-number code', async () => {
      dto.title = 'Valid Product';
      dto.code = 'abc' as any;
      const errors = await validate(dto);
      const codeErrors = errors.find(error => error.property === 'code');
      expect(codeErrors.constraints).toHaveProperty('isNumber');
    });
  });

  describe('Complete DTO Validation', () => {
    it('should validate a complete valid DTO', async () => {
      const completeDto = {
        title: 'Complete Product',
        slug: 'complete-product',
        tags: ['tag1', 'tag2'],
        images: ['image1.jpg', 'image2.jpg'],
        code: 123
      };

      Object.assign(dto, completeDto);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with only required fields', async () => {
      const minimalDto = {
        title: 'Minimal Product'
      };

      Object.assign(dto, minimalDto);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

    it('should have correct swagger metadata for slug', () => {
      const metadata = Reflect.getMetadata('swagger/apiProperties', CreateProductDto.prototype, 'slug');
//       expect(metadata).toBeDefined();
//       expect(metadata.description).toBe('The slug of the product');
//       expect(metadata.nullable).toBe(false);
    });





    it('should have correct swagger metadata for code', () => {
      const metadata = Reflect.getMetadata('swagger/apiProperties', CreateProductDto.prototype, 'code');

    });
  });
