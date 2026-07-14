import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SubscriptionPlanDropdown from '../../common/SubscriptionPlanDropdown';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import { syncTenantSubscription } from '../../redux/slices/tenantSlice';
import { subscriptionService } from '../../services';

const CreateTenantSubscriptionPage = () => {
  const { tenantLocalId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tenants } = useSelector((state) => state.tenants);
  const {
    data: plans = [],
  } = useSubscriptionPlans();
  const tenant = tenants.find((item) => item.localId === tenantLocalId);
  const [formData, setFormData] = useState({
    tenantId: tenant?.tenantId || '',
    planId: tenant?.planId || '',
    billingCycle: tenant?.billingCycle || 'monthly',
    autoRenew: tenant?.autoRenew ?? true,
  });
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tenant) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">Create Subscription</h2>
          <p className="text-muted mb-3">Tenant record not found.</p>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/tenant-management')}>
            Back to Tenant Management
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.tenantId.trim()) {
      nextErrors.tenantId = 'Backend Tenant ID is required';
    }

    if (!formData.planId) {
      nextErrors.planId = 'Plan is required';
    }

    if (!formData.billingCycle) {
      nextErrors.billingCycle = 'Billing cycle is required';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setRequestError('');

    try {
      const createdSubscription = await subscriptionService.createSubscription({
        tenantId: formData.tenantId,
        planId: formData.planId,
        billingCycle: formData.billingCycle,
        autoRenew: formData.autoRenew,
      });

      const selectedPlan = plans.find((plan) => plan.id === formData.planId);

      dispatch(syncTenantSubscription({
        localId: tenant.localId,
        tenantId: formData.tenantId,
        subscriptionId: createdSubscription?.id || '',
        planId: formData.planId,
        plan: selectedPlan?.name || tenant.plan,
        subscriptionStatus: createdSubscription?.status || 'Active',
        billingCycle: createdSubscription?.billingCycle || formData.billingCycle,
        autoRenew: createdSubscription?.autoRenew ?? formData.autoRenew,
      }));

      navigate('/tenant-management');
    } catch (error) {
      setRequestError(error.message || 'Subscription request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Create Subscription</h2>
            <p className="text-muted mb-0">Link a live backend subscription for {tenant.name}.</p>
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/tenant-management')}>
            Back to Tenant Management
          </button>
        </div>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">School Name</label>
            <input className="form-control" value={tenant.name} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label">Backend Tenant ID <span className="text-danger">*</span></label>
            <input
              type="text"
              name="tenantId"
              className={`form-control ${errors.tenantId ? 'is-invalid' : ''}`}
              placeholder="UUID from the backend tenant record"
              value={formData.tenantId}
              onChange={handleChange}
            />
            {errors.tenantId && <div className="invalid-feedback d-block">{errors.tenantId}</div>}
          </div>

          <div className="col-md-6">
            <SubscriptionPlanDropdown
              name="planId"
              label="Plan"
              required
              value={formData.planId}
              onChange={handleChange}
              error={errors.planId}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Billing Cycle <span className="text-danger">*</span></label>
            <select
              name="billingCycle"
              className={`form-select ${errors.billingCycle ? 'is-invalid' : ''}`}
              value={formData.billingCycle}
              onChange={handleChange}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.billingCycle && <div className="invalid-feedback d-block">{errors.billingCycle}</div>}
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                id="autoRenew"
                type="checkbox"
                name="autoRenew"
                className="form-check-input"
                checked={formData.autoRenew}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="autoRenew">
                Enable auto-renew
              </label>
            </div>
          </div>

          {requestError && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{requestError}</div></div>}

          <div className="col-12 d-flex gap-2 justify-content-end mt-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/tenant-management')} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTenantSubscriptionPage;