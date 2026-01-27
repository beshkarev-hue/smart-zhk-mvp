export declare enum MeterType {
    COLD_WATER = "cold_water",
    HOT_WATER = "hot_water",
    GAS = "gas",
    ELECTRICITY = "electricity"
}
export declare class Meter {
    id: string;
    accountNumber: string;
    electricityAccountNumber: string;
    currentReadingT1: number;
    currentReadingT2: number;
    currentReadingT3: number;
    previousReadingT1: number;
    previousReadingT2: number;
    previousReadingT3: number;
    userId: string;
    accountNumber: string;
    electricityAccountNumber: string;
    currentReadingT1: number;
    currentReadingT2: number;
    currentReadingT3: number;
    previousReadingT1: number;
    previousReadingT2: number;
    previousReadingT3: number;
    apartmentNumber: string;
    type: MeterType;
    accountNumber: string;
    electricityAccountNumber: string;
    currentReadingT1: number;
    currentReadingT2: number;
    currentReadingT3: number;
    previousReadingT1: number;
    previousReadingT2: number;
    previousReadingT3: number;
    serialNumber: string;
    verificationDate: Date;
    nextVerificationDate: Date;
    currentReading: number;
    previousReading: number;
    createdAt: Date;
    updatedAt: Date;
}
