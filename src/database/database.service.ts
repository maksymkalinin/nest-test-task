import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  private getConnectionOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: ['dist/**/*.entity.js'],
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE'),
      dropSchema: this.configService.get<boolean>('DB_DROPSCHEMA')
    };
    return options;
  }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.getConnectionOptions();
  }
}
