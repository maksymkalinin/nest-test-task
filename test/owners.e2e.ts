import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseService } from '../src/database/database.service';
import { OwnersModule } from '../src/owner/owner.module';
import { CreateOwnerDto, UpdateOwnerDto } from '../src/owner/dto';
import { OwnersService } from '../src/owner/owner.service';

export default () => {
  let app: INestApplication;

  const createOwner: CreateOwnerDto = {
    name: 'owner-name',
    purchaseDate: new Date(2020, 2, 19, 19, 19, 19)
  };

  const updateOwner: UpdateOwnerDto = {
    name: 'new owner name'
  };

  const owner = {
    ...createOwner,
    id: 'owner_id'
  };

  const ownersService = {
    getAll: () => [owner],
    getOne: () => owner,
    create: () => owner,
    update: () => ({ ...owner, updateOwner }),
    delete: () => owner.id
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [DatabaseModule],
          useExisting: DatabaseService
        }),
        OwnersModule
      ]
    })
      .overrideProvider(OwnersService)
      .useValue(ownersService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST owner', () => {
    const expectedResult = JSON.parse(JSON.stringify(ownersService.create()));

    return request(app.getHttpServer())
      .post('/owners')
      .set('Accept', 'application/json')
      .send(createOwner)
      .expect(200, expectedResult);
  });

  it('GET owners', () => {
    const expectedResult = JSON.parse(JSON.stringify(ownersService.getAll()));

    return request(app.getHttpServer())
      .get('/owners')
      .set('Accept', 'application/json')
      .expect(200, expectedResult);
  });

  it('GET owner by id', () => {
    const expectedResult = JSON.parse(JSON.stringify(ownersService.getOne()));

    return request(app.getHttpServer())
      .get(`/owners/${owner.id}`)
      .set('Accept', 'application/json')
      .expect(200, expectedResult);
  });

  it('PATCH owner', () => {
    const expectedResult = JSON.parse(JSON.stringify(ownersService.update()));

    return request(app.getHttpServer())
      .patch(`/owners/${owner.id}`)
      .set('Accept', 'application/json')
      .send(updateOwner)
      .expect(200, expectedResult);
  });

  it('DELETE owner', () => {
    const expectedResult = JSON.parse(JSON.stringify(ownersService.delete()));

    return request(app.getHttpServer())
      .delete(`/owners/${owner.id}`)
      .set('Accept', 'application/json')
      .expect(200, expectedResult);
  });

  afterAll(async () => {
    await app.close();
  });
};
