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
  isActive: true,
};

const CreatePlanPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
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
    const nextErrors = {};

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
        isActive: formData.isActive,
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
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Create Plan</h2>
            <p className="text-muted mb-0">Create a new subscription plan for tenant onboarding.</p>
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/super-admin')}>
            Back to Dashboard
          </button>
        </div>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Plan Name <span className="text-danger">*</span></label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Premium Plus"
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
              placeholder="199"
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
              placeholder="2000"
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
              placeholder="250"
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                id="planIsActive"
                name="isActive"
                type="checkbox"
                className="form-check-input"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label htmlFor="planIsActive" className="form-check-label">Activate plan immediately</label>
            </div>
          </div>

          {requestError && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{requestError}</div></div>}

          <div className="col-12 d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/super-admin')} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanPage;
