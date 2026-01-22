import { Injectable, NotFoundException } from '@nestjs/common';
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
      relations: ['author'],
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!news) {
      throw new NotFoundException(`Новость с ID ${id} не найдена`);
    }

    return news;
  }

  async update(id: string, newsData: Partial<News>): Promise<News> {
    const news = await this.findOne(id);
    Object.assign(news, newsData);
    return this.newsRepository.save(news);
  }

  async remove(id: string): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);
  }

  async publish(id: string): Promise<News> {
    const news = await this.findOne(id);
    news.isPublished = true;
    return this.newsRepository.save(news);
  }

  async unpublish(id: string): Promise<News> {
    const news = await this.findOne(id);
    news.isPublished = false;
    return this.newsRepository.save(news);
  }
}
