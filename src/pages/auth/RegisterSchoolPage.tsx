import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SchoolRegistrationDetailsCard from '../../common/SchoolRegistrationDetailsCard';
import SubscriptionPlanDropdown from '../../common/SubscriptionPlanDropdown';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import { ErrorRegisterSchoolForm } from '../../hooks/common/SchoolPage';
import { schoolService } from '../../services';
import { normalizeSchoolPaymentStatus, schoolOnboardingService } from '../../services/schoolOnboardingService';
import { normalizeSchoolRequestRecord, type SchoolRequestRecord } from '../../services/schoolService';

const initialFormData = {
  schoolName: '',
  adminName: '',
  mobileNumber: '',
  adminEmail: '',
  tenantId: '',
  schoolAddress: '',
  customDomain: '',
};

const RegisterSchoolPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<ErrorRegisterSchoolForm>({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [createdRegistrationId, setCreatedRegistrationId] = useState('');
  const [existingRegistrationId, setExistingRegistrationId] = useState('');
  const [existingIdError, setExistingIdError] = useState('');
  const [findDetailsError, setFindDetailsError] = useState('');
  const [isFindingDetails, setIsFindingDetails] = useState(false);
  const [foundSchoolDetails, setFoundSchoolDetails] = useState<SchoolRequestRecord | null>(null);
  const [isCompletingPayment, setIsCompletingPayment] = useState(false);
  const [paymentCompleteMessage, setPaymentCompleteMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const { data: plans = [] } = useSubscriptionPlans();
  const foundDetailsRef = useRef<HTMLDivElement | null>(null);

  const mobileNumberRegex = /^\+?[0-9\s()-]{10,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const nextErrors: ErrorRegisterSchoolForm = {};

    if (!formData.schoolName.trim()) {
      nextErrors.schoolName = 'School Name is required';
    }

    if (!formData.adminName.trim()) {
      nextErrors.adminName = 'Admin Name is required';
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

  useEffect(() => {
    if (activeTab !== 'existing' || !foundSchoolDetails || !foundDetailsRef.current) {
      return;
    }

    foundDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeTab, foundSchoolDetails]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitError('');
    setCreatedRegistrationId('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdRequest = await schoolService.createSchoolRequest({
        schoolName: formData.schoolName.trim(),
        adminName: formData.adminName.trim(),
        adminEmail: formData.adminEmail.trim(),
        adminMobile: formData.mobileNumber.trim(),
        location: formData.schoolAddress.trim(),
        planId: selectedPlanId,
      });

      const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
      const schoolRequestId = String(createdRequest?.id || '');

      if (schoolRequestId) {
        schoolOnboardingService.upsertFromSchoolRequest({
          schoolRequestId,
          schoolName: formData.schoolName.trim(),
          adminName: formData.adminName.trim(),
          adminEmail: formData.adminEmail.trim(),
          adminMobile: formData.mobileNumber.trim(),
          location: formData.schoolAddress.trim(),
          planId: selectedPlanId,
          planName: selectedPlan?.name || '',
          requestedAt: createdRequest?.submittedAt || new Date().toISOString(),
          customDomain: formData.customDomain.trim(),
          tenantCode: formData.tenantId.trim(),
          amount: Number(selectedPlan?.price || 0),
          currency: 'INR',
          requestStatus: String(createdRequest?.status || 'Requested'),
          paymentStatus: normalizeSchoolPaymentStatus(createdRequest?.paymentStatus),
          paymentReference: String(createdRequest?.paymentReference || ''),
          paymentFailedReason: String(createdRequest?.paymentFailureReason || ''),
          paymentStartedAt: String(createdRequest?.paymentStartedAt || ''),
          paymentCompletedAt: String(createdRequest?.paymentCompletedAt || ''),
        });
      }

      setSubmitMessage('School registration request submitted successfully. Please save your School Registration ID for future transactions.');
      setCreatedRegistrationId(schoolRequestId);
      setFormData(initialFormData);
      setSelectedPlanId('');
      setErrors({});
    } catch (error) {
      setSubmitError(error?.message || 'Failed to submit school registration request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFindDetails = async () => {
    const normalizedId = existingRegistrationId.trim();

    if (!normalizedId) {
      setExistingIdError('Please enter School Registration ID.');
      setFoundSchoolDetails(null);
      return;
    }

    setExistingIdError('');
    setFindDetailsError('');
    setPaymentCompleteMessage('');
    setIsFindingDetails(true);

    try {
      const schoolResponse = await schoolService.getSchoolRequest(normalizedId);
      const normalizedSchool = normalizeSchoolRequestRecord(schoolResponse);

      if (!normalizedSchool.id) {
        throw new Error('School Registration ID not found.');
      }

      setFoundSchoolDetails(normalizedSchool);
    } catch (error) {
      setFoundSchoolDetails(null);
      setFindDetailsError(error instanceof Error ? error.message : 'Unable to fetch registration details.');
    } finally {
      setIsFindingDetails(false);
    }
  };

  const handleQuickPayNow = async () => {
    if (!foundSchoolDetails?.id || normalizeSchoolPaymentStatus(foundSchoolDetails.paymentStatus) === 'complete') {
      return;
    }

    setIsCompletingPayment(true);
    setFindDetailsError('');
    setPaymentCompleteMessage('');

    try {
      const paymentReference = `PAY-BYPASS-${Date.now()}`;
      await schoolService.updateSchoolRequestPaymentStatus(foundSchoolDetails.id, {
        status: 'complete',
        paymentReference,
      });

      const updatedSchoolResponse = await schoolService.getSchoolRequest(foundSchoolDetails.id);
      const updatedSchool = normalizeSchoolRequestRecord(updatedSchoolResponse);
      setFoundSchoolDetails(updatedSchool);

      setPaymentCompleteMessage('Payment marked as complete. Admin approval flow is now enabled.');
    } catch (error) {
      setFindDetailsError(error instanceof Error ? error.message : 'Unable to complete payment.');
    } finally {
      setIsCompletingPayment(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fw-bold mb-3">Register School</h2>
      <p className="text-muted">Choose a flow to create new registration or continue with existing registration ID.</p>

      <div className="registration-tabs mb-4" role="tablist" aria-label="Registration flows">
        <button
          type="button"
          className={`registration-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
          role="tab"
          aria-selected={activeTab === 'new'}
        >
          New Registration
        </button>
        <button
          type="button"
          className={`registration-tab-btn ${activeTab === 'existing' ? 'active' : ''}`}
          onClick={() => setActiveTab('existing')}
          role="tab"
          aria-selected={activeTab === 'existing'}
        >
          Have Registration ID
        </button>
      </div>

      {activeTab === 'existing' ? (
        <div className="card border-0 shadow-sm bg-light-subtle mb-4 registration-tab-panel">
          <div className="card-body p-3 p-md-4">
            <h6 className="fw-bold mb-2">Have Registration ID</h6>
            <p className="text-muted small mb-3">Enter your School Registration ID and continue payment or onboarding process.</p>
            <div className="row g-2 align-items-start">
              <div className="col-md-8">
                <input
                  className={`form-control ${existingIdError ? 'is-invalid' : ''}`}
                  placeholder="Enter School Registration ID"
                  value={existingRegistrationId}
                  onChange={(event) => {
                    setExistingRegistrationId(event.target.value);
                    setExistingIdError('');
                    setFindDetailsError('');
                    setFoundSchoolDetails(null);
                  }}
                />
                {existingIdError ? <div className="invalid-feedback d-block">{existingIdError}</div> : null}
              </div>
              <div className="col-md-4 d-grid">
                <button type="button" className="btn btn-outline-primary" onClick={handleFindDetails} disabled={isFindingDetails}>
                  {isFindingDetails ? 'Finding...' : 'Find Details'}
                </button>
              </div>
            </div>

            {findDetailsError ? <div className="alert alert-danger py-2 mt-3 mb-0">{findDetailsError}</div> : null}

            {foundSchoolDetails ? (
              (() => {
                const normalizedPaymentStatus = normalizeSchoolPaymentStatus(foundSchoolDetails.paymentStatus);
                const normalizedRequestStatus = String(foundSchoolDetails.status || '').toLowerCase();
                const isApproved = normalizedRequestStatus === 'approved';
                const isRejected = normalizedRequestStatus === 'rejected';
                const statusLabel = isApproved
                  ? 'Complete'
                  : isRejected
                  ? 'Rejected'
                  : normalizedPaymentStatus === 'complete'
                  ? 'Payment Complete'
                  : 'Pending';
                const primaryUsername = foundSchoolDetails.adminEmail || foundSchoolDetails.adminMobile || 'N/A';

                return (
                  <div className="mt-3">
                    <SchoolRegistrationDetailsCard
                      school={foundSchoolDetails}
                      title="Registration Details"
                      subtitle="Review your submitted registration and continue onboarding."
                      detailsRef={foundDetailsRef}
                      statusLabel={statusLabel}
                      topAlert={(
                        <div className="alert alert-info py-2 mb-3">
                          TODO: Payment gateway integration is pending. Currently using temporary quick payment completion.
                        </div>
                      )}
                      footer={(
                        <>
                          {normalizedPaymentStatus !== 'complete' && !isApproved && !isRejected ? (
                            <div>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleQuickPayNow}
                                disabled={isCompletingPayment}
                              >
                                {isCompletingPayment ? 'Processing...' : 'Pay Now'}
                              </button>
                            </div>
                          ) : null}

                          {isApproved ? (
                            <div className="alert alert-success py-2 mt-3 mb-0">
                              <div><strong>Onboarding Complete.</strong> Super Admin has approved your registration.</div>
                              <div><strong>Username:</strong> {primaryUsername}</div>
                              <div><strong>Login with:</strong> Email or Mobile Number</div>
                              <div className="mt-1">
                                <Link
                                  to={`/forgot-password${primaryUsername !== 'N/A' ? `?username=${encodeURIComponent(primaryUsername)}` : ''}`}
                                  className="link-success fw-semibold"
                                >
                                  Reset Password
                                </Link>
                              </div>
                            </div>
                          ) : null}

                          {paymentCompleteMessage ? <div className="alert alert-success py-2 mt-3 mb-0">{paymentCompleteMessage}</div> : null}
                        </>
                      )}
                    />
                  </div>
                );
              })()
            ) : null}
          </div>
        </div>
      ) : null}

      {activeTab === 'new' ? (
      <form className="row g-3 registration-tab-panel" onSubmit={handleSubmit} noValidate>
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
          <label className="form-label">Admin Name <span className="text-danger">*</span></label>
          <input
            className={`form-control ${errors.adminName ? 'is-invalid' : ''}`}
            placeholder="Admin full name"
            name="adminName"
            value={formData.adminName}
            onChange={handleInputChange}
          />
          {errors.adminName ? <div className="invalid-feedback d-block">{errors.adminName}</div> : null}
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
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Create School'}</button>
          {submitMessage ? <div className="text-success mt-2 small">{submitMessage}</div> : null}
          {createdRegistrationId ? (
            <div className="alert alert-success mt-3 mb-0 py-2">
              <div><strong>School Registration ID:</strong> {createdRegistrationId}</div>
              <div className="small">Please save this ID for future payment and onboarding transactions.</div>
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={() => navigate(`/register-school/${createdRegistrationId}/payment`)}
                >
                  Proceed To Payment
                </button>
              </div>
            </div>
          ) : null}
          {submitError ? <div className="text-danger mt-2 small">{submitError}</div> : null}
        </div>
      </form>
      ) : null}
    </div>
  );
}

export default RegisterSchoolPage;
