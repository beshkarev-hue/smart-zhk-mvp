import { BuildingsService } from './buildings.service';
export declare class BuildingsController {
    private readonly buildingsService;
    constructor(buildingsService: BuildingsService);
    getAll(): Promise<import("./building.entity").Building[]>;
    getByAddress(address: string): Promise<import("./building.entity").Building>;
    create(buildingData: any): Promise<import("./building.entity").Building>;
    update(id: string, buildingData: any): Promise<import("./building.entity").Building>;
}
