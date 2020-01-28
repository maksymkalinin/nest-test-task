import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpException,
  Param,
  Body,
  NotFoundException,
  HttpCode
} from '@nestjs/common';
import { CreateManufacturerDto, UpdateManufacturerDto } from './dto';
import { Manufacturer } from './manufacturer.entity';
import { ManufacturersService } from './manufacturer.service';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get('/')
  public async getAll(): Promise<Manufacturer[]> {
    try {
      return await this.manufacturersService.getAll();
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string): Promise<Manufacturer> {
    try {
      return await this.manufacturersService.getOne(id);
    } catch (error) {
      if (error.message === 'Not found') {
        throw new NotFoundException('Manufacturer not found');
      } else {
        throw new HttpException(error.message, 422);
      }
    }
  }

  @Post('/')
  @HttpCode(200)
  public async create(
    @Body() data: CreateManufacturerDto
  ): Promise<Manufacturer> {
    try {
      return await this.manufacturersService.create(data);
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateManufacturerDto
  ): Promise<Manufacturer> {
    try {
      return await this.manufacturersService.update(id, data);
    } catch (error) {
      if (error.message === 'Not found') {
        throw new NotFoundException('Manufacturer not found');
      } else {
        throw new HttpException(error.message, 422);
      }
    }
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<{ id: string }> {
    try {
      return await this.manufacturersService.delete(id);
    } catch (error) {
      if (error.message === 'Not found') {
        throw new NotFoundException('Manufacturer not found');
      } else {
        throw new HttpException(error.message, 422);
      }
    }
  }
}
