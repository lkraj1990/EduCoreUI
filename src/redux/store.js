import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice';
import tenantReducer from './slices/tenantSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,
    tenants: tenantReducer,
  },
});
