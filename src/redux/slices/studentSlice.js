import { createSlice } from '@reduxjs/toolkit';
import { studentRows } from '../../mockupData/mockupData';

const initialState = {
  students: studentRows,
  showModal: false,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    openModal: (state) => {
      state.showModal = true;
    },
    closeModal: (state) => {
      state.showModal = false;
    },
    addStudent: (state, action) => {
      state.students.push(action.payload);
      state.showModal = false;
    },
  },
});

export const { openModal, closeModal, addStudent } = studentSlice.actions;
export default studentSlice.reducer;
