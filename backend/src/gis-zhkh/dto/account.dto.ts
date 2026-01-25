// Лицевой счёт из ГИС ЖКХ
export class GisAccountDto {
  accountNumber: string;        // Номер лицевого счёта
  address: string;              // Адрес
  apartmentNumber: string;      // Квартира
  totalArea: number;            // Общая площадь
  livingArea: number;           // Жилая площадь
  residentsCount: number;       // Количество проживающих
  isActive: boolean;            // Активен ли счёт
}

export class GisAccountInfoDto {
  success: boolean;
  data?: GisAccountDto;
  error?: string;
}
