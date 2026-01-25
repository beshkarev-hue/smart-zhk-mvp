import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  RESIDENT = 'resident',
  MANAGER = 'manager',
  EXECUTOR = 'executor',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.RESIDENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  apartmentNumber: string;

  @Column({ nullable: true })
  buildingAddress: string;

  // Поля для исполнителей
  @Column({ nullable: true })
  position: string; // Должность: Сантехник, Электрик и т.д.

  @Column({ nullable: true })
  photoUrl: string; // URL фото исполнителя

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number; // Средний рейтинг (0.00 - 5.00)

  @Column({ type: 'int', default: 0 })
  ratingsCount: number; // Количество оценок

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
