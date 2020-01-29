import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindConditions,
  In
} from 'typeorm';

import { Car } from './car.entity';
import { CreateCarDto, UpdateCarDto } from './dto';

import { ManufacturersService } from '../manufacturer/manufacturer.service';
import { OwnersService } from './../owner/owner.service';
import { Manufacturer } from '../manufacturer/manufacturer.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @Inject(ManufacturersService)
    private readonly manufacturersService: ManufacturersService,
    @Inject(forwardRef(() => OwnersService))
    private readonly ownerService: OwnersService
  ) {}

  public async getAll(filters: FindManyOptions<Car> = {}): Promise<Car[]> {
    return this.carRepository.find(filters);
  }

  public async getOne(
    id: string,
    filters: FindOneOptions<Car> = {}
  ): Promise<Car> {
    const car: Car = await this.carRepository.findOne(id, filters);
    if (!car) {
      throw new Error('Car not found');
    }
    return car;
  }

  public async getManufacturer(carId: string): Promise<Manufacturer> {
    const car: Car = await this.carRepository.findOne(carId, {
      relations: ['manufacturer']
    });
    if (!car) {
      throw new Error('Car not found');
    }
    return car.manufacturer;
  }

  public async create(data: CreateCarDto): Promise<Car> {
    const carData: Partial<Car> = {
      price: data.price,
      firstRegistrationDate: data.firstRegistrationDate,
      manufacturer: await this.manufacturersService.getOne(data.manufacturerId)
    };
    if (data.ownerIds && data.ownerIds.length) {
      carData.owners = await this.ownerService.getAll({
        where: { id: In(data.ownerIds) }
      });
    }
    const createdCar: Car = this.carRepository.create(carData);
    await this.carRepository.save(createdCar);
    return createdCar;
  }

  public async update(id: string, data: UpdateCarDto): Promise<Car> {
    const carToUpdate: Car = await this.carRepository.findOne(id);

    if (!carToUpdate) {
      throw new Error('Car not found');
    }

    if (data.price) {
      carToUpdate.price = data.price;
    }
    if (data.firstRegistrationDate) {
      carToUpdate.firstRegistrationDate = data.firstRegistrationDate;
    }

    if (data.manufacturerId) {
      carToUpdate.manufacturer = await this.manufacturersService.getOne(
        data.manufacturerId
      );
    }

    if (data.ownerIds) {
      carToUpdate.owners = await this.ownerService.getAllByIds(data.ownerIds);
    }

    await this.carRepository.save(carToUpdate);
    return carToUpdate;
  }

  public async put(id: string, data: CreateCarDto): Promise<Car> {
    const carToUpdate: Car = await this.carRepository.findOne(id);

    if (!carToUpdate) {
      throw new Error('Car not found');
    }

    carToUpdate.price = data.price;
    carToUpdate.firstRegistrationDate = data.firstRegistrationDate;
    carToUpdate.manufacturer = null;
    carToUpdate.owners = null;

    if (data.manufacturerId) {
      carToUpdate.manufacturer = await this.manufacturersService.getOne(
        data.manufacturerId
      );
    }

    if (data.ownerIds) {
      carToUpdate.owners = await this.ownerService.getAllByIds(data.ownerIds);
    }

    await this.carRepository.save(carToUpdate);
    return carToUpdate;
  }

  public async updateMany(
    filters: FindConditions<Car>,
    data: UpdateCarDto
  ): Promise<Car[]> {
    const dataToUpdate: Partial<Car> = {};

    if (data.hasOwnProperty('price')) {
      dataToUpdate.price = data.price;
    }
    if (data.firstRegistrationDate) {
      dataToUpdate.firstRegistrationDate = data.firstRegistrationDate;
    }
    if (data.discount) {
      dataToUpdate.discount = data.discount;
    }
    if (data.manufacturerId) {
      dataToUpdate.manufacturer = await this.manufacturersService.getOne(
        data.manufacturerId
      );
    }
    if (data.ownerIds) {
      dataToUpdate.owners = await this.ownerService.getAllByIds(data.ownerIds);
    }

    await this.carRepository.update(filters, dataToUpdate);
    return await this.carRepository.find(filters);
  }

  public async delete(id: string): Promise<{ id: string }> {
    const carToRemove = await this.carRepository.findOne(id);
    if (!carToRemove) {
      throw new Error('Car not found');
    }
    await this.carRepository.remove(carToRemove);
    return { id };
  }
}
