import apiClient from './axios';
import { Request, RequestStatus } from '../../types';

export const requestsService = {
  async getAll(): Promise<Request[]> {
    const response = await apiClient.get<Request[]>('/requests');
    return response.data;
  },

  async getByUser(userId: string): Promise<Request[]> {
    const response = await apiClient.get<Request[]>(`/requests/user/${userId}`);
    return response.data;
  },

  async getById(id: string): Promise<Request> {
    const response = await apiClient.get<Request>(`/requests/${id}`);
    return response.data;
  },

  async create(requestData: Partial<Request>): Promise<Request> {
    const response = await apiClient.post<Request>('/requests', requestData);
    return response.data;
  },

  async updateStatus(id: string, status: RequestStatus, responseText?: string): Promise<Request> {
    const response = await apiClient.patch<Request>(`/requests/${id}/status`, {
      status,
      response: responseText,
    });
    return response.data;
  },

  async update(id: string, requestData: Partial<Request>): Promise<Request> {
    const response = await apiClient.patch<Request>(`/requests/${id}`, requestData);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/requests/${id}`);
  },
};
