import { IsOptional, IsNumber, IsDateString, IsUUID, IsArray, IsPositive } from 'class-validator';

export class CreateCarDto {
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsDateString()
  readonly firstRegistrationDate: Date;

  @IsUUID('4')
  readonly manufacturerId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly ownerIds?: string[] = [];
}
