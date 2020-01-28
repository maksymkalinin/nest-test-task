import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseService } from '../src/database/database.service';
import { Owner } from '../src/owner/owner.entity';
import { OwnersModule } from '../src/owner/owner.module';
import { CreateOwnerDto, UpdateOwnerDto } from '../src/owner/dto';

describe('Owners', () => {
  let app: INestApplication;
  let owner: Owner;

  const createOwner: CreateOwnerDto = {
    name: 'owner-name',
    purchaseDate: new Date(2020, 2, 19, 19, 19, 19)
  };

  const updateOwner: UpdateOwnerDto = {
    name: 'new owner name'
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
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST owner', () => {
    return request(app.getHttpServer())
      .post('/owners')
      .set('Accept', 'application/json')
      .send(createOwner)
      .expect(201)
      .expect(({ body }) => {
        expect(body.name).toEqual(createOwner.name);
        expect(body.purchaseDate).toEqual(
          new Date(createOwner.purchaseDate).toISOString()
        );
        expect(body.id).toBeDefined();
        owner = body;
      });
  });

  it('GET owners', () => {
    return request(app.getHttpServer())
      .get('/owners')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0]).toMatchObject(owner);
      });
  });

  it('GET owner by id', () => {
    return request(app.getHttpServer())
      .get(`/owners/${owner.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(owner);
      });
  });

  it('PATCH owner', () => {
    return request(app.getHttpServer())
      .patch(`/owners/${owner.id}`)
      .set('Accept', 'application/json')
      .send(updateOwner)
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toEqual(updateOwner.name);
        expect(body.purchaseDate).toEqual(owner.purchaseDate);
        expect(body.id).toEqual(owner.id);
      });
  });

  it('DELETE owner', () => {
    return request(app.getHttpServer())
      .delete(`/owners/${owner.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toEqual(owner.id);
      });
  });

  it('GET deleted owner', () => {
    return request(app.getHttpServer())
      .get(`/owners/${owner.id}`)
      .set('Accept', 'application/json')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
