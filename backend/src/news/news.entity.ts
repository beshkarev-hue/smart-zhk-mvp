import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NewsType {
  ANNOUNCEMENT = 'announcement',
  NEWS = 'news',
  EVENT = 'event',
  MAINTENANCE = 'maintenance',
  EMERGENCY = 'emergency',
}

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  authorId: string;

  @Column({
    type: 'enum',
    enum: NewsType,
    default: NewsType.ANNOUNCEMENT,
  })
  type: NewsType;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
