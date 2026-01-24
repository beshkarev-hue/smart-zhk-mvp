import apiClient from './axios';
import { Payment } from '../../types';

export const paymentsService = {
  async getAll(): Promise<Payment[]> {
    const response = await apiClient.get<Payment[]>('/payments');
    return response.data;
  },

  async getByUser(userId: string): Promise<Payment[]> {
    const response = await apiClient.get<Payment[]>(`/payments/user/${userId}`);
    return response.data;
  },

  async getById(id: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  async markAsPaid(id: string): Promise<Payment> {
    const response = await apiClient.patch<Payment>(`/payments/${id}/pay`, {});
    return response.data;
  },

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const response = await apiClient.post<Payment>('/payments', paymentData);
    return response.data;
  },
};
