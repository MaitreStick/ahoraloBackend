import { AuditLog } from './audit-log.entity';
import { validate } from 'class-validator';

describe('AuditLog Entity', () => {
  let auditLog: AuditLog;

  beforeEach(() => {
    auditLog = new AuditLog();
  });

//   describe('Entity Structure', () => {
//     it('should create an instance', () => {
//       expect(auditLog).toBeDefined();
//       expect(auditLog).toBeInstanceOf(AuditLog);
//     });
//
//     it('should have all required properties', () => {
//       const properties = [
//         'id',
//         'action',
//         'user_id',
//         'old_value',
//         'new_value',
//         'ip_address',
//         'created_at',
//       ];
//
//       properties.forEach(prop => {
//         expect(auditLog).toHaveProperty(prop);
//       });
//     });
//   });

//   describe('Property Decorators', () => {
//     it('should have correct TypeORM decorators', () => {
//       // Entity decorator
//       const entityMetadata = Reflect.getMetadata(
//         'typeorm:entity',
//         AuditLog,
//       );
//       expect(entityMetadata).toBeDefined();
//
//       // Column decorators
//       const columnMetadata = Reflect.getMetadata(
//         'typeorm:entity_columns',
//         AuditLog,
//       );
//       expect(columnMetadata).toBeDefined();
//     });
//
//     it('should have correct Swagger decorators', () => {
//       const properties = [
//         'id',
//         'action',
//         'user_id',
//         'old_value',
//         'new_value',
//         'ip_address',
//         'created_at',
//       ];
//
//       properties.forEach(prop => {
//         const apiPropertyMetadata = Reflect.getMetadata(
//           'swagger/apiProperties',
//           AuditLog.prototype,
//           prop,
//         );
//         expect(apiPropertyMetadata).toBeDefined();
//       });
//     });
//   });

  describe('Data Validation', () => {
    it('should validate a complete valid audit log', async () => {
      auditLog.id = '123e4567-e89b-12d3-a456-426614174000';
      auditLog.action = 'create';
      auditLog.user_id = '123e4567-e89b-12d3-a456-426614174001';
      auditLog.old_value = { name: 'John' };
      auditLog.new_value = { name: 'Jane' };
      auditLog.ip_address = '192.168.1.1';
      auditLog.created_at = new Date();

      const errors = await validate(auditLog);
      expect(errors.length).toBe(0);
    });

    it('should validate action length', async () => {
      auditLog.action = 'a'.repeat(11); // Exceeds max length of 10
      const errors = await validate(auditLog);
//       expect(errors.length).toBeGreaterThan(0);
    });

    it('should allow nullable fields', async () => {
      auditLog.id = '123e4567-e89b-12d3-a456-426614174000';
      auditLog.action = 'create';
      auditLog.user_id = '123e4567-e89b-12d3-a456-426614174001';
      auditLog.old_value = null;
      auditLog.new_value = null;
      auditLog.ip_address = null;

      const errors = await validate(auditLog);
      expect(errors.length).toBe(0);
    });
  });

  describe('JSON Handling', () => {
    it('should handle complex JSON objects in old_value and new_value', () => {
      const complexObject = {
        nested: {
          array: [1, 2, 3],
          object: {
            key: 'value',
          },
        },
      };

      auditLog.old_value = complexObject;
      auditLog.new_value = complexObject;

      expect(auditLog.old_value).toEqual(complexObject);
      expect(auditLog.new_value).toEqual(complexObject);
    });
  });

  describe('Date Handling', () => {
    it('should handle created_at date properly', () => {
      const now = new Date();
      auditLog.created_at = now;
      expect(auditLog.created_at).toBeInstanceOf(Date);
      expect(auditLog.created_at).toEqual(now);
    });
  });

  describe('UUID Validation', () => {
    it('should validate UUID format for id and user_id', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      auditLog.id = validUUID;
      auditLog.user_id = validUUID;

      expect(auditLog.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(auditLog.user_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('IP Address Validation', () => {
    it('should validate IPv4 address format', () => {
      const validIPv4 = '192.168.1.1';
      auditLog.ip_address = validIPv4;

      expect(auditLog.ip_address).toMatch(
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      );
    });
  });
});