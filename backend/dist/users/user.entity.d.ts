export declare enum UserRole {
    RESIDENT = "resident",
    MANAGER = "manager",
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
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
