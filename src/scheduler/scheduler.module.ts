import { Module } from '@nestjs/common';
import { CarsModule } from '../car/car.module';
import { OwnersModule } from '../owner/owner.module';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), CarsModule, OwnersModule],
  controllers: [SchedulerController],
  providers: [SchedulerService]
})
export class SchedulerModule {}
