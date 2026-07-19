import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SubscriptionActionModal from '../../common/SubscriptionActionModal';
import EduGrid from '../../common/EduGrid';
import type { EduGridAction, EduGridColumn } from '../../common/EduGridConstants';
import useSubscriptionPlans from '../../hooks/useSubscriptionPlans';
import { deactivateTenant, setTenants, syncTenantSubscription } from '../../redux/slices/tenantSlice';
import { normalizeTenantDetailRecord, subscriptionService, tenantService } from '../../services';
import type { RootState } from '../../redux/store';

type TenantRow = RootState['tenants']['tenants'][number];
type SubscriptionSnapshot = Partial<{
  id: string;
  planId: string;
  status: string;
  billingCycle: string;
  autoRenew: boolean;
}>;
type PersistOverrides = Partial<{
  tenantId: string;
  subscriptionId: string;
  planId: string;
  planName: string;
  subscriptionStatus: string;
  billingCycle: string;
  autoRenew: boolean;
}>;

const TenantManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tenants } = useSelector((state: RootState) => state.tenants);
  const { data: plans = [] } = useSubscriptionPlans();
  const [selectedTenant, setSelectedTenant] = useState<TenantRow | null>(null);
  const [modalAction, setModalAction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isLoadingTenants, setIsLoadingTenants] = useState(false);
  const [tenantsLoadError, setTenantsLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTenantDetails = async () => {
      setIsLoadingTenants(true);
      setTenantsLoadError('');

      try {
        const response = await tenantService.listTenants();
        if (!isMounted) {
          return;
        }

        const tenantRecords = Array.isArray(response)
          ? response.map(normalizeTenantDetailRecord)
          : [];

        dispatch(setTenants(tenantRecords));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setTenantsLoadError(error instanceof Error ? error.message : 'Failed to load tenants.');
      } finally {
        if (isMounted) {
          setIsLoadingTenants(false);
        }
      }
    };

    loadTenantDetails().catch(() => null);

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const closeSubscriptionModal = () => {
    setSelectedTenant(null);
    setModalAction('');
    setRequestError('');
  };

  const openSubscriptionModal = (action: string, tenant: TenantRow) => {
    setSelectedTenant(tenant);
    setModalAction(action);
    setRequestError('');
    setRequestMessage('');
  };

  const findPlanById = (planId?: string) => plans.find((plan) => plan.id === planId);

  const persistSubscription = (tenant: TenantRow, subscription: SubscriptionSnapshot | null, overrides: PersistOverrides = {}) => {
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

  const handleSubscriptionSubmit = async (formData: Record<string, unknown>) => {
    if (!selectedTenant || !modalAction) {
      return;
    }

    setIsSubmitting(true);
    setRequestError('');

    try {
      if (modalAction === 'upgrade') {
        await subscriptionService.upgradeSubscription(String(formData.subscriptionId || ''), {
          targetPlanId: String(formData.targetPlanId || ''),
          effectiveFrom: formData.effectiveFrom ? new Date(String(formData.effectiveFrom)).toISOString() : null,
        });

        let upgradedSubscription = null;
        try {
          upgradedSubscription = await reloadSubscriptionSnapshot(selectedTenant, String(formData.subscriptionId || ''));
        } catch {
          upgradedSubscription = null;
        }

        persistSubscription(selectedTenant, upgradedSubscription, {
          subscriptionId: String(formData.subscriptionId || ''),
          planId: String(formData.targetPlanId || ''),
          subscriptionStatus: upgradedSubscription?.status || 'Pending Upgrade',
        });

        setRequestMessage(`Upgrade requested for ${selectedTenant.name}.`);
        closeSubscriptionModal();
        return;
      }

      await subscriptionService.cancelSubscription(String(formData.subscriptionId || ''), {
        cancelMode: String(formData.cancelMode || ''),
        reason: String(formData.reason || ''),
      });

      let canceledSubscription = null;
      try {
        canceledSubscription = await reloadSubscriptionSnapshot(selectedTenant, String(formData.subscriptionId || ''));
      } catch {
        canceledSubscription = null;
      }

      persistSubscription(selectedTenant, canceledSubscription, {
        subscriptionId: String(formData.subscriptionId || ''),
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
  const columns: EduGridColumn<TenantRow>[] = [
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
          {String(value)}
        </span>
      ),
    },
    {
      key: 'subscriptionStatus',
      label: 'Subscription',
      render: (value) => (
        <span className={`badge ${value === 'Active' ? 'bg-success' : value === 'Cancelled' ? 'bg-danger' : value === 'Pending Upgrade' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
          {String(value)}
        </span>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
    },
  ];

  const actions: EduGridAction<TenantRow>[] = [
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
      label: 'Subscription',
      tooltip: 'Open subscription details',
      ariaLabel: 'Open subscription details',
      renderIcon: () => <span aria-hidden="true" className="fw-bold fs-5 lh-1">S</span>,
      iconOnly: true,
      isVisible: (row) => Boolean(row.plan && row.subscriptionId),
      onClick: (row) => {
        navigate(`/tenant-management/${row.localId}/subscription`);
      },
      className: 'btn-outline-info',
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
      <div className="card-header page-card-header">
        <div className="page-header-wrap">
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
      </div>
      <div className="card-body p-4 p-lg-5">
        {requestMessage && <div className="alert alert-success py-2">{requestMessage}</div>}
        {tenantsLoadError && <div className="alert alert-warning py-2">{tenantsLoadError}</div>}
        {isLoadingTenants && <div className="alert alert-info py-2">Loading tenant details...</div>}

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
