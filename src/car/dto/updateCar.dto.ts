export class UpdateCarDto {
  readonly price?: number;
  readonly firstRegistrationDate?: Date;
  readonly discount?: number;
  readonly manufacturerId?: string;
  readonly ownerIds?: string[];
}
