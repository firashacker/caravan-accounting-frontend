import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DebitType {
  id?: number;
  createdAt?: string;
  amount: number;
  description: string;
  clientId?: number;
}

export const debitsEndPoint = "/api/debit";

export interface Debits {
  debitList: DebitType[];
  //lenght: number;
  currentReq: string;
  debitSum: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Debits = {
  debitList: [],
  currentReq: debitsEndPoint,
  //lenght: 0,
  debitSum: 0,
  status: "idle",
};

const debitSlice = createSlice({
  name: "debits",
  initialState: InitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchDebitSum.pending, (state) => {
        console.log("pending Promise Debits");
        state.status = "loading";
      })
      .addCase(
        fetchDebitSum.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.debitSum = Number(action.payload);
          //console.log(state.employees);
        },
      )
      .addCase(fetchDebits.pending, (state) => {
        console.log("pending Promise Debits");
        state.status = "loading";
      })
      .addCase(
        fetchDebits.fulfilled,
        (
          state,
          action: PayloadAction<Pick<Debits, "debitList" | "currentReq">>,
        ) => {
          state.status = "succeeded";
          //console.log(state.currentReq);
          //console.log(action.payload.currentReq);
          if (action.payload.currentReq === state.currentReq) {
            state.debitList = [...state.debitList, ...action.payload.debitList];
          } else {
            state.currentReq = action.payload.currentReq;
            state.debitList = action.payload.debitList;
          }

          console.log(state.debitList);
        },
      );
  },
});

export const fetchDebitSum = createAsyncThunk(
  "debits/fetchDebitSum", // Action type prefix
  async ({
    section /*query type ex: employee,trader */,
    id /*if querying specific person */,
  }: {
    section?: string;
    id?: string;
  }) => {
    if (section && id) {
      const response = await apiInstance.get(
        `${debitsEndPoint}/${section}/${id}/sum`,
      );
      return response.data.amount;
    } else if (section) {
      const response = await apiInstance.get(
        `${debitsEndPoint}/${section}/all/sum`,
      );
      return response.data.amount;
    } else {
      const response = await apiInstance.get(`${debitsEndPoint}/all/all/sum`);
      return response.data.amount;
    }
  },
);

export const fetchDebits = createAsyncThunk(
  "debits/fetchDebits", // Action type prefix
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
    const prevReq: string = getState().debit.currentReq;
    if (section && id) {
      const currentReq = `${debitsEndPoint}/${section}/${id}/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { debitList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { debitList: response.data, currentReq: currentReq };
      }
    } else if (section) {
      const currentReq = `${debitsEndPoint}/${section}/all/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { debitList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { debitList: response.data, currentReq: currentReq };
      }
    } else {
      const currentReq = `${debitsEndPoint}/all/all/list`;
      if (prevReq === currentReq) {
        const response = await apiInstance.get(`${currentReq}/${from}`);
        return { debitList: response.data, currentReq: currentReq };
      } else {
        const response = await apiInstance.get(`${currentReq}/0`);
        return { debitList: response.data, currentReq: currentReq };
      }
    }
  },
);

export default debitSlice.reducer;
