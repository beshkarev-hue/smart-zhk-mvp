import { UserNewsReadService } from './user-news-read.service';
export declare class UserNewsReadController {
    private readonly userNewsReadService;
    constructor(userNewsReadService: UserNewsReadService);
    markAsRead(req: any, body: {
        newsId: string;
    }): Promise<void>;
    markAllAsRead(req: any, body: {
        newsIds: string[];
    }): Promise<void>;
    getReadNewsIds(req: any): Promise<string[]>;
    getUnreadCount(req: any, body: {
        newsIds: string[];
    }): Promise<number>;
}
