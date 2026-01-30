import { Repository } from 'typeorm';
import { UserNewsRead } from './user-news-read.entity';
export declare class UserNewsReadService {
    private userNewsReadRepository;
    constructor(userNewsReadRepository: Repository<UserNewsRead>);
    markAsRead(userId: string, newsId: string): Promise<void>;
    markAllAsRead(userId: string, newsIds: string[]): Promise<void>;
    getReadNewsIds(userId: string): Promise<string[]>;
    getUnreadCount(userId: string, allNewsIds: string[]): Promise<number>;
}
