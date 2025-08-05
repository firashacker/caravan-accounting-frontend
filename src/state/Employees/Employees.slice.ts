import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export const employeesEndPoint = "/api/employee";

export interface EmployeeType {
  id?: number;
  name: string;
  paymentMethod: "dayly" | "weekly" | "monthly";
  paymentAmount: number;
  paymentUnits: number;
  extra: number;
  balance: number;
}

export interface Employees {
  employeeList: EmployeeType[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Employees = {
  employeeList: [],
  status: "idle",
};

const employeeSlice = createSlice({
  name: "employees",
  initialState: InitialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<EmployeeType>) => {
      state.employeeList = [...state.employeeList, action.payload];
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
        (state, action: PayloadAction<EmployeeType[]>) => {
          state.status = "succeeded";
          state.employeeList = action.payload;
          //console.log(state.employees);
        },
      )
      .addCase(fetchEmployeesIfNeeded.pending, (state) => {
        console.log("pending Promise Employee");
        state.status = "loading";
      })
      .addCase(
        fetchEmployeesIfNeeded.fulfilled,
        (state, action: PayloadAction<EmployeeType[]>) => {
          state.status = "succeeded";
          state.employeeList = action.payload;
        },
      );
    /* .addCase(fetchEmployees.rejected, (state) => {
        state.status = "failed";
        });*/
  },
});
// Define the async thunk for fetching data
export const fetchEmployeesIfNeeded = createAsyncThunk(
  "employees/fetchEmployeesIfNeeded", // Action type prefix
  async (employeeList: EmployeeType[]) => {
    if (!(employeeList.length > 0)) {
      const response = await apiInstance.get(employeesEndPoint);
      return response.data;
    }
    return employeeList;
  },
);

// Define the async thunk for fetching data
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees", // Action type prefix
  async () => {
    const response = await apiInstance.get(employeesEndPoint);
    return response.data;
  },
);

export const { addEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
