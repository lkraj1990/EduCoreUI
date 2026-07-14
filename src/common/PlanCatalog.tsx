const PlanCatalog = ({ plans, actionRenderer }) => {
  return (
    <div className="row g-3">
      {plans.map((plan) => (
        <div className="col-md-4" key={plan.id || plan.name}>
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                <div>
                  <h5 className="mb-1">{plan.name}</h5>
                  <small className="text-muted text-capitalize">Billed per {plan.billingCycleLabel}</small>
                </div>
                <span className={`badge ${plan.isActive ? 'bg-success' : 'bg-secondary'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="fw-bold mb-0">
                {plan.priceDisplay}
                <small className="text-muted">/{plan.billingCycleLabel}</small>
              </h3>

              <ul className="mt-3 mb-4 ps-3">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              {actionRenderer && <div className="mt-auto">{actionRenderer(plan)}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanCatalog;