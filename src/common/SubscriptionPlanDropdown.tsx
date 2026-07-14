import PlanSelect from './PlanSelect';
import useSubscriptionPlans from '../hooks/useSubscriptionPlans';
import { SubscriptionPlan } from '../hooks/common/Plans';

const SubscriptionPlanDropdown = ({
  name = 'planId',
  label = 'Plan',
  value,
  onChange,
  required = false,
  error = '',
  disabled = false,
  detailsLink,
  emptyLabel = 'No active plans available',
}) => {
  const {
    data: plans = [] as SubscriptionPlan[],
    loading,
    error: requestError,
    refresh,
  } = useSubscriptionPlans();

  const activePlans = plans
    .filter((plan) => plan.isActive)
    .map((plan) => ({
      id: plan.id,
      name: `${plan.name} • ${plan.price}/${plan.billingCycle}`,
    }));

  return (
    <div>
      <PlanSelect
        name={name}
        label={label}
        required={required}
        value={value}
        onChange={onChange}
        optionValueKey="id"
        optionLabelKey="name"
        plans={activePlans}
        disabled={disabled || (loading && activePlans.length === 0)}
        error={error}
        detailsLink={detailsLink}
      />

      {requestError && (
        <div className="alert alert-warning py-2 mt-2 mb-0 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>Could not load plans from /api/plans.</span>
          <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => refresh()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !requestError && activePlans.length === 0 && (
        <small className="text-muted d-block mt-2">{emptyLabel}</small>
      )}
    </div>
  );
};

export default SubscriptionPlanDropdown;
