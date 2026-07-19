import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import { normalizeSchoolRequestRecord, schoolService, type SchoolRequestRecord } from '../../services/schoolService';

type PaymentMethod = 'online-banking' | 'api' | 'card';

interface PaymentFormState {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  apiProvider: string;
  apiReference: string;
  cardHolderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const initialFormState: PaymentFormState = {
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  apiProvider: '',
  apiReference: '',
  cardHolderName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

const SchoolPaymentGatewayPage = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { data: plans = [] } = useSubscriptionPlans();

  const [school, setSchool] = useState<SchoolRequestRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('online-banking');
  const [formData, setFormData] = useState<PaymentFormState>(initialFormState);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      setError('School registration request id is missing.');
      return;
    }

    const loadSchool = async () => {
      setLoading(true);
      setError('');

      try {
        const schoolResponse = await schoolService.getSchoolRequest(schoolId);
        const normalizedSchool = normalizeSchoolRequestRecord(schoolResponse);
        setSchool(normalizedSchool);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load school request.');
      } finally {
        setLoading(false);
      }
    };

    loadSchool().catch(() => null);
  }, [schoolId]);

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === school?.planId), [plans, school?.planId]);
  const amount = Number(selectedPlan?.price || 0);
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (method === 'online-banking') {
      return formData.bankName.trim() && formData.accountNumber.trim() && formData.ifscCode.trim();
    }

    if (method === 'api') {
      return formData.apiProvider.trim() && formData.apiReference.trim();
    }

    return formData.cardHolderName.trim() && formData.cardNumber.trim() && formData.expiry.trim() && formData.cvv.trim();
  };

  const handlePayNow = async () => {
    if (!schoolId) {
      return;
    }

    if (!validateForm()) {
      setRequestMessage('Please fill all required payment details for selected method.');
      return;
    }

    setIsSubmitting(true);
    setRequestMessage('');
    setError('');

    try {
      const paymentReference = `PAY-${method.toUpperCase()}-${Date.now()}`;
      await schoolService.updateSchoolRequestPaymentStatus(schoolId, {
        status: 'complete',
        paymentReference,
      });

      navigate(`/register-school/${schoolId}/payment`, {
        replace: true,
        state: {
          paymentSuccess: true,
          paymentReference,
        },
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Payment could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">Payment Gateway</h2>
          <p className="text-muted mb-0">Loading payment gateway...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">Payment Gateway</h2>
          <p className="text-muted mb-3">{error || 'School payment request not found.'}</p>
          <Link to="/register-school" className="btn btn-outline-secondary btn-sm">Back to Register School</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Payment Gateway</h2>
            <p className="text-muted mb-0">Complete payment for {school.schoolName || 'school request'}.</p>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(`/register-school/${school.id}/payment`)}
          >
            Back to Payment Summary
          </button>
        </div>

        <div className="card border-0 shadow-sm bg-light-subtle mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">Payment Summary</h6>
            <div className="row g-3">
              <div className="col-md-6"><p className="mb-1"><strong>School:</strong> {school.schoolName || 'N/A'}</p></div>
              <div className="col-md-6"><p className="mb-1"><strong>Plan:</strong> {selectedPlan?.name || school.planName || school.planId || 'N/A'}</p></div>
              <div className="col-md-6"><p className="mb-1"><strong>Amount:</strong> {formattedAmount}</p></div>
              <div className="col-md-6"><p className="mb-1"><strong>Request ID:</strong> {school.id}</p></div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Select Payment Method</label>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${method === 'online-banking' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setMethod('online-banking')}
            >
              Online Banking
            </button>
            <button
              type="button"
              className={`btn ${method === 'api' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setMethod('api')}
            >
              API
            </button>
            <button
              type="button"
              className={`btn ${method === 'card' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setMethod('card')}
            >
              Card
            </button>
          </div>
        </div>

        <div className="card border-0 shadow-sm bg-light-subtle">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">Payment Details</h6>

            {method === 'online-banking' ? (
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Bank Name</label>
                  <input className="form-control" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Enter bank name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Account Number</label>
                  <input className="form-control" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="Enter account number" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">IFSC Code</label>
                  <input className="form-control" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} placeholder="Enter IFSC code" />
                </div>
              </div>
            ) : null}

            {method === 'api' ? (
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">API Provider</label>
                  <input className="form-control" name="apiProvider" value={formData.apiProvider} onChange={handleInputChange} placeholder="Enter API provider name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">API Reference</label>
                  <input className="form-control" name="apiReference" value={formData.apiReference} onChange={handleInputChange} placeholder="Enter reference id" />
                </div>
              </div>
            ) : null}

            {method === 'card' ? (
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Card Holder Name</label>
                  <input className="form-control" name="cardHolderName" value={formData.cardHolderName} onChange={handleInputChange} placeholder="Enter card holder name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Card Number</label>
                  <input className="form-control" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Expiry</label>
                  <input className="form-control" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">CVV</label>
                  <input className="form-control" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="***" />
                </div>
              </div>
            ) : null}

            {requestMessage ? <div className="alert alert-warning py-2 mb-3">{requestMessage}</div> : null}
            {error ? <div className="alert alert-danger py-2 mb-3">{error}</div> : null}

            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={handlePayNow} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Pay Now'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/register-school/${school.id}/payment`)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolPaymentGatewayPage;
