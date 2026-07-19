import { apiClient } from './apiClient';

export interface TenantDetailRecord {
  id: string;
  name: string;
  code: string;
  domain: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const normalizeTenantDetailRecord = (record: any): TenantDetailRecord => ({
  id: String(record?.id || record?.tenantId || ''),
  name: String(record?.name || record?.schoolName || ''),
  code: String(record?.code || ''),
  domain: String(record?.domain || record?.customDomain || ''),
  status: String(record?.status || 'Active'),
  createdAt: String(record?.createdAt || ''),
  updatedAt: String(record?.updatedAt || ''),
});

export const tenantService = {
  listTenants() {
    return apiClient.get('/tenants', {});
  },
};
