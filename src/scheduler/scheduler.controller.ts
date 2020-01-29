import { Controller, Post, HttpException } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('/scheduler')
export class SchedulerController {
  constructor(
    private readonly schedulerService: SchedulerService
  ) {}

  @Post('/start')
  public async handleStart() {
    try {
      await this.schedulerService.handleStart();
      return 'Cron job has been started';
    } catch (error) {
      throw new HttpException(error.message, 422);
    }
  }

  @Post('/stop')
  public async handleStop() {
    try {
      await this.schedulerService.handleStop();
      return 'Cron job has been stopped';
    } catch (error) {
      throw new HttpException(error.message, 422);
    }
  }
}
