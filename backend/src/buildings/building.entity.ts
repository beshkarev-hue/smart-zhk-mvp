import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('buildings')
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  yearBuilt: number;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  floors: number;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  entrances: number;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  totalApartments: number;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  wallMaterial: string;

  @Column('text', { nullable: true })
  houseRules: string;

  @Column('jsonb', { nullable: true })
  tariffs: any;

  @Column('jsonb', { nullable: true })
  managementCompany: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
