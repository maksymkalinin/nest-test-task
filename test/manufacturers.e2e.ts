import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseService } from '../src/database/database.service';
import { ManufacturerModule } from '../src/manufacturer/manufacturer.module';
import {
  CreateManufacturerDto,
  UpdateManufacturerDto
} from '../src/manufacturer/dto';
import { ManufacturersService } from '../src/manufacturer/manufacturer.service';

export default () => {
  let app: INestApplication;

  const createManufacturer: CreateManufacturerDto = {
    name: 'man_name',
    phone: 'phone',
    siret: 11000011
  };

  const updateManufacturer: UpdateManufacturerDto = {
    name: 'second_name',
    phone: 'new phone'
  };

  const manufacturer = {
    ...createManufacturer,
    id: 'manufacturer_id'
  };

  const manufacturersService = {
    getAll: () => [manufacturer],
    getOne: () => manufacturer,
    create: () => manufacturer,
    update: () => ({ ...manufacturer, ...updateManufacturer }),
    delete: () => ({ id: manufacturer.id })
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [DatabaseModule],
          useExisting: DatabaseService
        }),
        ManufacturerModule
      ]
    })
      .overrideProvider(ManufacturersService)
      .useValue(manufacturersService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST manufacturers', () => {
    return request(app.getHttpServer())
      .post('/manufacturers')
      .set('Accept', 'application/json')
      .send(createManufacturer)
      .expect(200, manufacturersService.create());
  });

  it('GET manufacturers', () => {
    return request(app.getHttpServer())
      .get('/manufacturers')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body).toMatchObject(manufacturersService.getAll());
      });
  });

  it('GET manufacturer', () => {
    return request(app.getHttpServer())
      .get(`/manufacturers/${manufacturer.id}`)
      .set('Accept', 'application/json')
      .expect(200, manufacturersService.getOne());
  });

  it('PATCH manufacturer', () => {
    return request(app.getHttpServer())
      .patch(`/manufacturers/${manufacturer.id}`)
      .set('Accept', 'application/json')
      .send(updateManufacturer)
      .expect(200, manufacturersService.update());
  });

  it('DELETE manufacturer', () => {
    return request(app.getHttpServer())
      .delete(`/manufacturers/${manufacturer.id}`)
      .set('Accept', 'application/json')
      .expect(200, manufacturersService.delete());
  });

  afterAll(async () => {
    await app.close();
  });
};
