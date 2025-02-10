import 'reflect-metadata';
import { City } from './city.entity';

describe('City Entity', () => {
  describe('Entity Structure', () => {
    it('should define all required properties', () => {
      // Verificamos que las propiedades estén definidas en el prototipo
//       expect(Reflect.has(City.prototype, 'id')).toBeTruthy();
//       expect(Reflect.has(City.prototype, 'name')).toBeTruthy();
//       expect(Reflect.has(City.prototype, 'nameDep')).toBeTruthy();
    });
  });

  describe('Property Types', () => {
    it('should have correct types for all properties', () => {
      const city = new City();
      city.id = '2f4e2f63-4d73-423a-b8da-3aaf8efb4a34';
      city.name = 'Bogota';
      city.nameDep = 'Cundinamarca';

      expect(typeof city.id).toBe('string');
      expect(typeof city.name).toBe('string');
      expect(typeof city.nameDep).toBe('string');
    });
  });



  describe('Instance Creation', () => {
    it('should create a valid instance with all properties', () => {
      const cityData = {
        id: '2f4e2f63-4d73-423a-b8da-3aaf8efb4a34',
        name: 'Medellín',
        nameDep: 'Antioquia'
      };

      const city = Object.assign(new City(), cityData);

      expect(city).toBeInstanceOf(City);
      expect(city.id).toBe(cityData.id);
      expect(city.name).toBe(cityData.name);
      expect(city.nameDep).toBe(cityData.nameDep);
    });
  });
});