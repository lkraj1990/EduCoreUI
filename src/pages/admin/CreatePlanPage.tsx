import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSubscriptionPlansCache } from '../../hooks/useSubscriptionPlans';
import { planService } from '../../services';

const initialFormData = {
  name: '',
  price: '',
  billingCycle: 'monthly',
  maxStudents: '',
  maxStaff: '',
  features: '',
};

const CreatePlanPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialFormData, string>>>({});
  const [requestError, setRequestError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const nextErrors: Partial<Record<keyof typeof initialFormData, string>> = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Plan name is required';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      nextErrors.price = 'Price must be greater than 0';
    }

    if (!formData.billingCycle) {
      nextErrors.billingCycle = 'Billing cycle is required';
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
      await planService.createPlan({
        name: formData.name.trim(),
        price: Number(formData.price),
        billingCycle: formData.billingCycle,
        maxStudents: Number(formData.maxStudents || 0),
        maxStaff: Number(formData.maxStaff || 0),
        featuresJson: JSON.stringify(
          formData.features
            .split(',')
            .map((feature) => feature.trim())
            .filter(Boolean),
        ),
      });

      clearSubscriptionPlansCache();
      navigate('/super-admin');
    } catch (error) {
      setRequestError(error.message || 'Create plan request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header page-card-header">
        <div className="page-header-wrap">
          <div>
            <h2 className="fw-bold mb-1">Create Plan</h2>
            <p className="text-muted mb-0">Create a new subscription plan for tenant onboarding.</p>
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/plans')}>
            Back to Plans
          </button>
        </div>
      </div>
      <div className="card-body p-4 p-lg-5">
        <form id="create-plan-form" className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Plan Name <span className="text-danger">*</span></label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Plan name"
            />
            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Price <span className="text-danger">*</span></label>
            <input
              type="number"
              name="price"
              min="0"
              step="1"
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
            {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
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

          <div className="col-md-6">
            <label className="form-label">Max Students</label>
            <input
              type="number"
              name="maxStudents"
              min="0"
              className="form-control"
              value={formData.maxStudents}
              onChange={handleChange}
              placeholder="Max students count"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Max Staff</label>
            <input
              type="number"
              name="maxStaff"
              min="0"
              className="form-control"
              value={formData.maxStaff}
              onChange={handleChange}
              placeholder="Max staff count"
            />
          </div>

          <div className="col-12">
            <label className="form-label">Features</label>
            <textarea
              name="features"
              rows={3}
              className="form-control"
              value={formData.features}
              onChange={handleChange}
              placeholder="Plan features Optional"
            />
            <small className="text-muted">Enter comma-separated features. This is saved as <code>featuresJson</code> via POST /api/plans.</small>
          </div>

          {requestError && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{requestError}</div></div>}
        </form>
      </div>

      <div className="card-footer page-card-footer d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/super-admin')} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" form="create-plan-form" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Plan'}
        </button>
      </div>
    </div>
  );
};

export default CreatePlanPage;
