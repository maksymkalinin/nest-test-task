import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import * as path from 'path';

const configModuleOption: ConfigModuleOptions = {};
if (
  process.env.NODE_ENV === 'development' ||
  (process.env.NODE_ENV === 'test' && !process.env.DB_HOST)
) {
  configModuleOption.envFilePath = path.join(
    process.cwd(),
    'env',
    '.development.env'
  );
}
@Module({
  imports: [ConfigModule.forRoot(configModuleOption)],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
