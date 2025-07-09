import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import checklistReducer from "./features/checklistSlice";
import checklistItemReducer from "./features/checklistitemSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    checklist: checklistReducer,
    checklistItems: checklistItemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
