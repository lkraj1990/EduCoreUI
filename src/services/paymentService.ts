import { apiClient } from './apiClient';

export const paymentService = {
  getPayment(id) {
    return apiClient.get(`/payments/${id}`);
  },
  processWebhook(payload) {
    return apiClient.post('/payments/webhook', payload);
  },
};
