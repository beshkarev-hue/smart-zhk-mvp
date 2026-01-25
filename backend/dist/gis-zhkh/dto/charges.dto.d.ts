export declare class GisChargeDto {
    id: string;
    accountNumber: string;
    period: string;
    serviceType: string;
    serviceName: string;
    amount: number;
    volume: number;
    tariff: number;
    unit: string;
}
export declare class GisChargesResponseDto {
    success: boolean;
    accountNumber: string;
    period: string;
    charges: GisChargeDto[];
    totalAmount: number;
    error?: string;
}
