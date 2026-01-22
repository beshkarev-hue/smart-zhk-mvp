import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export enum PaymentType {
  UTILITIES = 'utilities',      // Коммунальные услуги
  MAINTENANCE = 'maintenance',  // Содержание и ремонт
  HEATING = 'heating',          // Отопление
  WATER = 'water',              // Водоснабжение
  ELECTRICITY = 'electricity',  // Электроэнергия
  GAS = 'gas',                  // Газоснабжение
  OTHER = 'other',              // Прочее
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  type: PaymentType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column()
  period: string; // Например: "2024-01"

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
