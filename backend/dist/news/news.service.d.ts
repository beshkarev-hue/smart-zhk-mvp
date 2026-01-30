import { Repository } from 'typeorm';
import { News, NewsCategory } from './news.entity';
export declare class NewsService {
    private newsRepository;
    constructor(newsRepository: Repository<News>);
    create(newsData: Partial<News>): Promise<News>;
    findAll(): Promise<News[]>;
    findPublished(): Promise<News[]>;
    findByCategory(category: NewsCategory): Promise<News[]>;
    findOne(id: string): Promise<News>;
    update(id: string, newsData: Partial<News>): Promise<News>;
    remove(id: string): Promise<void>;
    publish(id: string): Promise<News>;
    unpublish(id: string): Promise<News>;
}
