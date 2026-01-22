import { User } from '../users/user.entity';
export declare enum NewsType {
    ANNOUNCEMENT = "announcement",
    NEWS = "news",
    EVENT = "event",
    MAINTENANCE = "maintenance",
    EMERGENCY = "emergency"
}
export declare class News {
    id: string;
    title: string;
    content: string;
    type: NewsType;
    author: User;
    authorId: string;
    isPublished: boolean;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
