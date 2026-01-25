import { GisAccountInfoDto, GisChargesResponseDto, GisMetersResponseDto, GisMeterReadingsResponseDto, SubmitMeterReadingDto, GisPaymentsResponseDto } from './dto';
export declare class GisZhkhService {
    getAccountInfo(accountNumber: string): Promise<GisAccountInfoDto>;
    getCharges(accountNumber: string, period: string): Promise<GisChargesResponseDto>;
    getMeters(accountNumber: string): Promise<GisMetersResponseDto>;
    getMeterReadings(accountNumber: string, period?: string): Promise<GisMeterReadingsResponseDto>;
    submitMeterReading(dto: SubmitMeterReadingDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getPaymentHistory(accountNumber: string, startDate?: string, endDate?: string): Promise<GisPaymentsResponseDto>;
    syncCharges(accountNumber: string, userId: string): Promise<{
        success: boolean;
        imported: number;
    }>;
}
