export class GisMeterDto {
  id: string;
  accountNumber: string;
  meterType: string;
  meterNumber: string;
  installDate: string;
  lastCheckDate: string;
  nextCheckDate: string;
  currentValue: number;
  isActive: boolean;
}

export class GisMeterReadingDto {
  meterId: string;
  accountNumber: string;
  meterType: string;
  readingDate: string;
  value: number;
  previousValue: number;
  consumption: number;
  tariff: number;
  amount: number;
}

export class SubmitMeterReadingDto {
  accountNumber: string;
  meterId: string;
  value: number;
  readingDate?: string;
}

export class GisMetersResponseDto {
  success: boolean;
  meters: GisMeterDto[];
  error?: string;
}

export class GisMeterReadingsResponseDto {
  success: boolean;
  readings: GisMeterReadingDto[];
  error?: string;
}
