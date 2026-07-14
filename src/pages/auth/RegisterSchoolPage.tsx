import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SubscriptionPlanDropdown from '../../common/SubscriptionPlanDropdown';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import { ErrorRegisterSchoolForm } from '../../hooks/common/SchoolPage';


const RegisterSchoolPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    schoolName: '',
    mobileNumber: '',
    adminEmail: '',
    tenantId: '',
    schoolAddress: '',
    customDomain: '',
  });
  const [errors, setErrors] = useState<ErrorRegisterSchoolForm>({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const { data: plans = [] } = useSubscriptionPlans();

  const mobileNumberRegex = /^\+?[0-9\s()-]{10,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const nextErrors: ErrorRegisterSchoolForm = {};

    if (!formData.schoolName.trim()) {
      nextErrors.schoolName = 'School Name is required';
    }

    if (!formData.mobileNumber.trim()) {
      nextErrors.mobileNumber = 'Mobile Number is required';
    } else if (!mobileNumberRegex.test(formData.mobileNumber.trim())) {
      nextErrors.mobileNumber = 'Enter a valid mobile number (10-15 digits)';
    }

    if (!formData.adminEmail.trim()) {
      nextErrors.adminEmail = 'Admin Email is required';
    } else if (!emailRegex.test(formData.adminEmail.trim())) {
      nextErrors.adminEmail = 'Enter a valid email address';
    }

    if (!formData.schoolAddress.trim()) {
      nextErrors.schoolAddress = 'School Address is required';
    }

    if (!selectedPlanId.trim()) {
      nextErrors.plan = 'Plan is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  useEffect(() => {
    const requestedPlan = searchParams.get('plan');

    if (!requestedPlan || plans.length === 0) {
      return;
    }

    const matchingPlan = plans.find((plan) => plan.name.toLowerCase() === requestedPlan.toLowerCase());
    if (matchingPlan) {
      setSelectedPlanId(matchingPlan.id);
    }
  }, [plans, searchParams]);

  const handlePlanChange = (event) => {
    setSelectedPlanId(event.target.value);
    setErrors((prev) => ({
      ...prev,
      plan: '',
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitMessage('');

    if (!validateForm()) {
      return;
    }

    setSubmitMessage('School registration form is valid and ready to submit.');
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fw-bold mb-3">Register School</h2>
      <p className="text-muted">Onboard a new school into the EduCoreUi SaaS platform.</p>
      <form className="row g-3" onSubmit={handleSubmit} noValidate>
        <div className="col-md-6">
          <label className="form-label">School Name <span className="text-danger">*</span></label>
          <input
            className={`form-control ${errors.schoolName ? 'is-invalid' : ''}`}
            placeholder="School Name"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
          />
          {errors.schoolName ? <div className="invalid-feedback d-block">{errors.schoolName}</div> : null}
        </div>
        <div className="col-md-6">
          <label className="form-label">Admin Mobile Number <span className="text-danger">*</span></label>
          <input
            className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
            type="tel"
            placeholder="Mobile number with country code eg. +91 9540152999"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
          />
          {errors.mobileNumber ? <div className="invalid-feedback d-block">{errors.mobileNumber}</div> : null}
        </div>
        <div className="col-md-6">
          <label className="form-label">Admin Email <span className="text-danger">*</span></label>
          <input
            className={`form-control ${errors.adminEmail ? 'is-invalid' : ''}`}
            type="email"
            placeholder="admin@school.com"
            name="adminEmail"
            value={formData.adminEmail}
            onChange={handleInputChange}
          />
          {errors.adminEmail ? <div className="invalid-feedback d-block">{errors.adminEmail}</div> : null}
        </div>
        <div className="col-md-6">
          <SubscriptionPlanDropdown
            name="planId"
            label="Plan"
            required
            value={selectedPlanId}
            onChange={handlePlanChange}
            error={errors.plan}
            detailsLink={(
              <Link to="/register-school/plan-details" className="link-primary text-decoration-none fw-semibold">
                View Plan Details
              </Link>
            )}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Custom Domain</label>
          <input
            className="form-control"
            placeholder="Preferred custom domain e.g. school.example.com (optional)"
            name="customDomain"
            value={formData.customDomain}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tenant ID</label>
          <input
            className="form-control"
            placeholder="Preferred tenant ID (optional)"
            name="tenantId"
            value={formData.tenantId}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-12">
          <label className="form-label">School Address <span className="text-danger">*</span></label>
          <textarea
            className={`form-control ${errors.schoolAddress ? 'is-invalid' : ''}`}
            rows={3}
            placeholder="Enter complete school address"
            name="schoolAddress"
            value={formData.schoolAddress}
            onChange={handleInputChange}
          />
          {errors.schoolAddress ? <div className="invalid-feedback d-block">{errors.schoolAddress}</div> : null}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">Create School</button>
          {submitMessage ? <div className="text-success mt-2 small">{submitMessage}</div> : null}
        </div>
      </form>
    </div>
  );
}

export default RegisterSchoolPage;
