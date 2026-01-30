import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MeterType {
  COLD_WATER = 'cold_water',
  HOT_WATER = 'hot_water',
  GAS = 'gas',
  ELECTRICITY = 'electricity',
}

@Entity('meters')
export class Meter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  electricityAccountNumber: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  currentReadingT1: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  currentReadingT2: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  currentReadingT3: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  previousReadingT1: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  previousReadingT2: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  previousReadingT3: number;

  @Column()
  userId: string;

  @Column({ nullable: true })

  @Column({ nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column()
  apartmentNumber: string;

  @Column({
    type: 'enum',
    enum: MeterType,
  })
  type: MeterType;

  @Column({ nullable: true })

  @Column({ nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column('decimal', { precision: 10, scale: 2, nullable: true })

  @Column()
  serialNumber: string;

  @Column({ type: 'date', nullable: true })
  verificationDate: Date;

  @Column({ type: 'date', nullable: true })
  nextVerificationDate: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentReading: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  previousReading: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
