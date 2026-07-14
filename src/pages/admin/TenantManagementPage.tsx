import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SubscriptionActionModal from '../../common/SubscriptionActionModal';
import EduGrid from '../../common/EduGrid';
import usePlans from '../../hooks/usePlans';
import { deactivateTenant, syncTenantSubscription } from '../../redux/slices/tenantSlice';
import { subscriptionService } from '../../services';

const TenantManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tenants } = useSelector((state) => state.tenants);
  const { data: plans = [] } = usePlans();
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [modalAction, setModalAction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  const closeSubscriptionModal = () => {
    setSelectedTenant(null);
    setModalAction('');
    setRequestError('');
  };

  const openSubscriptionModal = (action, tenant) => {
    setSelectedTenant(tenant);
    setModalAction(action);
    setRequestError('');
    setRequestMessage('');
  };

  const findPlanById = (planId) => plans.find((plan) => plan.id === planId);

  const persistSubscription = (tenant, subscription, overrides = {}) => {
    const resolvedPlan = findPlanById(overrides.planId || subscription?.planId || tenant.planId);

    dispatch(syncTenantSubscription({
      localId: tenant.localId,
      tenantId: overrides.tenantId || tenant.tenantId,
      subscriptionId: subscription?.id || overrides.subscriptionId || tenant.subscriptionId,
      planId: overrides.planId || subscription?.planId || tenant.planId,
      plan: resolvedPlan?.name || overrides.planName || tenant.plan,
      subscriptionStatus: subscription?.status || overrides.subscriptionStatus || tenant.subscriptionStatus,
      billingCycle: subscription?.billingCycle || overrides.billingCycle || tenant.billingCycle,
      autoRenew: subscription?.autoRenew ?? overrides.autoRenew ?? tenant.autoRenew,
    }));
  };

  const reloadSubscriptionSnapshot = async (tenant, fallbackSubscriptionId) => {
    if (tenant.tenantId) {
      return subscriptionService.getTenantSubscription(tenant.tenantId);
    }

    if (fallbackSubscriptionId) {
      return subscriptionService.getSubscription(fallbackSubscriptionId);
    }

    return null;
  };

  const handleSubscriptionSubmit = async (formData) => {
    if (!selectedTenant || !modalAction) {
      return;
    }

    setIsSubmitting(true);
    setRequestError('');

    try {
      if (modalAction === 'upgrade') {
        await subscriptionService.upgradeSubscription(formData.subscriptionId, {
          targetPlanId: formData.targetPlanId,
          effectiveFrom: formData.effectiveFrom ? new Date(formData.effectiveFrom).toISOString() : null,
        });

        let upgradedSubscription = null;
        try {
          upgradedSubscription = await reloadSubscriptionSnapshot(selectedTenant, formData.subscriptionId);
        } catch {
          upgradedSubscription = null;
        }

        persistSubscription(selectedTenant, upgradedSubscription, {
          subscriptionId: formData.subscriptionId,
          planId: formData.targetPlanId,
          subscriptionStatus: upgradedSubscription?.status || 'Pending Upgrade',
        });

        setRequestMessage(`Upgrade requested for ${selectedTenant.name}.`);
        closeSubscriptionModal();
        return;
      }

      await subscriptionService.cancelSubscription(formData.subscriptionId, {
        cancelMode: formData.cancelMode,
        reason: formData.reason,
      });

      let canceledSubscription = null;
      try {
        canceledSubscription = await reloadSubscriptionSnapshot(selectedTenant, formData.subscriptionId);
      } catch {
        canceledSubscription = null;
      }

      persistSubscription(selectedTenant, canceledSubscription, {
        subscriptionId: formData.subscriptionId,
        subscriptionStatus: canceledSubscription?.status || 'Cancelled',
      });

      setRequestMessage(`Subscription cancelled for ${selectedTenant.name}.`);
      closeSubscriptionModal();
    } catch (error) {
      setRequestError(error.message || 'Subscription request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define grid columns
  const columns = [
    {
      key: 'name',
      label: 'School Name',
    },
    {
      key: 'plan',
      label: 'Plan',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      render: (value) => (
        <span className={`badge ${value === 'Active' ? 'bg-success' : value === 'Pending' ? 'bg-warning text-dark' : 'bg-danger'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'subscriptionStatus',
      label: 'Subscription',
      render: (value) => (
        <span className={`badge ${value === 'Active' ? 'bg-success' : value === 'Cancelled' ? 'bg-danger' : value === 'Pending Upgrade' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
    },
  ];

  const actions = [
    {
      label: 'Create Subscription',
      tooltip: 'Create subscription',
      ariaLabel: 'Create subscription',
      renderIcon: () => <span aria-hidden="true" className="fw-bold fs-5 lh-1">+</span>,
      iconOnly: true,
      isVisible: (row) => Boolean(row.plan) && !row.subscriptionId,
      onClick: (row) => {
        navigate(`/tenant-management/${row.localId}/subscription/create`);
      },
      className: 'btn-outline-primary',
    },
    {
      label: 'Upgrade',
      tooltip: 'Upgrade subscription',
      ariaLabel: 'Upgrade subscription',
      renderIcon: () => <span aria-hidden="true" className="fw-bold fs-5 lh-1">↑</span>,
      iconOnly: true,
      isVisible: (row) => Boolean(row.plan && row.subscriptionId),
      onClick: (row) => {
        if (!row.subscriptionId) {
          alert('Add a subscription first before requesting an upgrade.');
          return;
        }
        openSubscriptionModal('upgrade', row);
      },
      className: 'btn-outline-info',
    },
    {
      label: 'Cancel Subscription',
      tooltip: 'Cancel subscription',
      ariaLabel: 'Cancel subscription',
      renderIcon: () => <span aria-hidden="true" className="fw-bold fs-5 lh-1">×</span>,
      iconOnly: true,
      isVisible: (row) => Boolean(row.plan && row.subscriptionId),
      onClick: (row) => {
        if (!row.subscriptionId) {
          alert('No active subscription is linked to this tenant yet.');
          return;
        }
        openSubscriptionModal('cancel', row);
      },
      className: 'btn-outline-danger',
    },
    {
      label: 'Deactivate',
      tooltip: 'Deactivate tenant',
      ariaLabel: 'Deactivate tenant',
      renderIcon: () => <span aria-hidden="true" className="fw-bold fs-5 lh-1">−</span>,
      iconOnly: true,
      isVisible: (row) => Boolean(row.plan),
      onClick: (row) => {
        if (row.status !== 'Inactive') {
          if (window.confirm(`Are you sure you want to deactivate ${row.name}?`)) {
            dispatch(deactivateTenant({ localId: row.localId }));
          }
        } else {
          alert('Tenant is already inactive');
        }
      },
      className: 'btn-outline-warning',
    },
  ];

  return (
    <div className="card tenant-page-card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="tenant-toolbar mb-4">
          <div>
            <h2 className="fw-bold mb-1">Tenant Management</h2>
            <p className="text-muted mb-0">Manage all onboarded schools, plans, and lifecycle status.</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="tenant-count-pill">{tenants.length} Tenants</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/tenant-management/add')}>
              Add Tenant
            </button>
          </div>
        </div>

        {requestMessage && <div className="alert alert-success py-2">{requestMessage}</div>}

        <div className="tenant-grid-shell">
          <EduGrid columns={columns} data={tenants} actions={actions} />
        </div>
      </div>

      <SubscriptionActionModal
        action={modalAction}
        tenant={selectedTenant}
        plans={plans}
        isOpen={Boolean(selectedTenant && modalAction)}
        isSubmitting={isSubmitting}
        errorMessage={requestError}
        onClose={closeSubscriptionModal}
        onSubmit={handleSubscriptionSubmit}
      />
    </div>
  );
}

export default TenantManagementPage;
