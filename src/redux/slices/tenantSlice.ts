import { createSlice } from '@reduxjs/toolkit';
import { tenantRows } from '../../mockupData/mockupData';

const normalizeTenant = (tenant, index) => ({
  localId: tenant.localId || tenant.tenantId || `tenant-${index + 1}`,
  tenantId: tenant.tenantId || '',
  subscriptionId: tenant.subscriptionId || '',
  planId: tenant.planId || '',
  subscriptionStatus: tenant.subscriptionStatus || 'Not Linked',
  billingCycle: tenant.billingCycle || 'monthly',
  autoRenew: tenant.autoRenew ?? true,
  ...tenant,
});

const findTenantIndex = (tenants, payload) => {
  const identifier = typeof payload === 'string' ? { localId: payload, name: payload } : payload;

  return tenants.findIndex((tenant) => {
    return [tenant.localId, tenant.tenantId, tenant.name].includes(identifier.localId)
      || [tenant.localId, tenant.tenantId, tenant.name].includes(identifier.tenantId)
      || [tenant.localId, tenant.tenantId, tenant.name].includes(identifier.name);
  });
};

const initialState = {
  tenants: tenantRows.map(normalizeTenant),
};

const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    addTenant: (state, action) => {
      state.tenants.push(normalizeTenant(action.payload, state.tenants.length));
    },
    deactivateTenant: (state, action) => {
      const tenantIndex = findTenantIndex(state.tenants, action.payload);
      if (tenantIndex !== -1) {
        state.tenants[tenantIndex].status = 'Inactive';
      }
    },
    updateTenant: (state, action) => {
      const index = findTenantIndex(state.tenants, action.payload);
      if (index !== -1) {
        state.tenants[index] = {
          ...state.tenants[index],
          ...action.payload,
        };
      }
    },
    syncTenantSubscription: (state, action) => {
      const index = findTenantIndex(state.tenants, action.payload);
      if (index !== -1) {
        state.tenants[index] = {
          ...state.tenants[index],
          ...action.payload,
        };
      }
    },
  },
});

export const { addTenant, deactivateTenant, updateTenant, syncTenantSubscription } = tenantSlice.actions;
export default tenantSlice.reducer;
