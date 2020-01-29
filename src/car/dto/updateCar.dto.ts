import { IsOptional, IsNumber, IsDateString, IsArray, IsUUID, IsPositive } from 'class-validator';

export class UpdateCarDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly price?: number;

  @IsOptional()
  @IsDateString()
  readonly firstRegistrationDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly discount?: number;

  @IsOptional()
  @IsUUID('4')
  readonly manufacturerId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly ownerIds?: string[];
}
