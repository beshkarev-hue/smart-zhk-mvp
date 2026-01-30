import { NewsService } from './news.service';
import { News, NewsCategory } from './news.entity';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    create(newsData: Partial<News>): Promise<News>;
    findPublished(req: any): Promise<News[]>;
    findByCategory(req: any, category: NewsCategory): Promise<News[]>;
    findAll(): Promise<News[]>;
    findOne(id: string): Promise<News>;
    update(id: string, newsData: Partial<News>): Promise<News>;
    publish(id: string): Promise<News>;
    unpublish(id: string): Promise<News>;
    remove(id: string): Promise<void>;
}
