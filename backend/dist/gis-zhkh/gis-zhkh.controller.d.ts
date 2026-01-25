import { GisZhkhService } from './gis-zhkh.service';
export declare class GisZhkhController {
    private readonly gisZhkhService;
    constructor(gisZhkhService: GisZhkhService);
    getAccountInfo(accountNumber: string): Promise<import("./dto").GisAccountInfoDto>;
    getCharges(accountNumber: string, period?: string): Promise<import("./dto").GisChargesResponseDto>;
    getMeters(accountNumber: string): Promise<import("./dto").GisMetersResponseDto>;
    getMeterReadings(accountNumber: string, period?: string): Promise<import("./dto").GisMeterReadingsResponseDto>;
    submitMeterReading(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getPaymentHistory(accountNumber: string, startDate?: string, endDate?: string): Promise<import("./dto").GisPaymentsResponseDto>;
    syncCharges(body: any): Promise<{
        success: boolean;
        imported: number;
    }>;
}
