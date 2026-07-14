import ApiState from '../../common/ApiState';
import PlanCatalog from '../../common/PlanCatalog';
import usePlans from '../../hooks/usePlans';

const PricingPage = () => {
  const {
    data: plans = [],
    loading,
    error,
    refresh,
  } = usePlans();

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold mb-1">Subscription Plans</h2>
          <p className="text-muted mb-0">Live plan catalog from the billing API.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => refresh()}>
          Refresh Plans
        </button>
      </div>

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
  );
}

export default PricingPage;
