export declare class GisAccountDto {
    accountNumber: string;
    address: string;
    apartmentNumber: string;
    totalArea: number;
    livingArea: number;
    residentsCount: number;
    isActive: boolean;
}
export declare class GisAccountInfoDto {
    success: boolean;
    data?: GisAccountDto;
    error?: string;
}
