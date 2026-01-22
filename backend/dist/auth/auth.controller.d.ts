import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        phone?: string;
        apartmentNumber?: string;
        buildingAddress?: string;
    }): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
}
