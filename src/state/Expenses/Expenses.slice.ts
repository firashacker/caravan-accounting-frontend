import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ExpenseType {
  id?: number;
  createdAt?: string;
  amount: number;
  description: string;
  traderId?: number;
  employeeId?: number;
  investorId?: number;
}

export const expensesEndPoint = "/api/expense";

export interface Expenses {
  expenseList: ExpenseType[];
  //lenght: number;
  currentReq: string;
  expenseSum: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Expenses = {
  expenseList: [],
  currentReq: expensesEndPoint,
  //lenght: 0,
  expenseSum: 0,
  status: "idle",
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState: InitialState,
  reducers: {
    appendExpense: (state, action: PayloadAction<ExpenseType>) => {
      state.expenseList = [action.payload, ...state.expenseList];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchExpenseSum.pending, (state) => {
        console.log("pending Promise Expenses");
        state.status = "loading";
      })
      .addCase(
        fetchExpenseSum.fulfilled,
        (state, action: PayloadAction<ExpenseType[]>) => {
          state.status = "succeeded";
          state.expenseSum = Number(action.payload);
          //console.log(state.employees);
        },
      )
      .addCase(fetchExpenses.pending, (state) => {
        console.log("pending Promise Expenses");
        state.status = "loading";
      })
      .addCase(
        fetchExpenses.fulfilled,
        (
          state,
          action: PayloadAction<Pick<Expenses, "expenseList" | "currentReq">>,
        ) => {
          state.status = "succeeded";
          //console.log(state.currentReq);
          //console.log(action.payload.currentReq);
          if (action.payload.currentReq === state.currentReq) {
            state.expenseList = [
              ...state.expenseList,
              ...action.payload.expenseList,
            ];
          } else {
            state.currentReq = action.payload.currentReq;
            state.expenseList = action.payload.expenseList;
          }

          console.log(state.expenseList);
        },
      );
  },
});

export const fetchExpenseSum = createAsyncThunk(
  "expenses/fetchExpenseSum", // Action type prefix
  async ({
    section /*query type ex: employee,trader */,
    id /*if querying specific person */,
  }: {
    section?: string;
    id?: string;
  }) => {
    if (section && id) {
      const response = await apiInstance.get(
        `${expensesEndPoint}/${section}/${id}/sum`,
      );
      return response.data.amount;
    } else if (section) {
      const response = await apiInstance.get(
        `${expensesEndPoint}/${section}/all/sum`,
      );
      return response.data.amount;
    } else {
      const response = await apiInstance.get(`${expensesEndPoint}/all/all/sum`);
      return response.data.amount;
    }
  },
);

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses", // Action type prefix
  async (
    {
      from = 0 /*query starts from */,
      section /*query type ex: employee,trader */,
      id /*if querying specific person */,
    }: {
      from?: number;
      section?: string;
      id?: string;
    },
    { getState },
  ) => {
    //@ts-expect-error @ts-ignore
    const prevReq: string = getState().expense.currentReq;
    if (section && id) {
      const currentReq = `${expensesEndPoint}/${section}/${id}/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { expenseList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { expenseList: response.data, currentReq: currentReq };
      }
    } else if (section) {
      const currentReq = `${expensesEndPoint}/${section}/all/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { expenseList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { expenseList: response.data, currentReq: currentReq };
      }
    } else {
      const currentReq = `${expensesEndPoint}/all/all/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { expenseList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { expenseList: response.data, currentReq: currentReq };
      }
    }
  },
);

export const { appendExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
