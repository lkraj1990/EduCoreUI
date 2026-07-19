import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SchoolOnboardingProgress from '../../common/SchoolOnboardingProgress';
import {
  normalizeSchoolOnboardingProgress,
  normalizeSchoolRequestRecord,
  schoolService,
  type SchoolRequestRecord,
} from '../../services/schoolService';
import { getSchoolRegistrationStatus, schoolOnboardingService, type SchoolOnboardingRecord } from '../../services/schoolOnboardingService';

const SchoolRegistrationDetailsPage = () => {
  const { schoolId } = useParams();
  const [school, setSchool] = useState<SchoolRequestRecord | null>(null);
  const [onboardingRecord, setOnboardingRecord] = useState<SchoolOnboardingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const loadSchoolDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const [schoolResponse, progressResponse] = await Promise.all([
          schoolService.getSchoolRequest(schoolId),
          schoolService.getSchoolRequestProgress(schoolId),
        ]);
        const matchedSchool = normalizeSchoolRequestRecord(schoolResponse);
        const progress = normalizeSchoolOnboardingProgress(progressResponse);
        setSchool(matchedSchool);

        if (matchedSchool) {
          const localRecord = schoolOnboardingService.syncFromApi({
            schoolRequestId: matchedSchool.id,
            schoolName: matchedSchool.schoolName,
            adminName: matchedSchool.adminName,
            adminEmail: matchedSchool.adminEmail,
            adminMobile: matchedSchool.adminMobile,
            location: matchedSchool.location,
            planId: matchedSchool.planId,
            planName: matchedSchool.planName,
            requestedAt: matchedSchool.submittedAt,
            requestStatus: progress.requestStatus || matchedSchool.status,
            paymentStatus: String(matchedSchool.paymentStatus || progress.paymentStatus || 'pending').toLowerCase(),
            paymentReference: matchedSchool.paymentReference,
            paymentFailedReason: matchedSchool.paymentFailureReason,
            reviewedAt: matchedSchool.reviewedAt,
            reviewedBy: matchedSchool.reviewedBy,
            completionPercent: progress.completionPercent,
            paymentStartedAt: matchedSchool.paymentStartedAt,
            paymentCompletedAt: matchedSchool.paymentCompletedAt,
          });

          setOnboardingRecord(localRecord);
        }
      } catch (requestError) {
        setError(requestError?.message || 'Failed to load school request details.');
      } finally {
        setLoading(false);
      }
    };

    loadSchoolDetails().catch(() => null);
  }, [schoolId]);

  const submittedOnLabel = useMemo(() => {
    if (!school?.submittedAt) {
      return 'N/A';
    }

    const parsedDate = new Date(school.submittedAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return school.submittedAt;
    }

    return parsedDate.toLocaleString();
  }, [school]);

  const reviewedOnLabel = useMemo(() => {
    const reviewedAt = onboardingRecord?.reviewedAt || school?.reviewedAt;

    if (!reviewedAt) {
      return 'N/A';
    }

    const parsedDate = new Date(reviewedAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return reviewedAt;
    }

    return parsedDate.toLocaleString();
  }, [onboardingRecord?.reviewedAt, school]);

  const registrationStatus = getSchoolRegistrationStatus(onboardingRecord);
  const canReview = onboardingRecord?.paymentStatus === 'complete' && onboardingRecord?.approvalStatus === 'pending';

  const handleApprove = () => {
    if (!schoolId) {
      return;
    }

    const approve = async () => {
      const [schoolResponse, progressResponse] = await Promise.all([
        schoolService.approveSchoolRequest(schoolId),
        schoolService.getSchoolRequestProgress(schoolId),
      ]);

      const normalizedSchool = normalizeSchoolRequestRecord(schoolResponse);
      const progress = normalizeSchoolOnboardingProgress(progressResponse);
      setSchool(normalizedSchool);
      setOnboardingRecord(schoolOnboardingService.syncFromApi({
        schoolRequestId: normalizedSchool.id,
        schoolName: normalizedSchool.schoolName,
        adminName: normalizedSchool.adminName,
        adminEmail: normalizedSchool.adminEmail,
        adminMobile: normalizedSchool.adminMobile,
        location: normalizedSchool.location,
        planId: normalizedSchool.planId,
        planName: normalizedSchool.planName,
        requestedAt: normalizedSchool.submittedAt,
        requestStatus: progress.requestStatus || normalizedSchool.status,
        paymentStatus: String(normalizedSchool.paymentStatus || progress.paymentStatus || 'pending').toLowerCase(),
        paymentReference: normalizedSchool.paymentReference,
        paymentFailedReason: normalizedSchool.paymentFailureReason,
        reviewedAt: normalizedSchool.reviewedAt,
        reviewedBy: normalizedSchool.reviewedBy,
        completionPercent: progress.completionPercent,
        paymentStartedAt: normalizedSchool.paymentStartedAt,
        paymentCompletedAt: normalizedSchool.paymentCompletedAt,
      }));
      setRequestMessage('School request approved.');
    };

    approve().catch((requestError) => {
      setRequestMessage('');
      setError(requestError instanceof Error ? requestError.message : 'Approval failed.');
    });
  };

  const handleReject = () => {
    if (!schoolId) {
      return;
    }

    const reject = async () => {
      const [schoolResponse, progressResponse] = await Promise.all([
        schoolService.rejectSchoolRequest(schoolId),
        schoolService.getSchoolRequestProgress(schoolId),
      ]);

      const normalizedSchool = normalizeSchoolRequestRecord(schoolResponse);
      const progress = normalizeSchoolOnboardingProgress(progressResponse);
      setSchool(normalizedSchool);
      setOnboardingRecord(schoolOnboardingService.syncFromApi({
        schoolRequestId: normalizedSchool.id,
        schoolName: normalizedSchool.schoolName,
        adminName: normalizedSchool.adminName,
        adminEmail: normalizedSchool.adminEmail,
        adminMobile: normalizedSchool.adminMobile,
        location: normalizedSchool.location,
        planId: normalizedSchool.planId,
        planName: normalizedSchool.planName,
        requestedAt: normalizedSchool.submittedAt,
        requestStatus: progress.requestStatus || normalizedSchool.status,
        paymentStatus: String(normalizedSchool.paymentStatus || progress.paymentStatus || 'pending').toLowerCase(),
        paymentReference: normalizedSchool.paymentReference,
        paymentFailedReason: normalizedSchool.paymentFailureReason,
        reviewedAt: normalizedSchool.reviewedAt,
        reviewedBy: normalizedSchool.reviewedBy,
        completionPercent: progress.completionPercent,
        paymentStartedAt: normalizedSchool.paymentStartedAt,
        paymentCompletedAt: normalizedSchool.paymentCompletedAt,
      }));
      setRequestMessage('School request rejected.');
    };

    reject().catch((requestError) => {
      setRequestMessage('');
      setError(requestError instanceof Error ? requestError.message : 'Rejection failed.');
    });
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">School Details</h2>
          <p className="text-muted mb-0">Loading school request details...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">School Details</h2>
          <p className="text-muted mb-3">{error || 'Requested school details not found.'}</p>
          <Link to="/school-registration" className="btn btn-outline-secondary btn-sm">
            Back to School Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-grid gap-4">
      <SchoolOnboardingProgress record={onboardingRecord} title="School Onboarding Status" />

      <div className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h2 className="fw-bold mb-1">{school.schoolName}</h2>
            <p className="text-muted mb-0">School registration request details</p>
          </div>
          <Link to="/school-registration" className="btn btn-outline-secondary btn-sm">
            Back to School Registration
          </Link>
        </div>

        {requestMessage ? <div className="alert alert-success py-2 mb-4">{requestMessage}</div> : null}
        {error ? <div className="alert alert-danger py-2 mb-4">{error}</div> : null}

        <div className="row g-3">
          <div className="col-md-6"><p className="mb-1"><strong>Admin Name:</strong> {school.adminName || 'N/A'}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Admin Email:</strong> {school.adminEmail}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Admin Mobile:</strong> {school.adminMobile}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Plan:</strong> {school.planName || school.planId || 'N/A'}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Status:</strong> {registrationStatus}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Location:</strong> {school.location}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Submitted On:</strong> {submittedOnLabel}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Reviewed By:</strong> {onboardingRecord?.reviewedBy || school.reviewedBy || 'N/A'}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Reviewed On:</strong> {reviewedOnLabel}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Payment Reference:</strong> {onboardingRecord?.paymentReference || 'Pending'}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Payment Failure Reason:</strong> {onboardingRecord?.paymentFailedReason || 'N/A'}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Payment Started At:</strong> {onboardingRecord?.paymentStartedAt ? new Date(onboardingRecord.paymentStartedAt).toLocaleString() : 'N/A'}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Payment Completed At:</strong> {onboardingRecord?.paymentCompletedAt ? new Date(onboardingRecord.paymentCompletedAt).toLocaleString() : 'N/A'}</p></div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-4">
          <Link to={`/register-school/${school.id}/payment`} className="btn btn-outline-primary">
            Open Payment Stage
          </Link>
          <button type="button" className="btn btn-success" onClick={handleApprove} disabled={!canReview}>
            Approve
          </button>
          <button type="button" className="btn btn-outline-danger" onClick={handleReject} disabled={!canReview}>
            Reject
          </button>
        </div>
        {!canReview ? <p className="text-muted small mt-3 mb-0">Approve or reject becomes available only after payment is complete.</p> : null}
      </div>
    </div>
    </div>
  );
};

export default SchoolRegistrationDetailsPage;
