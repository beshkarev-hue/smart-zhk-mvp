import apiClient from './axios';

export const gisZhkhService = {
  // Получить информацию о лицевом счёте
  getAccountInfo: async (accountNumber: string) => {
    const response = await apiClient.get(`/gis-zhkh/account/${accountNumber}`);
    return response.data;
  },

  // Получить начисления за период
  getCharges: async (accountNumber: string, period?: string) => {
    const params = period ? { period } : {};
    const response = await apiClient.get(`/gis-zhkh/charges/${accountNumber}`, { params });
    return response.data;
  },

  // Получить список приборов учёта
  getMeters: async (accountNumber: string) => {
    const response = await apiClient.get(`/gis-zhkh/meters/${accountNumber}`);
    return response.data;
  },

  // Получить показания приборов учёта
  getMeterReadings: async (accountNumber: string, period?: string) => {
    const params = period ? { period } : {};
    const response = await apiClient.get(`/gis-zhkh/meter-readings/${accountNumber}`, { params });
    return response.data;
  },

  // Передать показания счётчика
  submitMeterReading: async (data: {
    accountNumber: string;
    meterId: string;
    value: number;
    readingDate: string;
  }) => {
    const response = await apiClient.post('/gis-zhkh/meter-readings/submit', data);
    return response.data;
  },

  // Получить историю платежей
  getPaymentHistory: async (accountNumber: string, startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get(`/gis-zhkh/payments/${accountNumber}`, { params });
    return response.data;
  },

  // Синхронизировать начисления
  syncCharges: async (accountNumber: string, userId: string) => {
    const response = await apiClient.post('/gis-zhkh/sync/charges', { accountNumber, userId });
    return response.data;
  },
};
