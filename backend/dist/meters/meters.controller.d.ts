import { MetersService } from './meters.service';
export declare class MetersController {
    private readonly metersService;
    constructor(metersService: MetersService);
    getMyMeters(req: any): Promise<import("./meter.entity").Meter[]>;
    getByApartment(number: string): Promise<import("./meter.entity").Meter[]>;
    create(meterData: any): Promise<import("./meter.entity").Meter>;
    update(id: string, meterData: any): Promise<import("./meter.entity").Meter>;
    submitReading(id: string, body: {
        reading: number;
    }): Promise<import("./meter.entity").Meter>;
}
