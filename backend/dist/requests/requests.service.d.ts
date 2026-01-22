import { Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
export declare class RequestsService {
    private requestsRepository;
    constructor(requestsRepository: Repository<Request>);
    create(requestData: Partial<Request>): Promise<Request>;
    findAll(): Promise<Request[]>;
    findByUser(userId: string): Promise<Request[]>;
    findOne(id: string): Promise<Request>;
    updateStatus(id: string, status: RequestStatus, response?: string): Promise<Request>;
    update(id: string, requestData: Partial<Request>): Promise<Request>;
    remove(id: string): Promise<void>;
}
