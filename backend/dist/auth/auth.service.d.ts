import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            middleName: any;
            phone: any;
            role: any;
            apartmentNumber: any;
            buildingAddress: any;
            isActive: any;
            createdAt: any;
        };
    }>;
    register(userData: any): Promise<import("../users/user.entity").User>;
}
