import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseService } from '../src/database/database.service';
import { CarsModule } from '../src/car/car.module';
import { CarsService } from '../src/car/car.service';
import { CreateCarDto, UpdateCarDto } from '../src/car/dto';
import { CreateManufacturerDto } from '../src/manufacturer/dto';

export default () => {
  let app: INestApplication;

  const createCar: CreateCarDto = {
    price: 1000,
    firstRegistrationDate: new Date('2019-10-10T09:09:09.999Z'),
    manufacturerId: ''
  };

  const updateCar: UpdateCarDto = {
    price: 500
  };

  const putCar: CreateCarDto = {
    price: 2000,
    firstRegistrationDate: new Date('2018-10-10T09:09:09.999Z'),
    manufacturerId: ''
  };

  const manufacturer: CreateManufacturerDto = {
    name: 'man_name',
    phone: 'phone',
    siret: 11000011
  };

  const car = {
    ...createCar,
    id: 'car_id'
  };

  const carsService = {
    getAll: () => [car],
    getOne: () => car,
    getManufacturer: () => manufacturer,
    create: () => car,
    update: () => ({ ...car, ...updateCar }),
    put: () => ({ ...car, ...putCar }),
    delete: () => ({ id: car.id })
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [DatabaseModule],
          useExisting: DatabaseService
        }),
        CarsModule
      ],
      providers: [CarsService]
    })
      .overrideProvider(CarsService)
      .useValue(carsService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST car', () => {
    const expectedRes = JSON.parse(JSON.stringify(carsService.create()));

    return request(app.getHttpServer())
      .post('/cars')
      .set('Accept', 'application/json')
      .send({ ...createCar })
      .expect(200, expectedRes);
  });

  it('GET cars', () => {
    const expectedRes = JSON.parse(JSON.stringify(carsService.getAll()));

    return request(app.getHttpServer())
      .get('/cars')
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body).toMatchObject(expectedRes);
      })
      .expect(200);
  });

  it('GET car', () => {
    const expectedRes = JSON.parse(JSON.stringify(carsService.getOne()));

    return request(app.getHttpServer())
      .get(`/cars/${car.id}`)
      .set('Accept', 'application/json')
      .expect(200, expectedRes);
  });

  it('GET car manufacturer', () => {
    return request(app.getHttpServer())
      .get(`/cars/${car.id}/manufacturer`)
      .set('Accept', 'application/json')
      .expect(200, carsService.getManufacturer());
  });

  it('PATCH car', () => {
    const expectedRes = JSON.parse(JSON.stringify(carsService.update()));

    return request(app.getHttpServer())
      .patch(`/cars/${car.id}`)
      .set('Accept', 'application/json')
      .send(updateCar)
      .expect(expectedRes)
      .expect(200);
  });

  it('PUT car', () => {
    const expectedRes = JSON.parse(JSON.stringify(carsService.put()));

    return request(app.getHttpServer())
      .put(`/cars/${car.id}`)
      .set('Accept', 'application/json')
      .send({ ...putCar })
      .expect(200, expectedRes);
  });

  it('DELETE car', () => {
    return request(app.getHttpServer())
      .delete(`/cars/${car.id}`)
      .set('Accept', 'application/json')
      .expect(200, carsService.delete());
  });

  afterAll(async () => {
    await app.close();
  });
};
