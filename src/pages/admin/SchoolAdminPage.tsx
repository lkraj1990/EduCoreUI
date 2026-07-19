import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMockModulesForSubscription } from '../../mockupData/subscriptionModules';
import { normalizeSchoolOnboardingProgress, normalizeSchoolRequestRecord, schoolService } from '../../services/schoolService';
import { normalizeSchoolPaymentStatus, schoolOnboardingService } from '../../services/schoolOnboardingService';

const SchoolAdminPage = () => {
  const { currentUser } = useAuth();
  const cachedRecord = useMemo(
    () => schoolOnboardingService.getMostRelevantRecord(currentUser?.email),
    [currentUser?.email],
  );
  const [onboardingRecord, setOnboardingRecord] = useState(cachedRecord);

  const schoolName = onboardingRecord?.schoolName || currentUser?.tenant || 'My School';
  const activePlan = onboardingRecord?.planName || onboardingRecord?.planId || 'Basic';
  const includedModules = useMemo(() => getMockModulesForSubscription(activePlan), [activePlan]);

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
          paymentStatus: normalizeSchoolPaymentStatus(school.paymentStatus || progress.paymentStatus),
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
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <span className="text-muted text-uppercase small fw-semibold">Dashboard</span>
          <h2 className="fw-bold mb-1 mt-2">{schoolName}</h2>
          <p className="text-muted mb-0">School Admin Dashboard</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 bg-light h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">School</h6>
              <h4 className="mb-0">{schoolName}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-light h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Active Subscription</h6>
              <h4 className="mb-0">{activePlan}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-light h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Enabled Modules</h6>
              <h4 className="mb-0">{includedModules.length}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {includedModules.map((module) => (
          <div className="col-md-6 col-xl-4" key={module.id}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="text-muted small mb-1">{module.category}</div>
                <h5 className="mb-2">{module.title}</h5>
                <p className="text-muted mb-0">{module.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchoolAdminPage;
