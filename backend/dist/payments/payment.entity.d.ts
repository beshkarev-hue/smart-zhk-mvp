import { User } from '../users/user.entity';
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    OVERDUE = "overdue"
}
export declare enum PaymentType {
    UTILITIES = "utilities",
    MAINTENANCE = "maintenance",
    HEATING = "heating",
    WATER = "water",
    ELECTRICITY = "electricity",
    GAS = "gas",
    OTHER = "other"
}
export declare class Payment {
    id: string;
    user: User;
    userId: string;
    type: PaymentType;
    amount: number;
    status: PaymentStatus;
    period: string;
    description: string;
    dueDate: Date;
    paidDate: Date;
    createdAt: Date;
}
