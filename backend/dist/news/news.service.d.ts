import { Repository, DataSource } from 'typeorm';
import { News, NewsCategory } from './news.entity';
export declare class NewsService {
    private newsRepository;
    private dataSource;
    constructor(newsRepository: Repository<News>, dataSource: DataSource);
    create(newsData: Partial<News> & {
        buildingIds?: string[];
    }): Promise<News>;
    findAll(): Promise<News[]>;
    findPublished(userId: string): Promise<News[]>;
    findByCategory(userId: string, category: NewsCategory): Promise<News[]>;
    findOne(id: string): Promise<News>;
    update(id: string, newsData: Partial<News>): Promise<News>;
    remove(id: string): Promise<void>;
    publish(id: string): Promise<News>;
    unpublish(id: string): Promise<News>;
}
