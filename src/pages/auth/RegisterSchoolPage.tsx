import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PlanSelect from '../../common/PlanSelect';
import usePlans from '../../hooks/usePlans';

const RegisterSchoolPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState('');
  const { data: plans = [], loading: plansLoading } = usePlans();

  useEffect(() => {
    const requestedPlan = searchParams.get('plan');

    if (!requestedPlan || plans.length === 0) {
      return;
    }

    const matchingPlan = plans.find((plan) => plan.name.toLowerCase() === requestedPlan.toLowerCase());
    if (matchingPlan) {
      setSelectedPlan(matchingPlan.name);
    }
  }, [plans, searchParams]);

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fw-bold mb-3">Register School</h2>
      <p className="text-muted">Onboard a new school into the EduCoreUi SaaS platform.</p>
      <form className="row g-3" onSubmit={(event) => event.preventDefault()}>
        <div className="col-md-6">
          <label className="form-label">School Name</label>
          <input className="form-control" placeholder="Bright Future School" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Admin Mobile Number</label>
          <input className="form-control" type="tel" placeholder="+91 98765 43210" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Admin Email</label>
          <input className="form-control" type="email" placeholder="admin@school.com" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Google Location (URL or Lat-Long)</label>
          <input
            className="form-control"
            placeholder="https://maps.google.com/... or 12.9716, 77.5946"
          />
        </div>
        <div className="col-12">
          <label className="form-label">School Address</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Enter complete school address"
          />
        </div>
        <div className="col-md-6">
          <PlanSelect
            value={selectedPlan}
            onChange={handlePlanChange}
            plans={plans}
            disabled={plansLoading}
            detailsLink={(
              <Link to="/register-school/plan-details" className="link-primary text-decoration-none fw-semibold">
                View Plan Details
              </Link>
            )}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Custom Domain</label>
          <input className="form-control" placeholder="bright.edu" />
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Create School</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterSchoolPage;
