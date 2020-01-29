import { IsString, IsDateString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDateString()
  readonly purchaseDate: Date;

  @IsOptional()
  @IsUUID('4')
  readonly carId?: string;
}
