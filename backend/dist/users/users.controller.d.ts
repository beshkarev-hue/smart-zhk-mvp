import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./user.entity").User>;
    getExecutors(): Promise<import("./user.entity").User[]>;
    updateRating(id: string, body: {
        rating: number;
    }): Promise<{
        message: string;
    }>;
}
