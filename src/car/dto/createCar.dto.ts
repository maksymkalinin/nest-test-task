export class CreateCarDto {
  readonly price: number;
  readonly firstRegistrationDate: Date;
  readonly manufacturerId: string;
  readonly ownerIds?: string[] = [];
}
