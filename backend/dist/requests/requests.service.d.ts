import { Repository } from 'typeorm';
import { Request } from './request.entity';
import { UpdateRequestDto } from './dto/update-request.dto';
export declare class RequestsService {
    private requestsRepository;
    constructor(requestsRepository: Repository<Request>);
    findAll(): Promise<Request[]>;
    findByUserId(userId: string): Promise<Request[]>;
    findOne(id: string): Promise<Request>;
    create(data: any): Promise<Request>;
    update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request>;
    updateStatus(id: string, status: string, response?: string): Promise<Request>;
    remove(id: string): Promise<void>;
}
