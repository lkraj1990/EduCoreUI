const SCHOOL_ONBOARDING_STORAGE_KEY = 'educore-school-onboarding';

export type SchoolPaymentStatus = 'initiated' | 'complete' | 'failed';
export type SchoolApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface SchoolOnboardingRecord {
  schoolRequestId: string;
  schoolName: string;
  adminName: string;
  adminEmail: string;
  adminMobile: string;
  location: string;
  planId: string;
  planName: string;
  requestedAt: string;
  customDomain: string;
  tenantCode: string;
  amount: number;
  currency: string;
  paymentStatus: SchoolPaymentStatus;
  paymentReference: string;
  paymentFailedReason: string;
  approvalStatus: SchoolApprovalStatus;
  reviewedAt: string;
  reviewedBy: string;
  completionPercent: number;
  paymentStartedAt: string;
  paymentCompletedAt: string;
  checkoutUrl: string;
  requestStatus?: string;
}

export const normalizeSchoolPaymentStatus = (status?: string): SchoolPaymentStatus => {
  const normalizedStatus = String(status || '').toLowerCase();

  if (normalizedStatus === 'complete' || normalizedStatus === 'completed' || normalizedStatus === 'success') {
    return 'complete';
  }

  if (normalizedStatus === 'failed' || normalizedStatus === 'failure') {
    return 'failed';
  }

  return 'initiated';
};

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readRecords = (): SchoolOnboardingRecord[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(SCHOOL_ONBOARDING_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

const writeRecords = (records: SchoolOnboardingRecord[]) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SCHOOL_ONBOARDING_STORAGE_KEY, JSON.stringify(records));
};

const upsertRecord = (record: SchoolOnboardingRecord) => {
  const existingRecords = readRecords();
  const nextRecords = existingRecords.filter((entry) => entry.schoolRequestId !== record.schoolRequestId);
  nextRecords.push(record);
  writeRecords(nextRecords);

  return record;
};

export const getSchoolRegistrationStatus = (record?: Partial<SchoolOnboardingRecord> | null) => {
  if (!record) {
    return 'Requested';
  }

  if (record.approvalStatus === 'approved') {
    return 'Approved';
  }

  if (record.approvalStatus === 'rejected') {
    return 'Rejected';
  }

  if (record.paymentStatus === 'complete') {
    return 'Payment Complete';
  }

  if (record.paymentStatus === 'failed') {
    return 'Payment Failed';
  }

  if (record.requestStatus) {
    return String(record.requestStatus);
  }

  return 'Requested';
};

export const getSchoolOnboardingProgress = (record?: Partial<SchoolOnboardingRecord> | null) => {
  if (typeof record?.completionPercent === 'number' && record.completionPercent > 0) {
    return record.completionPercent;
  }

  const status = getSchoolRegistrationStatus(record);

  if (status === 'Approved' || status === 'Rejected') {
    return 100;
  }

  if (status === 'Payment Complete') {
    return 70;
  }

  if (status === 'Payment Failed') {
    return 45;
  }

  return 25;
};

export const getSchoolOnboardingSteps = (record?: Partial<SchoolOnboardingRecord> | null) => {
  const isPaymentComplete = record?.paymentStatus === 'complete';
  const isPaymentFailed = record?.paymentStatus === 'failed';
  const isApproved = record?.approvalStatus === 'approved';
  const isRejected = record?.approvalStatus === 'rejected';

  return [
    {
      key: 'requested',
      title: 'Requested',
      description: 'School registration request submitted.',
      state: 'completed',
    },
    {
      key: 'payment',
      title: isPaymentFailed ? 'Payment Failed' : 'Payment',
      description: isPaymentComplete
        ? 'Payment captured and shared with the admin queue.'
        : isPaymentFailed
        ? 'Payment attempt failed. Retry is required.'
        : 'Payment is pending from school admin.',
      state: isPaymentComplete ? 'completed' : isPaymentFailed ? 'failed' : 'current',
    },
    {
      key: 'approval',
      title: isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Admin Approval',
      description: isApproved
        ? 'Super admin approved onboarding.'
        : isRejected
        ? 'Super admin rejected onboarding.'
        : 'Approval unlocks after payment completion.',
      state: isApproved || isRejected ? 'completed' : isPaymentComplete ? 'current' : 'upcoming',
    },
  ];
};

const buildBaseRecord = (payload: Partial<SchoolOnboardingRecord>): SchoolOnboardingRecord => ({
  schoolRequestId: String(payload.schoolRequestId || ''),
  schoolName: String(payload.schoolName || ''),
  adminName: String(payload.adminName || ''),
  adminEmail: String(payload.adminEmail || ''),
  adminMobile: String(payload.adminMobile || ''),
  location: String(payload.location || ''),
  planId: String(payload.planId || ''),
  planName: String(payload.planName || ''),
  requestedAt: String(payload.requestedAt || new Date().toISOString()),
  customDomain: String(payload.customDomain || ''),
  tenantCode: String(payload.tenantCode || ''),
  amount: Number(payload.amount || 0),
  currency: String(payload.currency || 'INR'),
  paymentStatus: normalizeSchoolPaymentStatus(payload.paymentStatus),
  paymentReference: String(payload.paymentReference || ''),
  paymentFailedReason: String(payload.paymentFailedReason || ''),
  approvalStatus: payload.approvalStatus || 'pending',
  reviewedAt: String(payload.reviewedAt || ''),
  reviewedBy: String(payload.reviewedBy || ''),
  completionPercent: Number(payload.completionPercent || 0),
  paymentStartedAt: String(payload.paymentStartedAt || ''),
  paymentCompletedAt: String(payload.paymentCompletedAt || ''),
  checkoutUrl: String(payload.checkoutUrl || ''),
});

export const schoolOnboardingService = {
  list() {
    return readRecords();
  },
  getBySchoolRequestId(schoolRequestId: string) {
    return readRecords().find((entry) => entry.schoolRequestId === schoolRequestId) || null;
  },
  syncFromApi(payload: Partial<SchoolOnboardingRecord>) {
    return this.upsertFromSchoolRequest(payload);
  },
  upsertFromSchoolRequest(payload: Partial<SchoolOnboardingRecord>) {
    const currentRecord = payload.schoolRequestId ? this.getBySchoolRequestId(String(payload.schoolRequestId)) : null;

    const resolvedPaymentStatus = normalizeSchoolPaymentStatus(
      payload.paymentStatus || currentRecord?.paymentStatus || 'initiated',
    );

    const resolvedApprovalStatus = (payload.approvalStatus || currentRecord?.approvalStatus || 'pending') as SchoolApprovalStatus;

    return upsertRecord(buildBaseRecord({
      ...currentRecord,
      ...payload,
      schoolRequestId: payload.schoolRequestId || currentRecord?.schoolRequestId,
      paymentStatus: resolvedPaymentStatus,
      approvalStatus: resolvedApprovalStatus,
      paymentReference: payload.paymentReference || currentRecord?.paymentReference || '',
      paymentFailedReason: payload.paymentFailedReason || currentRecord?.paymentFailedReason || '',
      reviewedAt: payload.reviewedAt || currentRecord?.reviewedAt || '',
      reviewedBy: payload.reviewedBy || currentRecord?.reviewedBy || '',
      completionPercent: payload.completionPercent ?? currentRecord?.completionPercent ?? 0,
      paymentStartedAt: payload.paymentStartedAt || currentRecord?.paymentStartedAt || '',
      paymentCompletedAt: payload.paymentCompletedAt || currentRecord?.paymentCompletedAt || '',
      checkoutUrl: payload.checkoutUrl || currentRecord?.checkoutUrl || '',
    }));
  },
  markPaymentComplete(schoolRequestId: string, paymentDetails?: Partial<SchoolOnboardingRecord>) {
    const currentRecord = this.getBySchoolRequestId(schoolRequestId);
    if (!currentRecord) {
      return null;
    }

    return upsertRecord(buildBaseRecord({
      ...currentRecord,
      ...paymentDetails,
      schoolRequestId,
      paymentStatus: 'complete',
      paymentFailedReason: '',
      paymentReference: paymentDetails?.paymentReference || `PAY-${Date.now()}`,
      approvalStatus: currentRecord.approvalStatus === 'rejected' ? 'pending' : currentRecord.approvalStatus,
    }));
  },
  markPaymentFailed(schoolRequestId: string, reason = 'Payment was declined in demo mode.') {
    const currentRecord = this.getBySchoolRequestId(schoolRequestId);
    if (!currentRecord) {
      return null;
    }

    return upsertRecord(buildBaseRecord({
      ...currentRecord,
      schoolRequestId,
      paymentStatus: 'failed',
      paymentFailedReason: reason,
      paymentReference: '',
      approvalStatus: 'pending',
      reviewedAt: '',
      reviewedBy: '',
    }));
  },
  approve(schoolRequestId: string, reviewer = 'Super Admin') {
    const currentRecord = this.getBySchoolRequestId(schoolRequestId);
    if (!currentRecord) {
      return null;
    }

    return upsertRecord(buildBaseRecord({
      ...currentRecord,
      schoolRequestId,
      approvalStatus: 'approved',
      reviewedBy: reviewer,
      reviewedAt: new Date().toISOString(),
    }));
  },
  reject(schoolRequestId: string, reviewer = 'Super Admin') {
    const currentRecord = this.getBySchoolRequestId(schoolRequestId);
    if (!currentRecord) {
      return null;
    }

    return upsertRecord(buildBaseRecord({
      ...currentRecord,
      schoolRequestId,
      approvalStatus: 'rejected',
      reviewedBy: reviewer,
      reviewedAt: new Date().toISOString(),
    }));
  },
  getMostRelevantRecord(adminEmail?: string) {
    const records = readRecords();
    if (!records.length) {
      return null;
    }

    if (adminEmail) {
      const exactMatch = records
        .filter((entry) => entry.adminEmail.toLowerCase() === adminEmail.toLowerCase())
        .sort((left, right) => new Date(right.requestedAt).getTime() - new Date(left.requestedAt).getTime())[0];

      if (exactMatch) {
        return exactMatch;
      }
    }

    return records.sort((left, right) => new Date(right.requestedAt).getTime() - new Date(left.requestedAt).getTime())[0] || null;
  },
};