import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';

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
      order: { createdAt: 'DESC' },
    });
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
    await this.newsRepository.update(id, { isPublished: true });
    return this.findOne(id);
  }

  async unpublish(id: string): Promise<News> {
    await this.newsRepository.update(id, { isPublished: false });
    return this.findOne(id);
  }
}
