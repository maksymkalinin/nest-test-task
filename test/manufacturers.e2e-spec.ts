import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseService } from '../src/database/database.service';
import { Manufacturer } from '../src/manufacturer/manufacturer.entity';
import { ManufacturerModule } from '../src/manufacturer/manufacturer.module';
import {
  CreateManufacturerDto,
  UpdateManufacturerDto
} from '../src/manufacturer/dto';

describe('Manufacturers', () => {
  let app: INestApplication;
  let manufacturer: Manufacturer;

  const createManufacturer: CreateManufacturerDto = {
    name: 'man_name',
    phone: 'phone',
    siret: 11000011
  };

  const updateManufacturer: UpdateManufacturerDto = {
    name: 'second_name',
    phone: 'new phone'
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
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST manufacturers', () => {
    return request(app.getHttpServer())
      .post('/manufacturers')
      .set('Accept', 'application/json')
      .send(createManufacturer)
      .expect(201)
      .expect(({ body }) => {
        expect(body.name).toEqual(createManufacturer.name);
        expect(body.phone).toEqual(createManufacturer.phone);
        expect(body.siret).toEqual(createManufacturer.siret);
        expect(body.id).toBeDefined();
        manufacturer = body;
      });
  });

  it('GET manufacturers', () => {
    return request(app.getHttpServer())
      .get('/manufacturers')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0]).toMatchObject(manufacturer);
      });
  });

  it('GET manufacturer', () => {
    return request(app.getHttpServer())
      .get(`/manufacturers/${manufacturer.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(manufacturer);
      });
  });

  it('PATCH manufacturer', () => {
    return request(app.getHttpServer())
      .patch(`/manufacturers/${manufacturer.id}`)
      .set('Accept', 'application/json')
      .send(updateManufacturer)
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toEqual(updateManufacturer.name);
        expect(body.phone).toEqual(updateManufacturer.phone);
        expect(body.siret).toEqual(manufacturer.siret);
        expect(body.id).toEqual(manufacturer.id);
      });
  });

  it('DELETE manufacturer', () => {
    return request(app.getHttpServer())
      .delete(`/manufacturers/${manufacturer.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toEqual(manufacturer.id);
      });
  });

  it('GET deleted manufacturer', () => {
    return request(app.getHttpServer())
      .get(`/manufacturers/${manufacturer.id}`)
      .set('Accept', 'application/json')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
