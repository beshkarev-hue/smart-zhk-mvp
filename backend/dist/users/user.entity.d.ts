export declare enum UserRole {
    RESIDENT = "resident",
    MANAGER = "manager",
    EXECUTOR = "executor",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName: string;
    phone: string;
    role: UserRole;
    apartmentNumber: string;
    buildingAddress: string;
    position: string;
    photoUrl: string;
    rating: number;
    ratingsCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
