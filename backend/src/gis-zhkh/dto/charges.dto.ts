// Начисления из ГИС ЖКХ
export class GisChargeDto {
  id: string;
  accountNumber: string;
  period: string;               // YYYY-MM
  serviceType: string;          // Тип услуги
  serviceName: string;          // Название услуги
  amount: number;               // Сумма начисления
  volume: number;               // Объём потребления
  tariff: number;               // Тариф
  unit: string;                 // Единица измерения (кВт⋅ч, м³)
}

export class GisChargesResponseDto {
  success: boolean;
  accountNumber: string;
  period: string;
  charges: GisChargeDto[];
  totalAmount: number;
  error?: string;
}
