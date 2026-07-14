import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SubscriptionPlanDropdown from '../../common/SubscriptionPlanDropdown';
import useSchools from '../../hooks/useSchools';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import { addTenant } from '../../redux/slices/tenantSlice';
import { subscriptionService } from '../../services';

const initialFormData = {
  name: '',
  domain: '',
  planId: '',
  status: 'Active',
  tenantId: '',
};

const AddTenantPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: plans = [] } = useSubscriptionPlans();
  const {
    data: schools = [],
    loading: schoolsLoading,
    error: schoolsError,
    refresh: refreshSchools,
  } = useSchools();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      if (name === 'name') {
        const selectedSchool = schools.find((school) => school.name === value);
        return {
          ...prev,
          name: value,
          domain: selectedSchool?.domain || '',
        };
      }

      return { ...prev, [name]: value };
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === 'name' && errors.domain) {
      setErrors((prev) => ({ ...prev, domain: '' }));
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

    if (!formData.planId) {
      nextErrors.planId = 'Subscription Plan is required';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRequestError('');

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPlan = plans.find((plan) => plan.id === formData.planId);
      let createdSubscription = null;

      if (formData.tenantId.trim()) {
        createdSubscription = await subscriptionService.createSubscription({
          tenantId: formData.tenantId.trim(),
          planId: formData.planId,
          billingCycle: selectedPlan?.billingCycle || 'monthly',
          autoRenew: true,
        });
      }

      dispatch(addTenant({
        ...formData,
        plan: selectedPlan?.name || '',
        subscriptionId: createdSubscription?.id || '',
        subscriptionStatus: createdSubscription?.status || 'Not Linked',
        billingCycle: createdSubscription?.billingCycle || selectedPlan?.billingCycle || 'monthly',
        autoRenew: createdSubscription?.autoRenew ?? true,
      }));
      navigate('/tenant-management');
    } catch (error) {
      setRequestError(error.message || 'Failed to create subscription using /api/subscriptions.');
    } finally {
      setIsSubmitting(false);
    }
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
            <select
              name="name"
              className={`form-select ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              disabled={schoolsLoading}
            >
              <option value="">Select School (null if not present)</option>
              {schools.map((school) => (
                <option key={school.id || school.name} value={school.name}>{school.name}</option>
              ))}
            </select>
            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
            {schoolsError && (
              <div className="alert alert-warning py-2 mt-2 mb-0 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <span>Could not load schools from DB API.</span>
                <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => refreshSchools()}>
                  Retry
                </button>
              </div>
            )}
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
            <SubscriptionPlanDropdown
              name="planId"
              label="Subscription Plan"
              required
              value={formData.planId}
              onChange={handleChange}
              error={errors.planId}
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

          {requestError && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{requestError}</div></div>}

          <div className="col-12 d-flex gap-2 justify-content-end mt-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/tenant-management')} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenantPage;
