import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Manufacturer } from '../manufacturer/manufacturer.entity';
import { Owner } from '../owner/owner.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column()
  firstRegistrationDate: Date;

  @Column({ type: 'smallint', nullable: true })
  discount: number;

  @ManyToOne(
    type => Manufacturer,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn()
  manufacturer: Manufacturer;

  @OneToMany(
    type => Owner,
    owner => owner.car,
    {
      cascade: ['remove', 'update']
    }
  )
  owners: Owner[];
}
