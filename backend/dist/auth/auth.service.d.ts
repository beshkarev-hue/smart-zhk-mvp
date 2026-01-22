import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        phone?: string;
        apartmentNumber?: string;
        buildingAddress?: string;
    }): Promise<User>;
}
