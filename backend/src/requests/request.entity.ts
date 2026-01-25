import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RequestStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
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

  // Новые поля для расширенного функционала
  @Column({ nullable: true })
  assignedTo: string; // ФИО исполнителя

  @Column({ nullable: true })
  assignedPosition: string; // Должность (Сантехник, Электрик)

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date; // Срок исполнения

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimatedCost: number; // Стоимость работ

  @Column({ default: false })
  isFree: boolean; // Бесплатно или платно

  @Column('text', { nullable: true })
  estimateDetails: string; // Детали сметы

  @Column({ nullable: true })
  residentApproval: boolean; // Согласие жильца (null = не рассмотрено)

  @Column('text', { nullable: true })
  executorComment: string; // Комментарий исполнителя

  @Column('text', { nullable: true })
  residentComment: string; // Комментарий жильца

  @Column('simple-array', { nullable: true })
  photosBefore: string[]; // Фото до работ

  @Column('simple-array', { nullable: true })
  photosAfter: string[]; // Фото после работ

  @Column({ default: false })
  isPaid: boolean; // Оплачено

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date; // Дата завершения
}
