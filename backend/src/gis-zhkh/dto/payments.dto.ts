// История платежей из ГИС ЖКХ
export class GisPaymentDto {
  id: string;
  accountNumber: string;
  paymentDate: string;
  amount: number;
  period: string;
  paymentType: string;
  documentNumber: string;
}

export class GisPaymentsResponseDto {
  success: boolean;
  payments: GisPaymentDto[];
  error?: string;
}
