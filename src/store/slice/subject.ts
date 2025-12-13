import { createSlice } from "@reduxjs/toolkit";

const initialState = { loading: false };

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    setSubjectLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const { setSubjectLoading } = subjectSlice.actions;
export default subjectSlice.reducer;
