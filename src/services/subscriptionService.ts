import { apiClient } from './apiClient';

export const subscriptionService = {
  createSubscription(payload) {
    return apiClient.post('/subscriptions', payload);
  },
  getSubscription(id) {
    return apiClient.get(`/subscriptions/${id}`);
  },
  getTenantSubscription(tenantId) {
    return apiClient.get(`/tenants/${tenantId}/subscription`);
  },
  upgradeSubscription(id, payload) {
    return apiClient.patch(`/subscriptions/${id}/upgrade`, payload);
  },
  downgradeSubscription(id, payload) {
    return apiClient.patch(`/subscriptions/${id}/downgrade`, payload);
  },
  cancelSubscription(id, payload) {
    return apiClient.patch(`/subscriptions/${id}/cancel`, payload);
  },
  resumeSubscription(id) {
    return apiClient.patch(`/subscriptions/${id}/resume`);
  },
};
