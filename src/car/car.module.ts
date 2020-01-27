import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car as CarRepository } from './car.entity';
import { CarsService } from './car.service';
import { CarsController } from './car.controller';
import { OwnersModule } from '../owner/owner.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarRepository]),
    forwardRef(() => OwnersModule),
    ManufacturerModule
  ],
  providers: [CarsService],
  controllers: [CarsController],
  exports: [CarsService]
})
export class CarsModule {}
