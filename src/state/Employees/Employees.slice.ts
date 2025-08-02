import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface Employee {
  id: number;
  name: string;
  dayly: number;
  weekly: number;
  monthly: number;
  days: number;
  weeks: number;
  months: number;
}

export interface Employees {
  employees: Employee[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Employees = {
  employees: [],
  status: "idle",
};

const employeeSlice = createSlice({
  name: "employees",
  initialState: InitialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        console.log("pending Promise Employee");
        state.status = "loading";
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          //state.status = "succeeded";
          state.employees = action.payload;
        },
      );
    /* .addCase(fetchEmployees.rejected, (state) => {
        state.status = "failed";
        });*/
  },
});
// Define the async thunk for fetching data
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees", // Action type prefix
  async () => {
    const response = await apiInstance.get("/api/employee");
    return response.data;
  },
);

export const { setEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
