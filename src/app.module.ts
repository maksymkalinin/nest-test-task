import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { OwnersModule } from './owner/owner.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { CarsModule } from './car/car.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [TypeOrmModule.forRoot(), OwnersModule, ManufacturerModule, CarsModule, SchedulerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
