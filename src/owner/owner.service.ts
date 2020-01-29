import { CarsService } from './../car/car.service';
import { UpdateOwnerDto, CreateOwnerDto } from './dto';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Owner } from './owner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindConditions } from 'typeorm';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
    @Inject(forwardRef(() => CarsService))
    private readonly carsService: CarsService
  ) {}

  public async getAll(filters?: FindManyOptions): Promise<Owner[]> {
    return await this.ownerRepository.find(filters);
  }

  public async getAllByIds(ids: string[]): Promise<Owner[]> {
    return await this.ownerRepository.findByIds(ids);
  }

  public async getOne(id: string): Promise<Owner> {
    const owner = await this.ownerRepository.findOne(id);
    if (!owner) {
      throw new Error('Owner not found');
    }
    return owner;
  }

  public async create(data: CreateOwnerDto): Promise<Owner> {
    const owner = this.ownerRepository.create(data);
    return this.ownerRepository.save(owner);
  }

  public async update(id: string, data: UpdateOwnerDto): Promise<Owner> {
    const ownerToUpdate: Owner = await this.ownerRepository.findOne(id);

    if (!ownerToUpdate) {
      throw new Error('Owner not found');
    }

    if (data.name) { ownerToUpdate.name = data.name; }
    if (data.purchaseDate) { ownerToUpdate.purchaseDate = data.purchaseDate; }
    if (data.carId) { ownerToUpdate.car = await this.carsService.getOne(data.carId, { relations: [] }); }

    await this.ownerRepository.save(ownerToUpdate);

    return ownerToUpdate;
  }

  public async updateMany(filters: FindConditions<Owner>, data: UpdateOwnerDto): Promise<Owner[]> {
    const dataToUpdate: Partial<Owner> = {};

    if (data.name) { dataToUpdate.name = data.name; }
    if (data.purchaseDate) { dataToUpdate.purchaseDate = data.purchaseDate; }
    if (data.carId) { dataToUpdate.car = await this.carsService.getOne(data.carId); }

    await this.ownerRepository.update(filters, dataToUpdate);

    return this.ownerRepository.find(filters);
  }

  public async delete(id: string): Promise<{ id: string }> {
    const ownerToDelete = await this.ownerRepository.findOne(id);
    if (!ownerToDelete) {
      throw new Error('Owner not found');
    }
    await this.ownerRepository.delete(id);
    return { id };
  }

  public async deleteMany(filters?: FindConditions<Owner>): Promise<Owner[]> {
    const ownersToDelete = await this.ownerRepository.find(filters);
    await this.ownerRepository.delete(filters);
    return ownersToDelete;
  }
}
