import { apiClient } from './apiClient';

export interface SchoolRecord {
  id: string;
  name: string;
  domain: string;
}

export interface CreateSchoolRequestPayload {
  schoolName: string;
  adminName: string;
  adminEmail: string;
  adminMobile: string;
  location: string;
  planId: string;
}

export interface SchoolRequestRecord {
  id: string;
  schoolName: string;
  adminName: string;
  adminEmail: string;
  adminMobile: string;
  location: string;
  planId: string;
  planName: string;
  status: string;
  paymentStatus: string;
  paymentReference: string;
  paymentFailureReason: string;
  paymentStartedAt: string;
  paymentCompletedAt: string;
  submittedAt: string;
  reviewedBy: string;
  reviewedAt: string;
}

export interface SchoolRequestPaymentSessionRecord {
  schoolRequestId: string;
  paymentStatus: string;
  checkoutUrl: string;
  paymentReference: string;
  startedAt: string;
}

export interface UpdateSchoolRequestPaymentStatusPayload {
  status: string;
  paymentReference?: string;
  failureReason?: string;
}

export interface SchoolOnboardingProgressRecord {
  schoolRequestId: string;
  requestStatus: string;
  paymentStatus: string;
  completionPercent: number;
  submitted: boolean;
  paymentInitiated: boolean;
  paymentCompleted: boolean;
  approved: boolean;
  rejected: boolean;
}

export interface EnrichedSchoolRequestRecord extends SchoolRequestRecord {
  registrationStatus: string;
  paymentStatus: string;
  approvalStatus: string;
  paymentReference: string;
  paymentFailedReason: string;
  progressPercent: number;
  amount: number;
  currency: string;
}

export const normalizeSchoolRecord = (record: any): SchoolRecord => ({
  id: String(record?.id || record?.schoolId || record?.tenantId || ''),
  name: String(record?.name || record?.schoolName || record?.school || ''),
  domain: String(record?.domain || record?.customDomain || ''),
});

export const normalizeSchoolRequestRecord = (record: any): SchoolRequestRecord => ({
  id: String(record?.id || ''),
  schoolName: String(record?.schoolName || ''),
  adminName: String(record?.adminName || ''),
  adminEmail: String(record?.adminEmail || ''),
  adminMobile: String(record?.adminMobile || ''),
  location: String(record?.location || ''),
  planId: String(record?.planId || ''),
  planName: String(record?.planName || ''),
  status: String(record?.status || ''),
  paymentStatus: String(record?.paymentStatus || ''),
  paymentReference: String(record?.paymentReference || ''),
  paymentFailureReason: String(record?.paymentFailureReason || ''),
  paymentStartedAt: String(record?.paymentStartedAt || ''),
  paymentCompletedAt: String(record?.paymentCompletedAt || ''),
  submittedAt: String(record?.submittedAt || ''),
  reviewedBy: String(record?.reviewedBy || ''),
  reviewedAt: String(record?.reviewedAt || ''),
});

export const normalizeSchoolRequestPaymentSession = (record: any): SchoolRequestPaymentSessionRecord => ({
  schoolRequestId: String(record?.schoolRequestId || ''),
  paymentStatus: String(record?.paymentStatus || ''),
  checkoutUrl: String(record?.checkoutUrl || ''),
  paymentReference: String(record?.paymentReference || ''),
  startedAt: String(record?.startedAt || ''),
});

export const normalizeSchoolOnboardingProgress = (record: any): SchoolOnboardingProgressRecord => ({
  schoolRequestId: String(record?.schoolRequestId || ''),
  requestStatus: String(record?.requestStatus || ''),
  paymentStatus: String(record?.paymentStatus || ''),
  completionPercent: Number(record?.completionPercent || 0),
  submitted: Boolean(record?.submitted),
  paymentInitiated: Boolean(record?.paymentInitiated),
  paymentCompleted: Boolean(record?.paymentCompleted),
  approved: Boolean(record?.approved),
  rejected: Boolean(record?.rejected),
});

export const schoolService = {
  listSchools() {
    return apiClient.get('/schools', {});
  },
  listSchoolRequests() {
    return apiClient.get('/school-requests', {});
  },
  getSchoolRequest(id: string) {
    return apiClient.get(`/school-requests/${id}`, {});
  },
  createSchoolRequest(payload: CreateSchoolRequestPayload) {
    return apiClient.post('/school-requests', payload, {});
  },
  startSchoolRequestPayment(id: string) {
    return apiClient.post(`/school-requests/${id}/payment`, {}, {});
  },
  updateSchoolRequestPaymentStatus(id: string, payload: UpdateSchoolRequestPaymentStatusPayload) {
    return apiClient.patch(`/school-requests/${id}/payment-status`, payload, {});
  },
  approveSchoolRequest(id: string) {
    return apiClient.patch(`/school-requests/${id}/approve`, {}, {});
  },
  rejectSchoolRequest(id: string) {
    return apiClient.patch(`/school-requests/${id}/reject`, {}, {});
  },
  getSchoolRequestProgress(id: string) {
    return apiClient.get(`/school-requests/${id}/progress`, {});
  },
};
