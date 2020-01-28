import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Manufacturer } from './manufacturer.entity';
import { ManufacturersController } from './manufacturer.controller';
import { ManufacturersService } from './manufacturer.service';
import { CreateManufacturerDto, UpdateManufacturerDto } from './dto';

describe('ManufacturersModule', () => {
  let manufacturersController: ManufacturersController;
  let manufacturersService: ManufacturersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ManufacturersController],
      providers: [
        ManufacturersService,
        {
          provide: getRepositoryToken(Manufacturer),
          useClass: Manufacturer
        }
      ]
    }).compile();

    manufacturersController = module.get<ManufacturersController>(
      ManufacturersController
    );
    manufacturersService = module.get<ManufacturersService>(
      ManufacturersService
    );
  });

  describe('getAll', () => {
    it('should return an array of manufacturers', async () => {
      const result: Manufacturer[] = [new Manufacturer()];

      jest
        .spyOn(manufacturersService, 'getAll')
        .mockImplementation(async () => result);

      expect(await manufacturersController.getAll()).toBe(result);
    });
  });

  describe('getOne', () => {
    it('should return manufacturer', async () => {
      const result: Manufacturer = new Manufacturer();

      jest
        .spyOn(manufacturersService, 'getOne')
        .mockImplementation(async () => result);

      expect(await manufacturersController.getOne(result.id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return created manufacturer', async () => {
      const result: Manufacturer = new Manufacturer();
      const body: CreateManufacturerDto = {
        name: 'name',
        phone: '999-999-99-99',
        siret: 11001100110011
      };

      jest
        .spyOn(manufacturersService, 'create')
        .mockImplementation(async () => result);

      expect(await manufacturersController.create(body)).toBe(result);
    });
  });

  describe('update', () => {
    it('should return updated manufacturer', async () => {
      const result: Manufacturer = new Manufacturer();
      const body: UpdateManufacturerDto = {
        name: 'new-name'
      };

      jest
        .spyOn(manufacturersService, 'update')
        .mockImplementation(async () => result);

      expect(await manufacturersController.update(result.id, body)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should return deleted manufacturer id', async () => {
      const result = { id: 'manuf_id' };

      jest
        .spyOn(manufacturersService, 'delete')
        .mockImplementation(async () => result);

      expect(await manufacturersController.delete(result.id)).toBe(result);
    });
  });
});
