import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user_news_read')
export class UserNewsRead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  newsId: string;

  @CreateDateColumn()
  readAt: Date;
}
