import { IsOptional, IsString, IsMobilePhone, IsNumber } from 'class-validator';

export class UpdateManufacturerDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsMobilePhone(null)
  readonly phone?: string;

  @IsOptional()
  @IsNumber()
  readonly siret?: number;
}
