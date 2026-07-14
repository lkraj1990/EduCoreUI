import { apiClient } from './apiClient';

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return '$0';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const normalizePlanSummary = (plan) => ({
  ...plan,
  priceDisplay: formatCurrency(plan.price),
  billingCycleLabel: plan.billingCycle || 'month',
  features: [
    `${plan.maxStudents || 0} students`,
    `${plan.maxStaff || 0} staff`,
    plan.isActive ? 'Currently active' : 'Currently inactive',
  ],
});

export const planService = {
  listPlans() {
    return apiClient.get('/plans');
  },
  getPlan(id) {
    return apiClient.get(`/plans/${id}`);
  },
  createPlan(payload) {
    return apiClient.post('/plans', payload);
  },
  updatePlan(id, payload) {
    return apiClient.put(`/plans/${id}`, payload);
  },
  activatePlan(id) {
    return apiClient.patch(`/plans/${id}/activate`);
  },
  deactivatePlan(id) {
    return apiClient.patch(`/plans/${id}/deactivate`);
  },
};
