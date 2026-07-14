import { apiClient } from './apiClient';

export const entitlementService = {
  getTenantEntitlements(tenantId) {
    return apiClient.get(`/tenants/${tenantId}/entitlements`);
  },
  refreshTenantEntitlements(tenantId) {
    return apiClient.post(`/tenants/${tenantId}/entitlements/refresh`);
  },
};
