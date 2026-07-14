import EduModal from './EduModal';

const buildFields = (action, plans) => {
  const planOptions = plans
    .filter((plan) => plan.isActive)
    .map((plan) => ({ value: plan.id, label: `${plan.name} (${plan.priceDisplay}/${plan.billingCycleLabel})` }));

  if (action === 'create') {
    return [
      {
        name: 'tenantId',
        label: 'Backend Tenant ID',
        type: 'text',
        required: true,
        placeholder: 'UUID from the backend tenant record',
        helpText: 'This must match an existing tenant in the API backend.',
      },
      {
        name: 'planId',
        label: 'Target Plan',
        type: 'select',
        required: true,
        options: planOptions,
      },
      {
        name: 'billingCycle',
        label: 'Billing Cycle',
        type: 'select',
        required: true,
        options: [
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ],
      },
      {
        name: 'autoRenew',
        label: 'Enable auto renew',
        type: 'checkbox',
      },
    ];
  }

  if (action === 'upgrade') {
    return [
      {
        name: 'subscriptionId',
        label: 'Subscription ID',
        type: 'text',
        required: true,
        placeholder: 'UUID of the active subscription',
      },
      {
        name: 'targetPlanId',
        label: 'Upgrade To Plan',
        type: 'select',
        required: true,
        options: planOptions,
      },
      {
        name: 'effectiveFrom',
        label: 'Effective From',
        type: 'date',
        helpText: 'Leave empty to let the backend decide the effective date.',
      },
    ];
  }

  return [
    {
      name: 'subscriptionId',
      label: 'Subscription ID',
      type: 'text',
      required: true,
      placeholder: 'UUID of the subscription to cancel',
    },
    {
      name: 'cancelMode',
      label: 'Cancel Mode',
      type: 'select',
      required: true,
      options: [
        { value: 'immediate', label: 'Immediate' },
        { value: 'end-of-term', label: 'End of Term' },
      ],
    },
    {
      name: 'reason',
      label: 'Reason',
      type: 'textarea',
      rows: 3,
      placeholder: 'Optional cancellation reason',
    },
  ];
};

const actionConfig = {
  create: {
    title: 'Create Subscription',
    description: 'Create the first live subscription for this tenant using the billing API.',
    submitButtonText: 'Create Subscription',
    submitButtonVariant: 'primary',
  },
  upgrade: {
    title: 'Upgrade Subscription',
    description: 'Move the tenant to a higher plan using the existing subscription endpoint.',
    submitButtonText: 'Upgrade Plan',
    submitButtonVariant: 'warning',
  },
  cancel: {
    title: 'Cancel Subscription',
    description: 'Cancel the tenant subscription while keeping the tenant record intact.',
    submitButtonText: 'Cancel Subscription',
    submitButtonVariant: 'danger',
  },
};

const SubscriptionActionModal = ({
  action,
  tenant,
  plans,
  isOpen,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}) => {
  if (!action || !tenant) {
    return null;
  }

  const config = actionConfig[action];
  const initialValues = {
    tenantId: tenant.tenantId || '',
    planId: tenant.planId || '',
    billingCycle: tenant.billingCycle || 'monthly',
    autoRenew: tenant.autoRenew ?? true,
    subscriptionId: tenant.subscriptionId || '',
    targetPlanId: '',
    effectiveFrom: '',
    cancelMode: 'end-of-term',
    reason: '',
  };

  return (
    <EduModal
      title={`${config.title} · ${tenant.name}`}
      description={config.description}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      fields={buildFields(action, plans)}
      initialValues={initialValues}
      submitButtonText={config.submitButtonText}
      submitButtonVariant={config.submitButtonVariant}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
    />
  );
};

export default SubscriptionActionModal;