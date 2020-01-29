import { IsString, IsMobilePhone, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsMobilePhone(null)
  readonly phone: string;

  @IsNumber()
  readonly siret: number;
}
