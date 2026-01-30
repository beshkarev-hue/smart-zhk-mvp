import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNewsRead } from './user-news-read.entity';

@Injectable()
export class UserNewsReadService {
  constructor(
    @InjectRepository(UserNewsRead)
    private userNewsReadRepository: Repository<UserNewsRead>,
  ) {}

  async markAsRead(userId: string, newsId: string): Promise<void> {
    const existing = await this.userNewsReadRepository.findOne({
      where: { userId, newsId },
    });

    if (!existing) {
      const userNewsRead = this.userNewsReadRepository.create({ userId, newsId });
      await this.userNewsReadRepository.save(userNewsRead);
    }
  }

  async markAllAsRead(userId: string, newsIds: string[]): Promise<void> {
    for (const newsId of newsIds) {
      await this.markAsRead(userId, newsId);
    }
  }

  async getReadNewsIds(userId: string): Promise<string[]> {
    const reads = await this.userNewsReadRepository.find({
      where: { userId },
      select: ['newsId'],
    });
    return reads.map(r => r.newsId);
  }

  async getUnreadCount(userId: string, allNewsIds: string[]): Promise<number> {
    const readIds = await this.getReadNewsIds(userId);
    return allNewsIds.filter(id => !readIds.includes(id)).length;
  }
}
