export declare enum NewsType {
    ANNOUNCEMENT = "announcement",
    NEWS = "news",
    EVENT = "event",
    MAINTENANCE = "maintenance",
    EMERGENCY = "emergency"
}
export declare class News {
    id: string;
    authorId: string;
    type: NewsType;
    title: string;
    content: string;
    imageUrl: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
