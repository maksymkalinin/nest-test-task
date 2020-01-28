import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';

import { Owner } from './owner.entity';
import { OwnersController } from './owner.controller';
import { OwnersService } from './owner.service';
import { Car } from '../car/car.entity';
import { CarsService } from '../car/car.service';
import { CreateOwnerDto, UpdateOwnerDto } from './dto';
import { FindOneOptions } from 'typeorm';

describe('OwnersController', () => {
  let ownersController: OwnersController;
  let ownersService: OwnersService;
  const carsService: Partial<CarsService> = {
    getOne: async (id: string, filters: FindOneOptions<Car> = {}) => new Car()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [OwnersController],
      providers: [
        OwnersService,
        CarsService,
        {
          provide: getRepositoryToken(Owner),
          useValue: Owner
        }
      ]
    })
      .overrideProvider(CarsService)
      .useValue(carsService)
      .compile();

    ownersController = module.get<OwnersController>(OwnersController);
    ownersService = module.get<OwnersService>(OwnersService);
  });

  describe('getAll', () => {
    it('should return an array of owners', async () => {
      const result = [new Owner()];

      jest
        .spyOn(ownersService, 'getAll')
        .mockImplementation(async () => result);

      expect(await ownersController.getAll()).toBe(result);
    });
  });

  describe('getOne', () => {
    it('should return an owner', async () => {
      const result = new Owner();
      jest
        .spyOn(ownersService, 'getOne')
        .mockImplementation(async () => result);

      expect(await ownersController.getOne(result.id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a new owner', async () => {
      const result = new Owner();
      const body: CreateOwnerDto = {
        name: 'N_A_M_E',
        purchaseDate: new Date(2020, 10, 10, 10, 10, 10)
      };

      jest
        .spyOn(ownersService, 'create')
        .mockImplementation(async () => result);

      expect(await ownersController.create(body)).toBe(result);
    });
  });

  describe('update', () => {
    it('should return updated owner', async () => {
      const result = new Owner();
      const body: UpdateOwnerDto = {
        name: 'new_name'
      };

      jest
        .spyOn(ownersService, 'update')
        .mockImplementation(async () => result);

      expect(await ownersController.update(result.id, body)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should return owner id', async () => {
      const result = { id: 'owner_id' };

      jest
        .spyOn(ownersService, 'delete')
        .mockImplementation(async () => result);

      expect(await ownersController.delete(result.id)).toBe(result);
    });
  });
});
