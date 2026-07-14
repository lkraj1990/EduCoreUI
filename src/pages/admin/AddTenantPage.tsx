import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PlanSelect from '../../common/PlanSelect';
import usePlans from '../../hooks/usePlans';
import { addTenant } from '../../redux/slices/tenantSlice';

const initialFormData = {
  name: '',
  domain: '',
  plan: 'Basic',
  status: 'Active',
  tenantId: '',
};

const AddTenantPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const { data: plans = [], loading: plansLoading } = usePlans();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = 'School Name is required';
    }
    if (!formData.domain.trim()) {
      nextErrors.domain = 'Custom Domain is required';
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const selectedPlan = plans.find((plan) => plan.name === formData.plan);

    dispatch(addTenant({
      ...formData,
      planId: selectedPlan?.id || '',
      subscriptionStatus: 'Not Linked',
      billingCycle: selectedPlan?.billingCycleLabel || 'monthly',
      autoRenew: true,
    }));
    navigate('/tenant-management');
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Add New Tenant</h2>
            <p className="text-muted mb-0">Create a new school tenant using the details below.</p>
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/tenant-management')}>
            View Tenants List
          </button>
        </div>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">School Name <span className="text-danger">*</span></label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Enter school name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Custom Domain <span className="text-danger">*</span></label>
            <input
              type="text"
              name="domain"
              className={`form-control ${errors.domain ? 'is-invalid' : ''}`}
              placeholder="e.g., bright.edu"
              value={formData.domain}
              onChange={handleChange}
            />
            {errors.domain && <div className="invalid-feedback d-block">{errors.domain}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Backend Tenant ID <span className="text-muted small">(optional)</span></label>
            <input
              type="text"
              name="tenantId"
              className="form-control"
              placeholder="UUID used by the subscription API"
              value={formData.tenantId}
              onChange={handleChange}
            />
            <div className="form-text">Provide this when the tenant already exists in the backend.</div>
          </div>

          <div className="col-md-6">
            <PlanSelect
              name="plan"
              label="Subscription Plan"
              value={formData.plan}
              onChange={handleChange}
              plans={plans}
              disabled={plansLoading}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="col-12 d-flex gap-2 justify-content-end mt-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/tenant-management')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenantPage;
