import { createSlice } from '@reduxjs/toolkit';
import { tenantRows } from '../../mockupData/mockupData';

const initialState = {
  tenants: tenantRows,
  showModal: false,
};

const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    openModal: (state) => {
      state.showModal = true;
    },
    closeModal: (state) => {
      state.showModal = false;
    },
    addTenant: (state, action) => {
      state.tenants.push(action.payload);
      state.showModal = false;
    },
    deactivateTenant: (state, action) => {
      const tenant = state.tenants.find((t) => t.name === action.payload);
      if (tenant) {
        tenant.status = 'Inactive';
      }
    },
    updateTenant: (state, action) => {
      const index = state.tenants.findIndex((t) => t.name === action.payload.name);
      if (index !== -1) {
        state.tenants[index] = action.payload;
      }
    },
  },
});

export const { openModal, closeModal, addTenant, deactivateTenant, updateTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
