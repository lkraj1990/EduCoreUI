import { apiClient } from './apiClient';

export const paymentService = {
  generateInvoice(payload) {
    return apiClient.post('/invoices/generate', payload);
  },
  getPayment(id) {
    return apiClient.get(`/payments/${id}`);
  },
  processWebhook(payload) {
    return apiClient.post('/payments/webhook', payload);
  },
};
