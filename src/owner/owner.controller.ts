import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpException,
  NotFoundException,
  HttpCode
} from '@nestjs/common';
import { OwnersService } from './owner.service';
import { Owner } from './owner.entity';
import { CreateOwnerDto, UpdateOwnerDto } from './dto';

@Controller('/owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Get('/')
  public async getAll(): Promise<Owner[]> {
    try {
      return await this.ownersService.getAll();
    } catch (error) {
      throw new HttpException(error.message, 422);
    }
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string): Promise<Owner> {
    try {
      return await this.ownersService.getOne(id);
    } catch (error) {
      if (error.message === 'Owner not found') {
        throw new NotFoundException('Owner not found');
      }
      throw new HttpException(error.message, 422);
    }
  }

  @Post('/')
  @HttpCode(200)
  public async create(@Body() data: CreateOwnerDto): Promise<Owner> {
    try {
      return await this.ownersService.create(data);
    } catch (error) {
      throw new HttpException(error.message, 422);
    }
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateOwnerDto
  ): Promise<Owner> {
    try {
      return await this.ownersService.update(id, data);
    } catch (error) {
      if (error.message === 'Owner not found') {
        throw new NotFoundException('Owner not found');
      }
      throw new HttpException(error.message, 422);
    }
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<{ id: string }> {
    try {
      return await this.ownersService.delete(id);
    } catch (error) {
      if (error.message === 'Owner not found') {
        throw new NotFoundException('Owner not found');
      }
      throw new HttpException(error.message, 422);
    }
  }
}
