import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import { paymentService } from '../../services';
import type { RootState } from '../../redux/store';

type InvoiceFormErrors = Partial<Record<'tenantId' | 'amount' | 'currency', string>>;

const GenerateInvoicePage = () => {
  const { tenantLocalId, subscriptionId } = useParams();
  const navigate = useNavigate();
  const { tenants } = useSelector((state: RootState) => state.tenants);
  const { data: plans = [] } = useSubscriptionPlans();

  const tenant = useMemo(
    () => tenants.find((item) => item.localId === tenantLocalId),
    [tenants, tenantLocalId],
  );

  const suggestedAmount = useMemo(() => {
    if (!tenant?.planId) {
      return 0;
    }

    const selectedPlan = plans.find((plan) => plan.id === tenant.planId);
    return Number(selectedPlan?.price || 0);
  }, [plans, tenant?.planId]);

  const [formData, setFormData] = useState({
    amount: suggestedAmount > 0 ? String(suggestedAmount) : '',
    currency: 'INR',
  });
  const [errors, setErrors] = useState<InvoiceFormErrors>({});
  const [requestError, setRequestError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tenant || !subscriptionId) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">Generate Invoice</h2>
          <p className="text-muted mb-3">Subscription context not found.</p>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/tenant-management')}>
            Back to Tenant Management
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors: InvoiceFormErrors = {};

    if (!tenant.tenantId?.trim()) {
      nextErrors.tenantId = 'Tenant must have a backend Tenant ID before invoice generation.';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      nextErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.currency.trim()) {
      nextErrors.currency = 'Currency is required';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRequestError('');
    setRequestMessage('');

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await paymentService.generateInvoice({
        tenantId: tenant.tenantId,
        subscriptionId,
        amount: Number(formData.amount),
        currency: formData.currency.trim().toUpperCase(),
      });

      setRequestMessage(`Invoice generated for ${tenant.name}.`);
    } catch (error) {
      setRequestError(error.message || 'Invoice generation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header page-card-header">
        <div className="page-header-wrap">
          <div>
            <h2 className="fw-bold mb-1">Generate Invoice</h2>
            <p className="text-muted mb-0">Create invoice for {tenant.name} after subscription creation.</p>
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/tenant-management')}>
            Back to Tenant Management
          </button>
        </div>
      </div>
      <div className="card-body p-4 p-lg-5">
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <span className="nav-link">Tenant</span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Subscription</span>
          </li>
          <li className="nav-item">
            <span className="nav-link active">Invoice</span>
          </li>
        </ul>

        <form id="generate-invoice-form" className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">School Name</label>
            <input className="form-control" value={tenant.name} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label">Subscription ID</label>
            <input className="form-control" value={subscriptionId} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label">Amount <span className="text-danger">*</span></label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="amount"
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Currency <span className="text-danger">*</span></label>
            <input
              type="text"
              name="currency"
              className={`form-control ${errors.currency ? 'is-invalid' : ''}`}
              value={formData.currency}
              onChange={handleChange}
              placeholder="INR"
              maxLength={3}
            />
            {errors.currency && <div className="invalid-feedback d-block">{errors.currency}</div>}
          </div>

          {errors.tenantId && <div className="col-12"><div className="alert alert-warning py-2 mb-0">{errors.tenantId}</div></div>}
          {requestError && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{requestError}</div></div>}
          {requestMessage && <div className="col-12"><div className="alert alert-success py-2 mb-0">{requestMessage}</div></div>}
        </form>
      </div>

      <div className="card-footer page-card-footer d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/tenant-management')} disabled={isSubmitting}>
          Close
        </button>
        <button type="submit" form="generate-invoice-form" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Generate Invoice'}
        </button>
      </div>
    </div>
  );
};

export default GenerateInvoicePage;
