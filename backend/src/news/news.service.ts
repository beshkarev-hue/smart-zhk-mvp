import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News, NewsCategory } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(newsData: Partial<News>): Promise<News> {
    const news = this.newsRepository.create(newsData);
    return this.newsRepository.save(news);
  }

  async findAll(): Promise<News[]> {
    return this.newsRepository.find({
      order: { 
        isPinned: 'DESC',
        createdAt: 'DESC' 
      },
    });
  }

  async findPublished(): Promise<News[]> {
    const now = new Date();
    return this.newsRepository
      .createQueryBuilder('news')
      .where('news.isPublished = :published', { published: true })
      .andWhere('news.publishedAt <= :now', { now })
      .andWhere('(news.expiresAt IS NULL OR news.expiresAt >= :now)', { now })
      .orderBy('news.isPinned', 'DESC')
      .addOrderBy('news.publishedAt', 'DESC')
      .getMany();
  }

  async findByCategory(category: NewsCategory): Promise<News[]> {
    const now = new Date();
    return this.newsRepository
      .createQueryBuilder('news')
      .where('news.category = :category', { category })
      .andWhere('news.isPublished = :published', { published: true })
      .andWhere('news.publishedAt <= :now', { now })
      .andWhere('(news.expiresAt IS NULL OR news.expiresAt >= :now)', { now })
      .orderBy('news.isPinned', 'DESC')
      .addOrderBy('news.publishedAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<News> {
    return this.newsRepository.findOne({ where: { id } });
  }

  async update(id: string, newsData: Partial<News>): Promise<News> {
    await this.newsRepository.update(id, newsData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.newsRepository.delete(id);
  }

  async publish(id: string): Promise<News> {
    const now = new Date();
    await this.newsRepository.update(id, { 
      isPublished: true,
      publishedAt: now 
    });
    return this.findOne(id);
  }

  async unpublish(id: string): Promise<News> {
    await this.newsRepository.update(id, { isPublished: false });
    return this.findOne(id);
  }
}
