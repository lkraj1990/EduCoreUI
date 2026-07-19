import ApiState from '../../common/ApiState';
import PlanCatalog from '../../common/PlanCatalog';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';

const PricingPage = () => {
  const {
    data: plans = [],
    loading,
    error,
    refresh,
  } = useSubscriptionPlans();

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header page-card-header">
        <div className="page-header-wrap">
          <div>
            <h2 className="fw-bold mb-1">Subscription Plans</h2>
            <p className="text-muted mb-0">Live plan catalog from the billing API.</p>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => window.location.href = '/super-admin/create-plan'}>Add New Plans</button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => window.location.href = '/settings'}>White Label Settings</button>
          </div>
        </div>
      </div>

      <div className="card-body p-4 p-lg-5">
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
              <button type="button" className="btn btn-outline-primary w-100" disabled={!plan.isActive}>
                {plan.isActive ? 'Choose Plan' : 'Unavailable'}
              </button>
            )}
          />
        </ApiState>
      </div>
    </div>
  );
}

export default PricingPage;
