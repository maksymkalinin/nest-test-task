import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  NotFoundException,
  HttpCode
} from '@nestjs/common';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Car } from './car.entity';
import { CarsService } from './car.service';
import { Manufacturer } from '../manufacturer/manufacturer.entity';

@Controller('/cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('/')
  public async getAll(): Promise<Car[]> {
    try {
      return await this.carsService.getAll();
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string): Promise<Car> {
    try {
      return await this.carsService.getOne(id);
    } catch (error) {
      if (error.message === 'Not found') {
        throw new NotFoundException('Car not found!');
      } else {
        throw new HttpException(error, 422);
      }
    }
  }

  @Get('/:id/manufacturer')
  public async getManufacturer(@Param('id') id: string): Promise<Manufacturer> {
    try {
      return await this.carsService.getManufacturer(id);
    } catch (error) {
      if (error.message === 'Not found') {
        throw new NotFoundException('Car not found!');
      } else {
        throw new HttpException(error, 422);
      }
    }
  }

  @Post('/')
  @HttpCode(200)
  public async create(@Body() data: CreateCarDto): Promise<Car> {
    try {
      return await this.carsService.create(data);
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }

  @Put('/:id')
  public async put(
    @Param('id') id: string,
    @Body() data: CreateCarDto
  ): Promise<Car> {
    try {
      return await this.carsService.put(id, data);
    } catch (error) {
      if (error.message === 'Not found') {
        throw new NotFoundException('Car not found!');
      } else {
        throw new HttpException(error, 422);
      }
    }
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateCarDto
  ): Promise<Car> {
    try {
      return await this.carsService.update(id, data);
    } catch (error) {
      if (error.message === 'Not found') {
        throw new NotFoundException('Car not found!');
      } else {
        throw new HttpException(error, 422);
      }
    }
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<{ id: string }> {
    try {
      return await this.carsService.delete(id);
    } catch (error) {
      if (error.message === 'Not found') {
        throw new NotFoundException('Car not found!');
      } else {
        throw new HttpException(error, 422);
      }
    }
  }
}
