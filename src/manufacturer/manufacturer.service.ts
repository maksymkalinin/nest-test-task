import { InjectRepository } from '@nestjs/typeorm';
import { UpdateManufacturerDto, CreateManufacturerDto } from './dto';
import { Injectable } from '@nestjs/common';
import { Manufacturer } from './manufacturer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturersRepository: Repository<Manufacturer>
  ) {}

  public async getAll(): Promise<Manufacturer[]> {
    return this.manufacturersRepository.find();
  }

  public async getOne(id: string): Promise<Manufacturer> {
    const manufacturer: Manufacturer = await this.manufacturersRepository.findOne(id);
    if (!manufacturer) {
      throw new Error('Not found');
    }
    return manufacturer;
  }

  public async create(data: CreateManufacturerDto): Promise<Manufacturer> {
    const createdManufacturer = this.manufacturersRepository.create(data);
    await this.manufacturersRepository.save(createdManufacturer);
    return createdManufacturer;
  }

  public async update(
    id: string,
    data: UpdateManufacturerDto
  ): Promise<Manufacturer> {
    const manufacturerToUpdate: Manufacturer = await this.manufacturersRepository.findOne(id);

    if (!manufacturerToUpdate) {
      throw new Error('Not found');
    }

    if (data.name) { manufacturerToUpdate.name = data.name; }
    if (data.phone) { manufacturerToUpdate.phone = data.phone; }
    if (data.siret) { manufacturerToUpdate.siret = data.siret; }

    await this.manufacturersRepository.save(manufacturerToUpdate);
    return manufacturerToUpdate;
  }

  public async delete(id: string): Promise<Manufacturer> {
    const manufacturerToRemove: Manufacturer = await this.manufacturersRepository.findOne(id);
    if (!manufacturerToRemove) {
      throw new Error(`Manufacturer doesn't exist`);
    }

    await this.manufacturersRepository.remove(manufacturerToRemove);
    return manufacturerToRemove;
  }
}
