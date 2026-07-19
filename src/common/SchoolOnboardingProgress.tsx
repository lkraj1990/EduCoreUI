import {
  getSchoolOnboardingProgress,
  getSchoolOnboardingSteps,
  getSchoolRegistrationStatus,
  type SchoolOnboardingRecord,
} from '../services/schoolOnboardingService';

const statusClassMap = {
  Approved: 'bg-success',
  Rejected: 'bg-danger',
  'Payment Complete': 'bg-success',
  'Payment Failed': 'bg-danger',
  Requested: 'bg-warning text-dark',
};

interface SchoolOnboardingProgressProps {
  record: Partial<SchoolOnboardingRecord> | null;
  title?: string;
}

const SchoolOnboardingProgress = ({ record, title = 'Registration Progress' }: SchoolOnboardingProgressProps) => {
  const progress = getSchoolOnboardingProgress(record);
  const steps = getSchoolOnboardingSteps(record);
  const status = getSchoolRegistrationStatus(record);
  const badgeClassName = statusClassMap[status] || 'bg-secondary';

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h5 className="fw-bold mb-1">{title}</h5>
            <p className="text-muted mb-0">Track school onboarding from request to admin decision.</p>
          </div>
          <span className={`badge ${badgeClassName}`}>{status}</span>
        </div>

        <div className="progress mb-3" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`progress-bar ${status === 'Rejected' || status === 'Payment Failed' ? 'bg-danger' : 'bg-primary'}`}
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>

        <div className="row g-3">
          {steps.map((step) => (
            <div key={step.key} className="col-md-4">
              <div className={`border rounded-3 h-100 p-3 ${step.state === 'completed' ? 'border-success bg-success-subtle' : step.state === 'failed' ? 'border-danger bg-danger-subtle' : step.state === 'current' ? 'border-primary bg-primary-subtle' : 'border-light-subtle bg-light'}`}>
                <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                  <span className="fw-semibold">{step.title}</span>
                  <span className={`badge ${step.state === 'completed' ? 'bg-success' : step.state === 'failed' ? 'bg-danger' : step.state === 'current' ? 'bg-primary' : 'bg-secondary'}`}>
                    {step.state}
                  </span>
                </div>
                <p className="text-muted small mb-0">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolOnboardingProgress;