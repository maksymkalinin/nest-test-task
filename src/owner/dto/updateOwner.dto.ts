import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';

export class UpdateOwnerDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsDateString()
  readonly purchaseDate?: Date;

  @IsOptional()
  @IsUUID('4')
  readonly carId?: string;
}
