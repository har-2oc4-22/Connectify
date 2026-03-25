import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    message: null,
    type: "success", // success, error, info
  },
  reducers: {
    setToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },
    clearToast: (state) => {
      state.message = null;
    }
  }
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
