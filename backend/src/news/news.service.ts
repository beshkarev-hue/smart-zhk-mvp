import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { News, NewsCategory } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private dataSource: DataSource,
  ) {}

  async create(newsData: Partial<News> & { buildingIds?: string[] }): Promise<News> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const news = this.newsRepository.create(newsData);
      const savedNews = await queryRunner.manager.save(news);

      if (newsData.buildingIds && newsData.buildingIds.length > 0) {
        for (const buildingId of newsData.buildingIds) {
          await queryRunner.manager.query(
            'INSERT INTO news_buildings ("newsId", "buildingId") VALUES ($1, $2)',
            [savedNews.id, buildingId]
          );
        }
      }

      await queryRunner.commitTransaction();
      return savedNews;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<News[]> {
    return this.newsRepository.find({
      order: { 
        isPinned: 'DESC',
        createdAt: 'DESC' 
      },
    });
  }

  async findPublished(userId: string): Promise<News[]> {
    const now = new Date();
    
    // Получаем адрес жильца
    const userResult = await this.dataSource.query(
      'SELECT "buildingAddress" FROM users WHERE id = $1',
      [userId]
    );
    
    if (!userResult || userResult.length === 0) {
      return [];
    }
    
    const userAddress = userResult[0].buildingAddress;
    
    // Получаем building ID по адресу
    const buildingResult = await this.dataSource.query(
      'SELECT id FROM buildings WHERE address = $1',
      [userAddress]
    );
    
    const buildingId = buildingResult.length > 0 ? buildingResult[0].id : null;

    // Получаем новости: для всех адресов ИЛИ для конкретного адреса жильца
    const query = `
      SELECT DISTINCT n.* 
      FROM news n
      LEFT JOIN news_buildings nb ON n.id = nb."newsId"
      WHERE n."isPublished" = true
        AND n."publishedAt" <= $1
        AND (n."expiresAt" IS NULL OR n."expiresAt" >= $1)
        AND (
          nb."buildingId" IS NULL 
          OR nb."buildingId" = $2
        )
      ORDER BY n."isPinned" DESC, n."publishedAt" DESC
    `;
    
    return this.dataSource.query(query, [now, buildingId]);
  }

  async findByCategory(userId: string, category: NewsCategory): Promise<News[]> {
    const now = new Date();
    
    const userResult = await this.dataSource.query(
      'SELECT "buildingAddress" FROM users WHERE id = $1',
      [userId]
    );
    
    if (!userResult || userResult.length === 0) {
      return [];
    }
    
    const userAddress = userResult[0].buildingAddress;
    
    const buildingResult = await this.dataSource.query(
      'SELECT id FROM buildings WHERE address = $1',
      [userAddress]
    );
    
    const buildingId = buildingResult.length > 0 ? buildingResult[0].id : null;

    const query = `
      SELECT DISTINCT n.* 
      FROM news n
      LEFT JOIN news_buildings nb ON n.id = nb."newsId"
      WHERE n."isPublished" = true
        AND n."publishedAt" <= $1
        AND (n."expiresAt" IS NULL OR n."expiresAt" >= $1)
        AND n.category = $2
        AND (
          nb."buildingId" IS NULL 
          OR nb."buildingId" = $3
        )
      ORDER BY n."isPinned" DESC, n."publishedAt" DESC
    `;
    
    return this.dataSource.query(query, [now, category, buildingId]);
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
