import { CarsService } from '../car/car.service';
import { OwnersService } from '../owner/owner.service';
import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { LessThan, Between } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject(CarsService)
    private readonly carsService: CarsService,
    @Inject(OwnersService)
    private readonly ownersService: OwnersService,
    private readonly scheduler: SchedulerRegistry
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'discountCars'
  })
  public async handleDiscountCars() {
    const monthAgo12 = moment()
      .subtract(12, 'month')
      .toDate();
    const monthAgo18 = moment()
      .subtract(18, 'month')
      .toDate();
    const cars = await this.carsService.updateMany({
      firstRegistrationDate: Between<Date>(monthAgo18, monthAgo12)
    }, {
      discount: 20
    });
    return cars;
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'removeOwners'
  })
  public async handleRemoveOwners() {
    const monthAgo18 = moment()
      .subtract(18, 'month')
      .toDate();
    const owners = await this.ownersService.deleteMany({
      purchaseDate: LessThan(monthAgo18)
    });
    return owners;
  }

  public async handleStart() {
    const discountCarsCron = this.scheduler.getCronJob('discountCars');
    const removeOwnersCron = this.scheduler.getCronJob('removeOwners');

    discountCarsCron.start();
    removeOwnersCron.start();
  }

  public async handleStop() {
    const discountCarsCron = this.scheduler.getCronJob('discountCars');
    const removeOwnersCron = this.scheduler.getCronJob('removeOwners');

    discountCarsCron.stop();
    removeOwnersCron.stop();
  }
}
