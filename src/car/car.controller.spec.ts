import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Car } from './car.entity';
import { CarsController } from './car.controller';
import { CarsService } from './car.service';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Owner } from '../owner/owner.entity';
import { OwnersService } from '../owner/owner.service';
import { Manufacturer } from '../manufacturer/manufacturer.entity';
import { ManufacturersService } from '../manufacturer/manufacturer.service';

describe('CarsController', () => {
  let carsController: CarsController;
  let carsService: CarsService;
  const manufacturerService: Partial<ManufacturersService> = {
    getOne: async () => new Manufacturer()
  };
  const ownersService: Partial<OwnersService> = {
    getAll: async () => [new Owner()],
    getAllByIds: async () => [new Owner()]
  };

  const carId = new Car().id;
  const createBody: CreateCarDto = {
    price: 5000,
    firstRegistrationDate: new Date(2019, 1, 1, 1, 1, 1),
    manufacturerId: new Manufacturer().id
  };
  const updateBody: UpdateCarDto = {
    price: 10000,
    firstRegistrationDate: new Date(2020, 2, 2, 2, 2, 2),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        CarsService,
        OwnersService,
        ManufacturersService,
        {
          provide: getRepositoryToken(Car),
          useClass: Car
        }
      ]
    })
    .overrideProvider(OwnersService)
    .useValue(ownersService)
    .overrideProvider(ManufacturersService)
    .useValue(manufacturerService)
    .compile();

    carsController = module.get<CarsController>(CarsController);
    carsService = module.get<CarsService>(CarsService);
  });

  describe('getAll', () => {
    it('should return an array of cars', async () => {
      const result: Car[] = [new Car()];

      jest.spyOn(carsService, 'getAll').mockImplementation(async () => result);

      expect(await carsController.getAll()).toBe(result);
    });
  });

  describe('getOne', () => {
    it('should return a car', async () => {
      const result: Car = new Car();

      jest.spyOn(carsService, 'getOne').mockImplementation(async () => result);

      expect(await carsController.getOne(carId)).toBe(result);
    });
  });

  describe('getManufacturer', () => {
    it('should return a manufacturer', async () => {
      const result: Manufacturer = new Manufacturer();

      jest.spyOn(carsService, 'getManufacturer').mockImplementation(async () => result);

      expect(await carsController.getManufacturer(carId)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a car', async () => {
      const result: Car = new Car();

      jest.spyOn(carsService, 'create').mockImplementation(async () => result);

      expect(await carsController.create(createBody)).toBe(result);
    });
  });

  describe('update', () => {
    it('should return a car', async () => {
      const result: Car = new Car();

      jest.spyOn(carsService, 'update').mockImplementation(async () => result);

      expect(await carsController.update(carId, updateBody)).toBe(result);
    });
  });

  describe('put', () => {
    it('should return a car', async () => {
      const result: Car = new Car();

      jest.spyOn(carsService, 'put').mockImplementation(async () => result);

      expect(await carsController.put(carId, createBody)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should return a car', async () => {
      const result = { id: 'string' };

      jest.spyOn(carsService, 'delete').mockImplementation(async () => result);

      expect(await carsController.delete(carId)).toBe(result);
    });
  });
});
