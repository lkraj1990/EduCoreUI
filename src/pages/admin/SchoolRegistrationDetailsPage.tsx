import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SchoolRegistrationDetailsCard from '../../common/SchoolRegistrationDetailsCard';
import SchoolOnboardingProgress from '../../common/SchoolOnboardingProgress';
import {
  normalizeSchoolOnboardingProgress,
  normalizeSchoolRequestRecord,
  schoolService,
  type SchoolRequestRecord,
} from '../../services/schoolService';
import {
  getSchoolRegistrationStatus,
  normalizeSchoolPaymentStatus,
  schoolOnboardingService,
  type SchoolOnboardingRecord,
} from '../../services/schoolOnboardingService';
import { schoolAdminProvisioningService } from '../../services/schoolAdminProvisioningService';

const resolveApprovalStatus = (status?: string, approved?: boolean, rejected?: boolean) => {
  if (approved || String(status || '').toLowerCase() === 'approved') {
    return 'approved';
  }

  if (rejected || String(status || '').toLowerCase() === 'rejected') {
    return 'rejected';
  }

  return 'pending';
};

const SchoolRegistrationDetailsPage = () => {
  const { schoolId } = useParams();
  const [school, setSchool] = useState<SchoolRequestRecord | null>(null);
  const [onboardingRecord, setOnboardingRecord] = useState<SchoolOnboardingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
            paymentStatus: normalizeSchoolPaymentStatus(matchedSchool.paymentStatus || progress.paymentStatus),
            approvalStatus: resolveApprovalStatus(matchedSchool.status, progress.approved, progress.rejected),
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

  const effectivePaymentStatus = normalizeSchoolPaymentStatus(onboardingRecord?.paymentStatus || school?.paymentStatus);
  const effectiveApprovalStatus = onboardingRecord?.approvalStatus || resolveApprovalStatus(school?.status);
  const registrationStatus = getSchoolRegistrationStatus({
    ...onboardingRecord,
    paymentStatus: effectivePaymentStatus,
    approvalStatus: effectiveApprovalStatus,
  });
  const canReview = effectivePaymentStatus === 'complete' && effectiveApprovalStatus === 'pending';

  const handleApprove = () => {
    if (!schoolId) {
      return;
    }

    if (!canReview || isSubmittingReview) {
      return;
    }

    setIsSubmittingReview(true);
    setError('');
    setRequestMessage('');

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
        paymentStatus: normalizeSchoolPaymentStatus(normalizedSchool.paymentStatus || progress.paymentStatus),
        approvalStatus: resolveApprovalStatus(normalizedSchool.status, progress.approved, progress.rejected),
        paymentReference: normalizedSchool.paymentReference,
        paymentFailedReason: normalizedSchool.paymentFailureReason,
        reviewedAt: normalizedSchool.reviewedAt,
        reviewedBy: normalizedSchool.reviewedBy,
        completionPercent: progress.completionPercent,
        paymentStartedAt: normalizedSchool.paymentStartedAt,
        paymentCompletedAt: normalizedSchool.paymentCompletedAt,
      }));

      if (normalizedSchool.adminEmail) {
        schoolAdminProvisioningService.upsert({
          name: normalizedSchool.adminName || normalizedSchool.schoolName || 'School Admin',
          email: normalizedSchool.adminEmail,
          password: 'admin123',
          tenant: normalizedSchool.schoolName || 'School Tenant',
        });
      }

      setRequestMessage('School request approved. School Admin user has been created (default password: admin123).');
    };

    approve().catch((requestError) => {
      setRequestMessage('');
      setError(requestError instanceof Error ? requestError.message : 'Approval failed.');
    }).finally(() => {
      setIsSubmittingReview(false);
    });
  };

  const handleReject = () => {
    if (!schoolId) {
      return;
    }

    if (!canReview || isSubmittingReview) {
      return;
    }

    setIsSubmittingReview(true);
    setError('');
    setRequestMessage('');

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
        paymentStatus: normalizeSchoolPaymentStatus(normalizedSchool.paymentStatus || progress.paymentStatus),
        approvalStatus: resolveApprovalStatus(normalizedSchool.status, progress.approved, progress.rejected),
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
    }).finally(() => {
      setIsSubmittingReview(false);
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
      <SchoolRegistrationDetailsCard
        school={school}
        onboardingRecord={onboardingRecord}
        title={school.schoolName}
        subtitle="School registration request details"
        statusLabel={registrationStatus}
        topAlert={(
          <>
            {requestMessage ? <div className="alert alert-success py-2 mb-4">{requestMessage}</div> : null}
            {error ? <div className="alert alert-danger py-2 mb-4">{error}</div> : null}
          </>
        )}
        headerActions={(
          <Link to="/school-registration" className="btn btn-outline-secondary btn-sm">
            Back to School Registration
          </Link>
        )}
        footer={(
          <>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-success" onClick={handleApprove} disabled={!canReview || isSubmittingReview}>
                Approve
              </button>
              <button type="button" className="btn btn-outline-danger" onClick={handleReject} disabled={!canReview || isSubmittingReview}>
                Reject
              </button>
            </div>
            {!canReview ? <p className="text-muted small mt-3 mb-0">Approve or reject becomes available only after payment is complete.</p> : null}
          </>
        )}
      />
    </div>
  );
};

export default SchoolRegistrationDetailsPage;
