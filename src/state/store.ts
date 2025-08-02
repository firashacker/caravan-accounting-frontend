import { configureStore } from "@reduxjs/toolkit";
import EmployeeReducer from "./Employees/Employees.slice";
export const store = configureStore({
  reducer: {
    Employees: EmployeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
