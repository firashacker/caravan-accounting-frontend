import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IncomeType {
  id?: number;
  createdAt?: string;
  amount: number;
  description: string;
  clientId: number;
}

export const incomesEndPoint = "/api/income";

export interface Incomes {
  incomeList: IncomeType[];
  //lenght: number;
  currentReq: string;
  incomeSum: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Incomes = {
  incomeList: [],
  currentReq: incomesEndPoint,
  //lenght: 0,
  incomeSum: 0,
  status: "idle",
};

const incomeSlice = createSlice({
  name: "incomes",
  initialState: InitialState,
  reducers: {
    appendIncome: (state, action: PayloadAction<IncomeType>) => {
      state.incomeList = [action.payload, ...state.incomeList];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchIncomeSum.pending, (state) => {
        console.log("pending Promise Incomes");
        state.status = "loading";
      })
      .addCase(
        fetchIncomeSum.fulfilled,
        (state, action: PayloadAction<IncomeType[]>) => {
          state.status = "succeeded";
          state.incomeSum = Number(action.payload);
          //console.log(state.employees);
        },
      )
      .addCase(fetchIncomes.pending, (state) => {
        console.log("pending Promise Incomes");
        state.status = "loading";
      })
      .addCase(
        fetchIncomes.fulfilled,
        (
          state,
          action: PayloadAction<Pick<Incomes, "incomeList" | "currentReq">>,
        ) => {
          state.status = "succeeded";
          //console.log(state.currentReq);
          //console.log(action.payload.currentReq);
          if (action.payload.currentReq === state.currentReq) {
            state.incomeList = [
              ...state.incomeList,
              ...action.payload.incomeList,
            ];
          } else {
            state.currentReq = action.payload.currentReq;
            state.incomeList = action.payload.incomeList;
          }

          console.log(state.incomeList);
        },
      );
  },
});

export const fetchIncomeSum = createAsyncThunk(
  "incomes/fetchIncomeSum", // Action type prefix
  async ({
    section /*query type ex: employee,trader */,
    id /*if querying specific person */,
  }: {
    section?: string;
    id?: string;
  }) => {
    if (section && id) {
      const response = await apiInstance.get(
        `${incomesEndPoint}/${section}/${id}/sum`,
      );
      return response.data.amount;
    } else if (section) {
      const response = await apiInstance.get(
        `${incomesEndPoint}/${section}/all/sum`,
      );
      return response.data.amount;
    } else {
      const response = await apiInstance.get(`${incomesEndPoint}/all/all/sum`);
      return response.data.amount;
    }
  },
);

export const fetchIncomes = createAsyncThunk(
  "incomes/fetchIncomes", // Action type prefix
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
    const prevReq: string = getState().income.currentReq;
    if (section && id) {
      const currentReq = `${incomesEndPoint}/${section}/${id}/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { incomeList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { incomeList: response.data, currentReq: currentReq };
      }
    } else if (section) {
      const currentReq = `${incomesEndPoint}/${section}/all/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { incomeList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { incomeList: response.data, currentReq: currentReq };
      }
    } else {
      const currentReq = `${incomesEndPoint}/all/all/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { incomeList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { incomeList: response.data, currentReq: currentReq };
      }
    }
  },
);

export const { appendIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
