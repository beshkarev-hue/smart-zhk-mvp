import { Repository } from 'typeorm';
import { Building } from './building.entity';
export declare class BuildingsService {
    private buildingsRepository;
    constructor(buildingsRepository: Repository<Building>);
    findByAddress(address: string): Promise<Building | null>;
    findAll(): Promise<Building[]>;
    create(buildingData: Partial<Building>): Promise<Building>;
    update(id: string, buildingData: Partial<Building>): Promise<Building>;
}
