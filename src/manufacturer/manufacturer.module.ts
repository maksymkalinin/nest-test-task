import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer as ManufacturerRepository } from './manufacturer.entity';
import { ManufacturersController } from './manufacturer.controller';
import { ManufacturersService } from './manufacturer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ManufacturerRepository])],
  providers: [ManufacturersService],
  controllers: [ManufacturersController],
  exports: [
    ManufacturersService
  ]
})
export class ManufacturerModule {}
