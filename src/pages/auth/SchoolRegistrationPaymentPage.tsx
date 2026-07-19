import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SchoolOnboardingProgress from '../../common/SchoolOnboardingProgress';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import {
  normalizeSchoolOnboardingProgress,
  normalizeSchoolRequestPaymentSession,
  normalizeSchoolRequestRecord,
  schoolService,
} from '../../services/schoolService';
import { schoolOnboardingService, type SchoolOnboardingRecord } from '../../services/schoolOnboardingService';

const SchoolRegistrationPaymentPage = () => {
  const { schoolId } = useParams();
  const { data: plans = [] } = useSubscriptionPlans();
  const [school, setSchool] = useState<any>(null);
  const [onboardingRecord, setOnboardingRecord] = useState<SchoolOnboardingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const syncSchoolState = async (requestId: string) => {
    const [schoolResponse, progressResponse] = await Promise.all([
      schoolService.getSchoolRequest(requestId),
      schoolService.getSchoolRequestProgress(requestId),
    ]);

    const normalizedSchool = normalizeSchoolRequestRecord(schoolResponse);
    const normalizedProgress = normalizeSchoolOnboardingProgress(progressResponse);
    const nextRecord = schoolOnboardingService.syncFromApi({
      schoolRequestId: normalizedSchool.id,
      schoolName: normalizedSchool.schoolName,
      adminName: normalizedSchool.adminName,
      adminEmail: normalizedSchool.adminEmail,
      adminMobile: normalizedSchool.adminMobile,
      location: normalizedSchool.location,
      planId: normalizedSchool.planId,
      planName: normalizedSchool.planName,
      requestedAt: normalizedSchool.submittedAt,
      requestStatus: normalizedProgress.requestStatus || normalizedSchool.status,
      paymentStatus: String(normalizedSchool.paymentStatus || normalizedProgress.paymentStatus || 'pending').toLowerCase(),
      paymentReference: normalizedSchool.paymentReference,
      paymentFailedReason: normalizedSchool.paymentFailureReason,
      reviewedAt: normalizedSchool.reviewedAt,
      reviewedBy: normalizedSchool.reviewedBy,
      completionPercent: normalizedProgress.completionPercent,
      paymentStartedAt: normalizedSchool.paymentStartedAt,
      paymentCompletedAt: normalizedSchool.paymentCompletedAt,
    });

    setSchool(normalizedSchool);
    setOnboardingRecord(nextRecord);

    return normalizedSchool;
  };

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      setRequestError('School registration request is missing.');
      return;
    }

    let isMounted = true;

    const loadSchoolRequest = async () => {
      setLoading(true);
      setRequestError('');

      try {
        const matchedSchool = await syncSchoolState(schoolId);
        if (!isMounted) {
          return;
        }

        if (!matchedSchool) {
          setRequestError('School registration request not found.');
          setLoading(false);
          return;
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setRequestError(error instanceof Error ? error.message : 'Failed to load registration payment details.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSchoolRequest().catch(() => null);

    return () => {
      isMounted = false;
    };
  }, [schoolId]);

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === school?.planId), [plans, school?.planId]);

  useEffect(() => {
    if (!school) {
      return;
    }

    const nextRecord = schoolOnboardingService.syncFromApi({
      schoolRequestId: school.id,
      schoolName: school.schoolName,
      adminName: school.adminName,
      adminEmail: school.adminEmail,
      adminMobile: school.adminMobile,
      location: school.location,
      planId: school.planId,
      planName: selectedPlan?.name || school.planName,
      requestedAt: school.submittedAt,
      amount: Number(selectedPlan?.price || onboardingRecord?.amount || 0),
      currency: 'INR',
      requestStatus: school.status,
      paymentStatus: String(school.paymentStatus || onboardingRecord?.paymentStatus || 'pending').toLowerCase(),
      paymentReference: school.paymentReference,
      paymentFailedReason: school.paymentFailureReason,
      reviewedAt: school.reviewedAt,
      reviewedBy: school.reviewedBy,
      paymentStartedAt: school.paymentStartedAt,
      paymentCompletedAt: school.paymentCompletedAt,
    });

    setOnboardingRecord(nextRecord);
  }, [onboardingRecord?.amount, school, selectedPlan]);

  const handleInitiatePayment = async () => {
    if (!schoolId) {
      return;
    }

    setIsSubmitting(true);
    setRequestMessage('');
    setRequestError('');

    try {
      const paymentSessionResponse = await schoolService.startSchoolRequestPayment(schoolId);
      const paymentSession = normalizeSchoolRequestPaymentSession(paymentSessionResponse);

      const nextRecord = schoolOnboardingService.syncFromApi({
        schoolRequestId: schoolId,
        paymentStatus: String(paymentSession.paymentStatus || 'pending').toLowerCase(),
        paymentReference: paymentSession.paymentReference,
        paymentStartedAt: paymentSession.startedAt,
        checkoutUrl: paymentSession.checkoutUrl,
      });

      setOnboardingRecord(nextRecord);
      setRequestMessage(paymentSession.checkoutUrl
        ? 'Payment session started. Use the checkout link or mark the final result below.'
        : 'Payment session started. Mark the final result below after payment response.');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to start payment session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentStatusUpdate = async (status: 'complete' | 'failed') => {
    if (!schoolId) {
      return;
    }

    setIsSubmitting(true);
    setRequestMessage('');
    setRequestError('');

    try {
      const updatedSchoolResponse = await schoolService.updateSchoolRequestPaymentStatus(schoolId, {
        status,
        paymentReference: onboardingRecord?.paymentReference || undefined,
        failureReason: status === 'failed' ? 'Payment was not completed by the school.' : undefined,
      });

      const normalizedSchool = normalizeSchoolRequestRecord(updatedSchoolResponse);
      const progressResponse = await schoolService.getSchoolRequestProgress(schoolId);
      const normalizedProgress = normalizeSchoolOnboardingProgress(progressResponse);
      const nextRecord = schoolOnboardingService.syncFromApi({
        schoolRequestId: normalizedSchool.id,
        schoolName: normalizedSchool.schoolName,
        adminName: normalizedSchool.adminName,
        adminEmail: normalizedSchool.adminEmail,
        adminMobile: normalizedSchool.adminMobile,
        location: normalizedSchool.location,
        planId: normalizedSchool.planId,
        planName: selectedPlan?.name || normalizedSchool.planName,
        requestedAt: normalizedSchool.submittedAt,
        requestStatus: normalizedProgress.requestStatus || normalizedSchool.status,
        paymentStatus: String(normalizedSchool.paymentStatus || normalizedProgress.paymentStatus || 'pending').toLowerCase(),
        paymentReference: normalizedSchool.paymentReference,
        paymentFailedReason: normalizedSchool.paymentFailureReason,
        reviewedAt: normalizedSchool.reviewedAt,
        reviewedBy: normalizedSchool.reviewedBy,
        completionPercent: normalizedProgress.completionPercent,
        paymentStartedAt: normalizedSchool.paymentStartedAt,
        paymentCompletedAt: normalizedSchool.paymentCompletedAt,
      });

      setSchool(normalizedSchool);
      setOnboardingRecord(nextRecord);
      setRequestMessage(status === 'complete'
        ? 'Payment completed. Super Admin approval is now unlocked.'
        : 'Payment failed. Retry is required before admin approval.');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to update payment state.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">School Registration Payment</h2>
          <p className="text-muted mb-0">Loading payment stage...</p>
        </div>
      </div>
    );
  }

  if (requestError && !school) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">School Registration Payment</h2>
          <p className="text-muted mb-3">{requestError}</p>
          <Link to="/register-school" className="btn btn-outline-secondary btn-sm">Back to Register School</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-grid gap-4">
      <SchoolOnboardingProgress record={onboardingRecord} title="School Admin Registration Progress" />

      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-lg-5">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-1">Complete Registration Payment</h2>
              <p className="text-muted mb-0">Registration has been requested. Payment is the next required step.</p>
            </div>
            <Link to="/register-school" className="btn btn-outline-secondary btn-sm">Back to Registration</Link>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6"><p className="mb-1"><strong>School:</strong> {school?.schoolName || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Admin Email:</strong> {school?.adminEmail || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Plan:</strong> {selectedPlan?.name || school?.planName || school?.planId || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Amount:</strong> {new Intl.NumberFormat('en-IN', { style: 'currency', currency: onboardingRecord?.currency || 'INR' }).format(Number(selectedPlan?.price || onboardingRecord?.amount || 0))}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Request ID:</strong> {school?.id}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Reference:</strong> {onboardingRecord?.paymentReference || 'Pending'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Started:</strong> {onboardingRecord?.paymentStartedAt ? new Date(onboardingRecord.paymentStartedAt).toLocaleString() : 'Not started'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Checkout URL:</strong> {onboardingRecord?.checkoutUrl ? <a href={onboardingRecord.checkoutUrl} target="_blank" rel="noreferrer">Open Checkout</a> : 'Will appear after payment initiation'}</p></div>
          </div>

          {requestMessage ? <div className="alert alert-success py-2">{requestMessage}</div> : null}
          {requestError && school ? <div className="alert alert-danger py-2">{requestError}</div> : null}

          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={handleInitiatePayment} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Start Payment'}
            </button>
            <button type="button" className="btn btn-success" onClick={() => handlePaymentStatusUpdate('complete')} disabled={isSubmitting}>
              Mark Payment Complete
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={() => handlePaymentStatusUpdate('failed')} disabled={isSubmitting}>
              Mark Payment Failed
            </button>
            <Link to="/school-admin" className="btn btn-outline-secondary">
              Open School Admin Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistrationPaymentPage;