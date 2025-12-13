import { configureStore } from "@reduxjs/toolkit";
import colorSlice from "./slice/color";
import scopeSlice from "./slice/scope";
import subjectSlice from "./slice/subject";

export const store = configureStore({
  reducer: {
    color: colorSlice,
    scope: scopeSlice,
    subject: subjectSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
