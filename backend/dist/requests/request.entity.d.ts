export declare enum RequestStatus {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    REJECTED = "rejected"
}
export declare enum RequestType {
    PLUMBING = "plumbing",
    ELECTRICITY = "electricity",
    HEATING = "heating",
    CLEANING = "cleaning",
    REPAIR = "repair",
    OTHER = "other"
}
export declare class Request {
    id: string;
    userId: string;
    type: RequestType;
    title: string;
    description: string;
    status: RequestStatus;
    apartmentNumber: string;
    buildingAddress: string;
    response: string;
    assignedTo: string;
    assignedPosition: string;
    deadline: Date;
    estimatedCost: number;
    isFree: boolean;
    estimateDetails: string;
    residentApproval: boolean;
    executorComment: string;
    residentComment: string;
    photosBefore: string[];
    photosAfter: string[];
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
}
