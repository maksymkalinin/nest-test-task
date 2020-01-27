import { Module, forwardRef } from '@nestjs/common';
import { OwnersService } from './owner.service';
import { OwnersController } from './owner.controller';
import { Owner as OwnerRepository } from './owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from '../car/car.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OwnerRepository]),
    forwardRef(() => CarsModule)
  ],
  controllers: [OwnersController],
  providers: [OwnersService],
  exports: [OwnersService]
})
export class OwnersModule {}
