const PricingPage = () => {
  const plans = [
    { name: 'Free Trial', price: '$0', features: ['1 school', 'Basic dashboard', 'Email support'] },
    { name: 'Basic', price: '$29', features: ['10 staff', 'Student records', 'Attendance'] },
    { name: 'Premium', price: '$99', features: ['Unlimited students', 'Fees & exams', 'White label'] },
  ];

  return (
    <div>
      <h2 className="fw-bold mb-3">Subscription Plans</h2>
      <div className="row g-3">
        {plans.map((plan) => (
          <div className="col-md-4" key={plan.name}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5>{plan.name}</h5>
                <h3 className="fw-bold">{plan.price}<small className="text-muted">/mo</small></h3>
                <ul className="mt-3">
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <button className="btn btn-outline-primary mt-3">Choose Plan</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
