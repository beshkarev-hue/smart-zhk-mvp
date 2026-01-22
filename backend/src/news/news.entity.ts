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

export enum NewsType {
  ANNOUNCEMENT = 'announcement',  // Объявление
  NEWS = 'news',                  // Новость
  EVENT = 'event',                // Мероприятие
  MAINTENANCE = 'maintenance',    // Плановые работы
  EMERGENCY = 'emergency',        // Аварийная ситуация
}

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: NewsType,
    default: NewsType.NEWS,
  })
  type: NewsType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
