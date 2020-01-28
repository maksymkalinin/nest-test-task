import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { OwnersModule } from './owner/owner.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { CarsModule } from './car/car.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [DatabaseModule],
    useExisting: DatabaseService
  }), OwnersModule, ManufacturerModule, CarsModule, SchedulerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
