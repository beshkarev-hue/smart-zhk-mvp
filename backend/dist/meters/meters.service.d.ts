import { Repository } from 'typeorm';
import { Meter } from './meter.entity';
export declare class MetersService {
    private metersRepository;
    constructor(metersRepository: Repository<Meter>);
    findByUser(userId: string): Promise<Meter[]>;
    findByApartment(apartmentNumber: string): Promise<Meter[]>;
    create(meterData: Partial<Meter>): Promise<Meter>;
    update(id: string, meterData: Partial<Meter>): Promise<Meter>;
    submitReading(id: string, readingData: any): Promise<Meter>;
}
