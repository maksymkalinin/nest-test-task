import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SchedulerService } from './scheduler/scheduler.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.init();

  app.get(SchedulerService).handleStop(); // STOP CronJobs
  const port = app.get(ConfigService).get('PORT');

  await app.listen(port);
}
bootstrap();
