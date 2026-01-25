import { RequestsService } from './requests.service';
import { Request, RequestStatus } from './request.entity';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(requestData: Partial<Request>): Promise<Request>;
    findAll(): Promise<Request[]>;
    findByUserId(userId: string): Promise<Request[]>;
    findOne(id: string): Promise<Request>;
    updateStatus(id: string, data: {
        status: RequestStatus;
        response?: string;
    }): Promise<Request>;
    update(id: string, requestData: Partial<Request>): Promise<Request>;
    remove(id: string): Promise<void>;
}
