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

  const getNodeClassName = (state: string) => {
    if (state === 'completed') {
      return 'completed';
    }

    if (state === 'current') {
      return 'current';
    }

    if (state === 'failed') {
      return 'failed';
    }

    return 'upcoming';
  };

  const getNodeLabel = (state: string) => {
    if (state === 'completed') {
      return 'completed';
    }

    if (state === 'current') {
      return 'current';
    }

    if (state === 'failed') {
      return 'failed';
    }

    return 'upcoming';
  };

  const getNodeIcon = (state: string) => {
    if (state === 'completed') {
      return '✓';
    }

    if (state === 'failed') {
      return '!';
    }

    return '';
  };

  const getConnectorClassName = (leftState: string, rightState: string) => {
    if (leftState === 'failed' || rightState === 'failed') {
      return 'failed';
    }

    if (leftState === 'completed' || rightState === 'current') {
      return 'filled';
    }

    return 'upcoming';
  };

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

        <div className="school-progress-rail" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          {steps.map((step, index) => {
            const nodeClassName = getNodeClassName(step.state);
            const nodeLabel = getNodeLabel(step.state);
            const icon = getNodeIcon(step.state);
            const nextStep = steps[index + 1];
            const connectorClassName = nextStep
              ? getConnectorClassName(step.state, nextStep.state)
              : '';

            return (
              <div key={step.key} className="school-progress-step">
                <div className={`school-progress-node school-progress-node-${nodeClassName}`} aria-label={`${step.title} ${nodeLabel}`}>
                  <span>{icon}</span>
                </div>
                <div className="school-progress-step-meta">
                  <p className="school-progress-step-title mb-0">{step.title}</p>
                  <p className="school-progress-step-description mb-0">{step.description}</p>
                </div>
                {nextStep ? <div className={`school-progress-connector school-progress-connector-${connectorClassName}`} aria-hidden="true" /> : null}
              </div>
            );
          })}
        </div>

        <div className="d-flex justify-content-end mt-2">
          <div className="small text-muted">
            <strong>{progress}%</strong> completed
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolOnboardingProgress;