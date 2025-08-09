import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InvestorType {
  id?: number;
  name: string;
  expenses?: [];
}

export const investorsEndPoint = "/api/investor";

export interface Investors {
  investorList: InvestorType[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Investors = {
  investorList: [],
  status: "idle",
};

const investorSlice = createSlice({
  name: "investors",
  initialState: InitialState,
  reducers: {
    addInvestor: (state, action: PayloadAction<InvestorType>) => {
      state.investorList = [...state.investorList, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestors.pending, (state) => {
        console.log("pending Promise Investors");
        state.status = "loading";
      })
      .addCase(
        fetchInvestors.fulfilled,
        (state, action: PayloadAction<InvestorType[]>) => {
          state.status = "succeeded";
          state.investorList = action.payload;
          //console.log(state.employees);
        },
      )
      .addCase(fetchInvestorsIfNeeded.pending, (state) => {
        console.log("pending Promise Investors");
        state.status = "loading";
      })
      .addCase(
        fetchInvestorsIfNeeded.fulfilled,
        (state, action: PayloadAction<InvestorType[]>) => {
          state.status = "succeeded";
          state.investorList = action.payload;
        },
      );
  },
});
// Define the async thunk for fetching data
export const fetchInvestorsIfNeeded = createAsyncThunk(
  "investors/fetchInvestorsIfNeeded", // Action type prefix
  async (anything = undefined, { getState }) => {
    console.log(anything);
    //@ts-expect-error @ts-ignore
    const investorListLength = getState().investors.investorList.length;
    if (!(investorListLength > 0)) {
      const response = await apiInstance.get(investorsEndPoint);
      return response.data;
    }
    //@ts-expect-error @ts-ignore
    return getState().investors.investorList;
  },
);

// Define the async thunk for fetching data
export const fetchInvestors = createAsyncThunk(
  "investors/fetchInvestors", // Action type prefix
  async () => {
    const response = await apiInstance.get(investorsEndPoint);
    return response.data;
  },
);

export const { addInvestor } = investorSlice.actions;
export default investorSlice.reducer;
