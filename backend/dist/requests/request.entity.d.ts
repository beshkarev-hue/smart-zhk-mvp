import { User } from '../users/user.entity';
export declare enum RequestStatus {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    REJECTED = "rejected"
}
export declare enum RequestType {
    REPAIR = "repair",
    PLUMBING = "plumbing",
    ELECTRICITY = "electricity",
    HEATING = "heating",
    CLEANING = "cleaning",
    GARBAGE = "garbage",
    ELEVATOR = "elevator",
    INTERCOM = "intercom",
    OTHER = "other"
}
export declare class Request {
    id: string;
    user: User;
    userId: string;
    type: RequestType;
    title: string;
    description: string;
    status: RequestStatus;
    apartmentNumber: string;
    buildingAddress: string;
    assignedTo: string;
    response: string;
    createdAt: Date;
    updatedAt: Date;
}
