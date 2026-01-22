import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum RequestStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum RequestType {
  REPAIR = 'repair',              // Ремонт
  PLUMBING = 'plumbing',          // Сантехника
  ELECTRICITY = 'electricity',     // Электрика
  HEATING = 'heating',            // Отопление
  CLEANING = 'cleaning',          // Уборка
  GARBAGE = 'garbage',            // Вывоз мусора
  ELEVATOR = 'elevator',          // Лифт
  INTERCOM = 'intercom',          // Домофон
  OTHER = 'other',                // Другое
}

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: RequestType,
  })
  type: RequestType;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.NEW,
  })
  status: RequestStatus;

  @Column({ nullable: true })
  apartmentNumber: string;

  @Column({ nullable: true })
  buildingAddress: string;

  @Column({ nullable: true })
  assignedTo: string; // ID сотрудника УК

  @Column({ nullable: true, type: 'text' })
  response: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
