import { useEffect, useMemo, useState } from 'react';
import SchoolOnboardingProgress from '../../common/SchoolOnboardingProgress';
import { useAuth } from '../../context/AuthContext';
import { normalizeSchoolOnboardingProgress, normalizeSchoolRequestRecord, schoolService } from '../../services/schoolService';
import { schoolOnboardingService } from '../../services/schoolOnboardingService';

const SchoolAdminPage = () => {
  const { currentUser } = useAuth();
  const cachedRecord = useMemo(
    () => schoolOnboardingService.getMostRelevantRecord(currentUser?.email),
    [currentUser?.email],
  );
  const [onboardingRecord, setOnboardingRecord] = useState(cachedRecord);

  useEffect(() => {
    setOnboardingRecord(cachedRecord);

    if (!cachedRecord?.schoolRequestId) {
      return;
    }

    let isMounted = true;

    const refreshOnboardingProgress = async () => {
      try {
        const [schoolResponse, progressResponse] = await Promise.all([
          schoolService.getSchoolRequest(cachedRecord.schoolRequestId),
          schoolService.getSchoolRequestProgress(cachedRecord.schoolRequestId),
        ]);

        if (!isMounted) {
          return;
        }

        const school = normalizeSchoolRequestRecord(schoolResponse);
        const progress = normalizeSchoolOnboardingProgress(progressResponse);
        const nextRecord = schoolOnboardingService.syncFromApi({
          ...cachedRecord,
          schoolRequestId: school.id,
          schoolName: school.schoolName,
          adminName: school.adminName,
          adminEmail: school.adminEmail,
          adminMobile: school.adminMobile,
          location: school.location,
          planId: school.planId,
          planName: school.planName,
          requestedAt: school.submittedAt,
          requestStatus: progress.requestStatus || school.status,
          paymentStatus: String(school.paymentStatus || progress.paymentStatus || 'pending').toLowerCase(),
          paymentReference: school.paymentReference,
          paymentFailedReason: school.paymentFailureReason,
          reviewedAt: school.reviewedAt,
          reviewedBy: school.reviewedBy,
          completionPercent: progress.completionPercent,
          paymentStartedAt: school.paymentStartedAt,
          paymentCompletedAt: school.paymentCompletedAt,
        });

        setOnboardingRecord(nextRecord);
      } catch {
        setOnboardingRecord(cachedRecord);
      }
    };

    refreshOnboardingProgress().catch(() => null);

    return () => {
      isMounted = false;
    };
  }, [cachedRecord]);

  return (
    <div>
      <h2 className="fw-bold mb-3">School Admin Dashboard</h2>
      <div className="mb-4">
        <SchoolOnboardingProgress record={onboardingRecord} title="School Registration Progress" />
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="card border-0 bg-light"><div className="card-body"><h6>Students</h6><h3>1,240</h3></div></div></div>
        <div className="col-md-4"><div className="card border-0 bg-light"><div className="card-body"><h6>Staff</h6><h3>86</h3></div></div></div>
        <div className="col-md-4"><div className="card border-0 bg-light"><div className="card-body"><h6>Fees Collected</h6><h3>$84k</h3></div></div></div>
      </div>
      <div className="row g-3">
        <div className="col-md-6"><div className="card shadow-sm border-0 h-100"><div className="card-body"><h5>Academic Summary</h5><p className="text-muted mb-0">Classes, sessions, timetables and LMS modules ready for expansion.</p></div></div></div>
        <div className="col-md-6"><div className="card shadow-sm border-0 h-100"><div className="card-body"><h5>Communication Center</h5><p className="text-muted mb-0">SMS, email, WhatsApp and in-app notifications can be managed from here.</p></div></div></div>
      </div>
    </div>
  );
}

export default SchoolAdminPage;
