import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'int' })
  siret: number;
}
