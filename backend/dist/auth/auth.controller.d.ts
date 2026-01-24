import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
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
    getProfile(req: any): any;
}
