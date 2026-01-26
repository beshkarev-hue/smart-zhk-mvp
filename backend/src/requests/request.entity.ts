import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RequestStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

export enum RequestType {
  PLUMBING = 'plumbing',
  ELECTRICITY = 'electricity',
  HEATING = 'heating',
  CLEANING = 'cleaning',
  REPAIR = 'repair',
  OTHER = 'other',
}

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column('text', { nullable: true })
  response: string;

  // Исполнитель
  @Column({ nullable: true })
  executorId: string;

  @Column({ nullable: true })
  assignedTo: string;

  @Column({ nullable: true })
  assignedPosition: string;

  @Column({ default: false })
  executorAccepted: boolean;

  @Column({ default: false })
  executorRejected: boolean;

  @Column('text', { nullable: true })
  executorRejectionReason: string;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  // Стоимость
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  finalCost: number;

  @Column({ default: false })
  isFree: boolean;

  @Column('text', { nullable: true })
  estimateDetails: string;

  // Согласования жильца
  @Column({ nullable: true })
  residentApproval: boolean;

  @Column('text', { nullable: true })
  residentRejectionReason: string;

  // Комментарии и оценка
  @Column('text', { nullable: true })
  executorComment: string;

  @Column('text', { nullable: true })
  residentComment: string;

  @Column({ type: 'int', nullable: true })
  executorRating: number;

  // Фото
  @Column('simple-array', { nullable: true })
  photosBefore: string[];

  @Column('simple-array', { nullable: true })
  photosAfter: string[];

  @Column({ default: false })
  isPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}
