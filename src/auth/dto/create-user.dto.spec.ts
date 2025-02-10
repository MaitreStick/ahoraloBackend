import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
  });

  describe('Basic Validation', () => {
    it('should create an instance', () => {
      expect(dto).toBeDefined();
      expect(dto).toBeInstanceOf(CreateUserDto);
    });

    it('should validate a correct DTO', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'Jane123';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email format', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'Jane123';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'email')).toHaveLength(0);
    });

    it('should fail with invalid email format', async () => {
      dto.email = 'invalid-email';
      dto.password = 'Jane123';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      const emailErrors = errors.find(error => error.property === 'email');
      expect(emailErrors.constraints).toHaveProperty('isEmail');
    });

    it('should fail with non-string email', async () => {
      dto.email = 123 as any;
      dto.password = 'Jane123';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      const emailErrors = errors.find(error => error.property === 'email');
      expect(emailErrors.constraints).toHaveProperty('isString');
    });
  });

  describe('Password Validation', () => {
    it('should validate correct password format', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'Jane123';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'password')).toHaveLength(0);
    });

    it('should fail with password too short', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'Ja1';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      const passwordErrors = errors.find(error => error.property === 'password');
      expect(passwordErrors.constraints).toHaveProperty('minLength');
    });

    it('should fail with password too long', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'J1' + 'a'.repeat(49);
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      const passwordErrors = errors.find(error => error.property === 'password');
      expect(passwordErrors.constraints).toHaveProperty('maxLength');
    });

    it('should fail without uppercase letter', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'jane123';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      const passwordErrors = errors.find(error => error.property === 'password');
      expect(passwordErrors.constraints).toHaveProperty('matches');
    });

    it('should fail without lowercase letter', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'JANE123';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      const passwordErrors = errors.find(error => error.property === 'password');
      expect(passwordErrors.constraints).toHaveProperty('matches');
    });

    it('should fail without number', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'JaneDoe';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      const passwordErrors = errors.find(error => error.property === 'password');
      expect(passwordErrors.constraints).toHaveProperty('matches');
    });
  });

  describe('FullName Validation', () => {
    it('should validate correct fullName', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'Jane123';
      dto.fullName = 'Jane Doe';

      const errors = await validate(dto);
      expect(errors.filter(error => error.property === 'fullName')).toHaveLength(0);
    });

    it('should fail with empty fullName', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'Jane123';
      dto.fullName = '';

      const errors = await validate(dto);
      const fullNameErrors = errors.find(error => error.property === 'fullName');
      expect(fullNameErrors.constraints).toHaveProperty('minLength');
    });

    it('should fail with non-string fullName', async () => {
      dto.email = 'janedoe@gmail.com';
      dto.password = 'Jane123';
      dto.fullName = 123 as any;

      const errors = await validate(dto);
      const fullNameErrors = errors.find(error => error.property === 'fullName');
      expect(fullNameErrors.constraints).toHaveProperty('isString');
    });
  });


  describe('Complete Validation Scenarios', () => {
    it('should validate multiple valid password formats', async () => {
      const validPasswords = [
        'Jane123',
        'Password1',
        'Complex123Password',
        'Abcd1234',
        'Test123Test'
      ];

      for (const password of validPasswords) {
        dto.email = 'janedoe@gmail.com';
        dto.password = password;
        dto.fullName = 'Jane Doe';

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should validate multiple valid email formats', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+label@domain.com',
        'user@subdomain.domain.com',
        'user@domain.co.uk'
      ];

      for (const email of validEmails) {
        dto.email = email;
        dto.password = 'Jane123';
        dto.fullName = 'Jane Doe';

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
  });
});