import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SubscriptionPlanDropdown from '../../common/SubscriptionPlanDropdown';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import { syncTenantSubscription } from '../../redux/slices/tenantSlice';
import { subscriptionService } from '../../services';

const toIsoDateTime = (dateValue: string) => {
  if (!dateValue) {
    return null;
  }

  return new Date(`${dateValue}T00:00:00`).toISOString();
};

const getCycleWindow = (effectiveDateValue: string, billingCycle: string) => {
  const effectiveDate = new Date(`${effectiveDateValue}T00:00:00`);

  if (Number.isNaN(effectiveDate.getTime())) {
    return null;
  }

  if (billingCycle === 'yearly') {
    const year = effectiveDate.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    return { start, end };
  }

  const year = effectiveDate.getFullYear();
  const month = effectiveDate.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end };
};

const diffDaysInclusive = (startDate: Date, endDate: Date) => {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.floor((endDate.getTime() - startDate.getTime()) / dayMs) + 1);
};

const formatMoney = (value: number) => {
  const normalized = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(normalized);
};

const TenantSubscriptionDetailsPage = () => {
  const { tenantLocalId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tenants } = useSelector((state) => state.tenants);
  const { data: plans = [] } = useSubscriptionPlans();

  const tenant = useMemo(
    () => tenants.find((item) => item.localId === tenantLocalId),
    [tenants, tenantLocalId],
  );

  const currentPlan = useMemo(
    () => plans.find((plan) => plan.id === tenant?.planId),
    [plans, tenant?.planId],
  );

  const [changePlanForm, setChangePlanForm] = useState({
    subscriptionId: tenant?.subscriptionId || '',
    targetPlanId: '',
    effectiveFrom: new Date().toISOString().slice(0, 10),
  });
  const [cancelForm, setCancelForm] = useState({
    subscriptionId: tenant?.subscriptionId || '',
    cancelMode: 'end-of-billing-cycle',
    reason: '',
  });

  const [changePlanErrors, setChangePlanErrors] = useState({});
  const [cancelErrors, setCancelErrors] = useState({});
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [changePlanError, setChangePlanError] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const targetPlan = useMemo(
    () => plans.find((plan) => plan.id === changePlanForm.targetPlanId),
    [plans, changePlanForm.targetPlanId],
  );

  const planChangeType = useMemo(() => {
    const currentPrice = Number(currentPlan?.price || 0);
    const nextPrice = Number(targetPlan?.price || 0);

    if (!targetPlan || !currentPlan) {
      return 'change';
    }

    if (nextPrice > currentPrice) {
      return 'upgrade';
    }

    if (nextPrice < currentPrice) {
      return 'downgrade';
    }

    return 'same-plan';
  }, [currentPlan, targetPlan]);

  const proration = useMemo(() => {
    if (!currentPlan || !targetPlan || !changePlanForm.effectiveFrom) {
      return null;
    }

    const windowRange = getCycleWindow(changePlanForm.effectiveFrom, tenant?.billingCycle || currentPlan.billingCycle || 'monthly');
    if (!windowRange) {
      return null;
    }

    const effectiveDate = new Date(`${changePlanForm.effectiveFrom}T00:00:00`);
    const totalDays = diffDaysInclusive(windowRange.start, windowRange.end);
    const remainingDays = diffDaysInclusive(effectiveDate, windowRange.end);
    const currentPrice = Number(currentPlan.price || 0);
    const targetPrice = Number(targetPlan.price || 0);
    const delta = targetPrice - currentPrice;
    const estimatedProrationAmount = totalDays > 0 ? (delta / totalDays) * remainingDays : 0;

    return {
      totalDays,
      remainingDays,
      delta,
      estimatedProrationAmount,
    };
  }, [changePlanForm.effectiveFrom, currentPlan, targetPlan, tenant?.billingCycle]);

  if (!tenant) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">Tenant Subscription</h2>
          <p className="text-muted mb-3">Tenant record not found.</p>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/tenant-management')}>
            Back to Tenant Management
          </button>
        </div>
      </div>
    );
  }

  const refreshSubscription = async () => {
    if (tenant.tenantId) {
      return subscriptionService.getTenantSubscription(tenant.tenantId);
    }

    if (changePlanForm.subscriptionId || cancelForm.subscriptionId) {
      return subscriptionService.getSubscription(changePlanForm.subscriptionId || cancelForm.subscriptionId);
    }

    return null;
  };

  const handleChangePlanField = (event) => {
    const { name, value } = event.target;
    setChangePlanForm((prev) => ({ ...prev, [name]: value }));
    if (changePlanErrors[name]) {
      setChangePlanErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancelField = (event) => {
    const { name, value } = event.target;
    setCancelForm((prev) => ({ ...prev, [name]: value }));
    if (cancelErrors[name]) {
      setCancelErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateChangePlan = () => {
    const nextErrors = {};

    if (!changePlanForm.subscriptionId.trim()) {
      nextErrors.subscriptionId = 'Subscription ID is required';
    }

    if (!changePlanForm.targetPlanId) {
      nextErrors.targetPlanId = 'Target plan is required';
    }

    if (!changePlanForm.effectiveFrom) {
      nextErrors.effectiveFrom = 'Effective date is required';
    }

    return nextErrors;
  };

  const validateCancel = () => {
    const nextErrors = {};

    if (!cancelForm.subscriptionId.trim()) {
      nextErrors.subscriptionId = 'Subscription ID is required';
    }

    if (!cancelForm.cancelMode) {
      nextErrors.cancelMode = 'Cancellation type is required';
    }

    return nextErrors;
  };

  const handleChangePlanSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateChangePlan();

    if (Object.keys(nextErrors).length > 0) {
      setChangePlanErrors(nextErrors);
      return;
    }

    setIsSubmittingChange(true);
    setChangePlanError('');
    setStatusMessage('');

    try {
      const payload = {
        targetPlanId: changePlanForm.targetPlanId,
        effectiveFrom: toIsoDateTime(changePlanForm.effectiveFrom),
      };

      if (planChangeType === 'downgrade') {
        await subscriptionService.downgradeSubscription(changePlanForm.subscriptionId, payload);
      } else {
        await subscriptionService.upgradeSubscription(changePlanForm.subscriptionId, payload);
      }

      let latestSubscription = null;
      try {
        latestSubscription = await refreshSubscription();
      } catch {
        latestSubscription = null;
      }

      dispatch(syncTenantSubscription({
        localId: tenant.localId,
        subscriptionId: latestSubscription?.id || changePlanForm.subscriptionId,
        planId: changePlanForm.targetPlanId,
        plan: targetPlan?.name || tenant.plan,
        billingCycle: latestSubscription?.billingCycle || tenant.billingCycle,
        autoRenew: latestSubscription?.autoRenew ?? tenant.autoRenew,
        subscriptionStatus: latestSubscription?.status || `Pending ${planChangeType === 'downgrade' ? 'Downgrade' : 'Upgrade'}`,
      }));

      setStatusMessage(`Plan change submitted. Current status: ${latestSubscription?.status || 'Pending confirmation from backend'}`);
    } catch (error) {
      setChangePlanError(error.message || 'Failed to submit plan change request.');
    } finally {
      setIsSubmittingChange(false);
    }
  };

  const handleCancelSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateCancel();

    if (Object.keys(nextErrors).length > 0) {
      setCancelErrors(nextErrors);
      return;
    }

    setIsSubmittingCancel(true);
    setCancelError('');
    setStatusMessage('');

    try {
      await subscriptionService.cancelSubscription(cancelForm.subscriptionId, {
        cancelMode: cancelForm.cancelMode,
        reason: cancelForm.reason,
      });

      let latestSubscription = null;
      try {
        latestSubscription = await refreshSubscription();
      } catch {
        latestSubscription = null;
      }

      dispatch(syncTenantSubscription({
        localId: tenant.localId,
        subscriptionId: latestSubscription?.id || cancelForm.subscriptionId,
        subscriptionStatus: latestSubscription?.status || 'Cancelled',
      }));

      setStatusMessage(`Cancellation submitted. Current status: ${latestSubscription?.status || 'Cancellation requested'}`);
    } catch (error) {
      setCancelError(error.message || 'Failed to submit cancellation request.');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  return (
    <div className="d-grid gap-4">
      <div className="card shadow-sm border-0">
        <div className="card-header page-card-header">
          <div className="page-header-wrap">
            <div>
              <h2 className="fw-bold mb-1">Tenant Subscription</h2>
              <p className="text-muted mb-0">Manage plan changes and cancellation for {tenant.name}.</p>
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
              <span className="nav-link active">Subscription</span>
            </li>
            <li className="nav-item">
              <span className="nav-link disabled">Invoice</span>
            </li>
          </ul>

          <div className="row g-3">
            <div className="col-md-4">
              <div className="small text-muted">Current Plan</div>
              <div className="fw-semibold">{tenant.plan || 'N/A'}</div>
            </div>
            <div className="col-md-4">
              <div className="small text-muted">Subscription ID</div>
              <div className="fw-semibold text-break">{tenant.subscriptionId || 'N/A'}</div>
            </div>
            <div className="col-md-4">
              <div className="small text-muted">Current Status</div>
              <div className="fw-semibold">{tenant.subscriptionStatus || 'Not Linked'}</div>
            </div>
          </div>

          {statusMessage && <div className="alert alert-success py-2 mt-4 mb-0">{statusMessage}</div>}
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-lg-5">
          <h4 className="fw-bold mb-1">Change Plan</h4>
          <p className="text-muted mb-4">Upgrade or downgrade by selecting a target plan and effective date.</p>

          <form className="row g-3" onSubmit={handleChangePlanSubmit}>
            <div className="col-md-6">
              <label className="form-label">Subscription ID <span className="text-danger">*</span></label>
              <input
                type="text"
                name="subscriptionId"
                className={`form-control ${changePlanErrors.subscriptionId ? 'is-invalid' : ''}`}
                value={changePlanForm.subscriptionId}
                onChange={handleChangePlanField}
              />
              {changePlanErrors.subscriptionId && <div className="invalid-feedback d-block">{changePlanErrors.subscriptionId}</div>}
            </div>

            <div className="col-md-6">
              <SubscriptionPlanDropdown
                name="targetPlanId"
                label="Target Plan"
                required
                value={changePlanForm.targetPlanId}
                onChange={handleChangePlanField}
                error={changePlanErrors.targetPlanId}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Effective Date <span className="text-danger">*</span></label>
              <input
                type="date"
                name="effectiveFrom"
                className={`form-control ${changePlanErrors.effectiveFrom ? 'is-invalid' : ''}`}
                value={changePlanForm.effectiveFrom}
                onChange={handleChangePlanField}
              />
              {changePlanErrors.effectiveFrom && <div className="invalid-feedback d-block">{changePlanErrors.effectiveFrom}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Detected Change</label>
              <input
                type="text"
                className="form-control"
                value={planChangeType === 'same-plan' ? 'Same plan selected' : planChangeType.toUpperCase()}
                disabled
              />
            </div>

            <div className="col-12">
              <div className="alert alert-light border mb-0">
                <div className="fw-semibold mb-2">Proration Summary</div>
                {proration ? (
                  <div className="small text-muted">
                    <div>Current Plan Price: {formatMoney(Number(currentPlan?.price || 0))}</div>
                    <div>Target Plan Price: {formatMoney(Number(targetPlan?.price || 0))}</div>
                    <div>Price Delta: {formatMoney(proration.delta)}</div>
                    <div>Remaining Days in Cycle: {proration.remainingDays} of {proration.totalDays}</div>
                    <div>Estimated Proration Amount: {formatMoney(proration.estimatedProrationAmount)}</div>
                  </div>
                ) : (
                  <div className="small text-muted">Select target plan and effective date to review proration summary.</div>
                )}
              </div>
            </div>

            {changePlanError && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{changePlanError}</div></div>}

            <div className="col-12 d-flex justify-content-end gap-2 mt-2">
              <button type="submit" className="btn btn-primary" disabled={isSubmittingChange}>
                {isSubmittingChange ? 'Submitting...' : 'Submit Plan Change'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-lg-5">
          <h4 className="fw-bold mb-1">Cancel Subscription</h4>
          <p className="text-muted mb-4">Select cancellation type, provide reason, and submit.</p>

          <form className="row g-3" onSubmit={handleCancelSubmit}>
            <div className="col-md-6">
              <label className="form-label">Subscription ID <span className="text-danger">*</span></label>
              <input
                type="text"
                name="subscriptionId"
                className={`form-control ${cancelErrors.subscriptionId ? 'is-invalid' : ''}`}
                value={cancelForm.subscriptionId}
                onChange={handleCancelField}
              />
              {cancelErrors.subscriptionId && <div className="invalid-feedback d-block">{cancelErrors.subscriptionId}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Cancellation Type <span className="text-danger">*</span></label>
              <select
                name="cancelMode"
                className={`form-select ${cancelErrors.cancelMode ? 'is-invalid' : ''}`}
                value={cancelForm.cancelMode}
                onChange={handleCancelField}
              >
                <option value="immediate">Immediate</option>
                <option value="end-of-billing-cycle">End of Billing Cycle</option>
              </select>
              {cancelErrors.cancelMode && <div className="invalid-feedback d-block">{cancelErrors.cancelMode}</div>}
            </div>

            <div className="col-12">
              <label className="form-label">Reason</label>
              <textarea
                name="reason"
                rows={3}
                className="form-control"
                value={cancelForm.reason}
                onChange={handleCancelField}
                placeholder="Reason for cancellation"
              />
            </div>

            {cancelError && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{cancelError}</div></div>}

            <div className="col-12 d-flex justify-content-end gap-2 mt-2">
              <button type="submit" className="btn btn-danger" disabled={isSubmittingCancel}>
                {isSubmittingCancel ? 'Submitting...' : 'Cancel Subscription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantSubscriptionDetailsPage;
