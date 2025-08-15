import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DebtType {
  id?: number;
  createdAt?: string;
  amount: number;
  description: string;
  traderId?: number;
  employeeId?: number;
}

export const debtsEndPoint = "/api/debt";

export interface Debts {
  debtList: DebtType[];
  //lenght: number;
  currentReq: string;
  debtSum: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Debts = {
  debtList: [],
  currentReq: debtsEndPoint,
  //lenght: 0,
  debtSum: 0,
  status: "idle",
};

const debtSlice = createSlice({
  name: "debts",
  initialState: InitialState,
  reducers: {
    appendDebt: (state, action: PayloadAction<DebtType>) => {
      state.debtList = [action.payload, ...state.debtList];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchDebtSum.pending, (state) => {
        console.log("pending Promise Debts");
        state.status = "loading";
      })
      .addCase(
        fetchDebtSum.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.debtSum = Number(action.payload);
          //console.log(state.employees);
        },
      )
      .addCase(fetchDebts.pending, (state) => {
        console.log("pending Promise Debts");
        state.status = "loading";
      })
      .addCase(
        fetchDebts.fulfilled,
        (
          state,
          action: PayloadAction<Pick<Debts, "debtList" | "currentReq">>,
        ) => {
          state.status = "succeeded";
          //console.log(state.currentReq);
          //console.log(action.payload.currentReq);
          if (action.payload.currentReq === state.currentReq) {
            state.debtList = [...state.debtList, ...action.payload.debtList];
          } else {
            state.currentReq = action.payload.currentReq;
            state.debtList = action.payload.debtList;
          }

          console.log(state.debtList);
        },
      );
  },
});

export const fetchDebtSum = createAsyncThunk(
  "debts/fetchDebtSum", // Action type prefix
  async ({
    section /*query type ex: employee,trader */,
    id /*if querying specific person */,
  }: {
    section?: string;
    id?: string;
  }) => {
    if (section && id) {
      const response = await apiInstance.get(
        `${debtsEndPoint}/${section}/${id}/sum`,
      );
      return response.data.amount;
    } else if (section) {
      const response = await apiInstance.get(
        `${debtsEndPoint}/${section}/all/sum`,
      );
      return response.data.amount;
    } else {
      const response = await apiInstance.get(`${debtsEndPoint}/all/all/sum`);
      return response.data.amount;
    }
  },
);

export const fetchDebts = createAsyncThunk(
  "debts/fetchDebts", // Action type prefix
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
    const prevReq: string = getState().debt.currentReq;
    if (section && id) {
      const currentReq = `${debtsEndPoint}/${section}/${id}/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { debtList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { debtList: response.data, currentReq: currentReq };
      }
    } else if (section) {
      const currentReq = `${debtsEndPoint}/${section}/all/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { debtList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { debtList: response.data, currentReq: currentReq };
      }
    } else {
      const currentReq = `${debtsEndPoint}/all/all/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { debtList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { debtList: response.data, currentReq: currentReq };
      }
    }
  },
);

export const { appendDebt } = debtSlice.actions;
export default debtSlice.reducer;
