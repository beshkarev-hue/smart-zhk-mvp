export declare enum NewsCategory {
    NORMAL = "normal",
    PLANNED = "planned",
    URGENT = "urgent"
}
export declare class News {
    id: string;
    authorId: string;
    category: NewsCategory;
    title: string;
    content: string;
    imageUrl: string;
    isPublished: boolean;
    publishedAt: Date;
    expiresAt: Date;
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
}
