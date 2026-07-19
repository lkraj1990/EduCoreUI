import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SchoolOnboardingProgress from '../../common/SchoolOnboardingProgress';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import {
  normalizeSchoolOnboardingProgress,
  normalizeSchoolRequestRecord,
  schoolService,
} from '../../services/schoolService';
import {
  normalizeSchoolPaymentStatus,
  schoolOnboardingService,
  type SchoolOnboardingRecord,
} from '../../services/schoolOnboardingService';

const SchoolRegistrationPaymentPage = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: plans = [] } = useSubscriptionPlans();
  const [school, setSchool] = useState<any>(null);
  const [onboardingRecord, setOnboardingRecord] = useState<SchoolOnboardingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isCompletingPayment, setIsCompletingPayment] = useState(false);

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
      paymentStatus: normalizeSchoolPaymentStatus(normalizedSchool.paymentStatus || normalizedProgress.paymentStatus),
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
      paymentStatus: normalizeSchoolPaymentStatus(school.paymentStatus || onboardingRecord?.paymentStatus),
      paymentReference: school.paymentReference,
      paymentFailedReason: school.paymentFailureReason,
      reviewedAt: school.reviewedAt,
      reviewedBy: school.reviewedBy,
      paymentStartedAt: school.paymentStartedAt,
      paymentCompletedAt: school.paymentCompletedAt,
    });

    setOnboardingRecord(nextRecord);
  }, [onboardingRecord?.amount, school, selectedPlan]);

  useEffect(() => {
    if (!schoolId) {
      return;
    }

    const locationState = location.state as { paymentSuccess?: boolean; paymentReference?: string } | null;
    if (!locationState?.paymentSuccess) {
      return;
    }

    setRequestMessage(locationState.paymentReference
      ? `Payment completed successfully. Reference: ${locationState.paymentReference}`
      : 'Payment completed successfully.');

    syncSchoolState(schoolId).catch(() => null);

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, schoolId]);

  const payableAmount = Number(selectedPlan?.price || onboardingRecord?.amount || 0);
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: onboardingRecord?.currency || 'INR',
  }).format(payableAmount);

  const handlePayClick = async () => {
    if (!schoolId || onboardingRecord?.paymentStatus === 'complete') {
      return;
    }

    setRequestError('');
    setRequestMessage('');
    setIsCompletingPayment(true);

    try {
      const paymentReference = `PAY-BYPASS-${Date.now()}`;
      await schoolService.updateSchoolRequestPaymentStatus(schoolId, {
        status: 'complete',
        paymentReference,
      });

      await syncSchoolState(schoolId);
      setRequestMessage(`Payment completed successfully. Reference: ${paymentReference}. Admin approval is now enabled.`);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to complete payment.');
    } finally {
      setIsCompletingPayment(false);
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
            <div className="col-md-6"><p className="mb-1"><strong>Amount:</strong> {formattedAmount}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Request ID:</strong> {school?.id}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Reference:</strong> {onboardingRecord?.paymentReference || 'Pending'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Started:</strong> {onboardingRecord?.paymentStartedAt ? new Date(onboardingRecord.paymentStartedAt).toLocaleString() : 'Not started'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Status:</strong> {onboardingRecord?.paymentStatus || 'initiated'}</p></div>
          </div>

          <div className="alert alert-info py-2 mb-3">
            TODO: Payment gateway integration is pending. For now, Pay action directly marks payment as complete.
          </div>

          {requestMessage ? <div className="alert alert-success py-2">{requestMessage}</div> : null}
          {requestError && school ? <div className="alert alert-danger py-2">{requestError}</div> : null}

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePayClick}
              disabled={onboardingRecord?.paymentStatus === 'complete' || isCompletingPayment}
            >
              {onboardingRecord?.paymentStatus === 'complete'
                ? `Paid ${formattedAmount}`
                : isCompletingPayment
                ? 'Processing...'
                : `Pay ${formattedAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistrationPaymentPage;