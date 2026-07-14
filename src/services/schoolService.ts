import { apiClient } from './apiClient';

export interface SchoolRecord {
  id: string;
  name: string;
  domain: string;
}

export const normalizeSchoolRecord = (record: any): SchoolRecord => ({
  id: String(record?.id || record?.schoolId || record?.tenantId || ''),
  name: String(record?.name || record?.schoolName || record?.school || ''),
  domain: String(record?.domain || record?.customDomain || ''),
});

export const schoolService = {
  listSchools() {
    return apiClient.get('/schools', {});
  },
};
