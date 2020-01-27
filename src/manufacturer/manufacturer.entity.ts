import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'numeric', precision: 20, scale: 0 })
  siret: number;
}
