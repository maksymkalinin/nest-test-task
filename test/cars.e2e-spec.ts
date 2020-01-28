import * as request from 'supertest';
import axios from 'axios';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseService } from '../src/database/database.service';
import { Car } from '../src/car/car.entity';
import { CarsModule } from '../src/car/car.module';
import { CreateCarDto, UpdateCarDto } from '../src/car/dto';
import { Manufacturer } from '../src/manufacturer/manufacturer.entity';
import { ManufacturerModule } from '../src/manufacturer/manufacturer.module';
import { CreateManufacturerDto } from '../src/manufacturer/dto';

describe('Cars', () => {
  let app: INestApplication;
  let manufacturer: Manufacturer;
  let manufacturer2: Manufacturer;
  let createdCar: Car;

  const createCarDto: CreateCarDto = {
    price: 1000,
    firstRegistrationDate: new Date('2019-10-10T09:09:09.999Z'),
    manufacturerId: ''
  };

  const updateCarDto: UpdateCarDto = {
    price: 500
  };

  const putCarDto: CreateCarDto = {
    price: 2000,
    firstRegistrationDate: new Date('2019-10-10T09:09:09.999Z'),
    manufacturerId: ''
  };

  const createManufacturer: CreateManufacturerDto = {
    name: 'man_name',
    phone: 'phone',
    siret: 11000011
  };

  const createManufacturer2: CreateManufacturerDto = {
    name: 'second_name',
    phone: 'new phone',
    siret: 222222
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [DatabaseModule],
          useExisting: DatabaseService
        }),
        CarsModule,
        ManufacturerModule
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const configService = app.get(ConfigService);
    const port = configService.get<string>('PORT');

    await app.listen(port);
    const url = await app.getUrl();

    const { data } = await axios.post(
      `${url}/manufacturers`,
      createManufacturer
    );
    manufacturer = data;

    const { data: data2 } = await axios.post(
      `${url}/manufacturers`,
      createManufacturer2
    );
    manufacturer2 = data2;
  });

  it('POST car', () => {
    return request(app.getHttpServer())
      .post('/cars')
      .set('Accept', 'application/json')
      .send({ ...createCarDto, manufacturerId: manufacturer.id })
      .expect(({ body }) => {
        expect(body.price).toEqual(createCarDto.price);
        expect(body.firstRegistrationDate).toEqual(
          createCarDto.firstRegistrationDate.toISOString()
        );
        expect(body.manufacturer).toMatchObject(manufacturer);
        expect(body.id).toBeDefined();
        createdCar = body;
      })
      .expect(201);
  });

  it('GET cars', () => {
    return request(app.getHttpServer())
      .get('/cars')
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0]).toMatchObject({
          price: createdCar.price,
          firstRegistrationDate: createdCar.firstRegistrationDate,
          discount: createdCar.discount,
          id: createdCar.id
        });
      })
      .expect(200);
  });

  it('GET car', () => {
    return request(app.getHttpServer())
      .get(`/cars/${createdCar.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect({
        price: createdCar.price,
        firstRegistrationDate: createdCar.firstRegistrationDate,
        discount: createdCar.discount,
        id: createdCar.id
      });
  });

  it('GET car manufacturer', () => {
    return request(app.getHttpServer())
      .get(`/cars/${createdCar.id}/manufacturer`)
      .set('Accept', 'application/json')
      .expect(manufacturer)
      .expect(200);
  });

  it('PATCH car', () => {
    return request(app.getHttpServer())
      .patch(`/cars/${createdCar.id}`)
      .set('Accept', 'application/json')
      .send(updateCarDto)
      .expect(({ body }) => {
        expect(body.price).toEqual(updateCarDto.price);
      })
      .expect(200);
  });

  it('PUT car', () => {
    return request(app.getHttpServer())
      .put(`/cars/${createdCar.id}`)
      .set('Accept', 'application/json')
      .send({ ...putCarDto, manufacturerId: manufacturer2.id })
      .expect(({ body }) => {
        expect(body.price).toEqual(putCarDto.price);
        expect(body.firstRegistrationDate).toEqual(
          putCarDto.firstRegistrationDate.toISOString()
        );
        expect(body.manufacturer).toMatchObject(manufacturer2);
        expect(body.id).toEqual(createdCar.id);
      })
      .expect(200);
  });

  it('GET car manufacturer2', () => {
    return request(app.getHttpServer())
      .get(`/cars/${createdCar.id}/manufacturer`)
      .set('Accept', 'application/json')
      .expect(manufacturer2)
      .expect(200);
  });

  it('DELETE car', () => {
    return request(app.getHttpServer())
      .delete(`/cars/${createdCar.id}`)
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        expect(body.id).toEqual(createdCar.id);
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
