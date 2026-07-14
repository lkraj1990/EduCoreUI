import { Link } from 'react-router-dom';
import ApiState from '../../common/ApiState';
import PlanCatalog from '../../common/PlanCatalog';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';

const PlanDetailsPage = () => {
  const {
    data: plans = [],
    loading,
    error,
    refresh,
  } = useSubscriptionPlans();

  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="fw-bold mb-0">Plan Details</h2>
        <Link to="/register-school" className="btn btn-outline-secondary btn-sm">Back to Register School</Link>
      </div>

      <p className="text-muted mb-4">
        Review available subscription plans before final registration.
      </p>

      <div>
        <h5 className="fw-semibold mb-3">Available Plans</h5>
        <ApiState
          loading={loading}
          error={error}
          isEmpty={plans.length === 0}
          emptyMessage="No plans were returned by the API."
          onRetry={refresh}
        >
          <PlanCatalog
            plans={plans}
            actionRenderer={(plan) => (
              <Link
                to={`/register-school?plan=${encodeURIComponent(plan.name)}`}
                className={`btn ${plan.isActive ? 'btn-primary' : 'btn-outline-secondary disabled'} btn-sm w-100`}
                aria-disabled={!plan.isActive}
                onClick={(event) => {
                  if (!plan.isActive) {
                    event.preventDefault();
                  }
                }}
              >
                {plan.isActive ? 'Avail Now' : 'Unavailable'}
              </Link>
            )}
          />
        </ApiState>
      </div>
    </div>
  );
};

export default PlanDetailsPage;
