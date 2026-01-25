export declare class GisPaymentDto {
    id: string;
    accountNumber: string;
    paymentDate: string;
    amount: number;
    period: string;
    paymentType: string;
    documentNumber: string;
}
export declare class GisPaymentsResponseDto {
    success: boolean;
    payments: GisPaymentDto[];
    error?: string;
}
