export declare enum RequestStatus {
    NEW = "new",
    ASSIGNED = "assigned",
    ACCEPTED = "accepted",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    REJECTED = "rejected",
    CLOSED = "closed"
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
    executorId: string;
    assignedTo: string;
    assignedPosition: string;
    executorAccepted: boolean;
    executorRejected: boolean;
    executorRejectionReason: string;
    deadline: Date;
    estimatedCost: number;
    finalCost: number;
    isFree: boolean;
    estimateDetails: string;
    residentApproval: boolean;
    residentRejectionReason: string;
    executorComment: string;
    residentComment: string;
    executorRating: number;
    photosBefore: string[];
    photosAfter: string[];
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
    closedAt: Date;
}
