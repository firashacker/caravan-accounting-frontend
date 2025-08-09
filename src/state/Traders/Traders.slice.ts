import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TraderType {
  id?: number;
  name: string;
  debts?: [];
  payments?: [];
}

export const tradersEndPoint = "/api/trader";

export interface Traders {
  traderList: TraderType[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Traders = {
  traderList: [],
  status: "idle",
};

const traderSlice = createSlice({
  name: "traders",
  initialState: InitialState,
  reducers: {
    addTrader: (state, action: PayloadAction<TraderType>) => {
      state.traderList = [...state.traderList, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTraders.pending, (state) => {
        console.log("pending Promise Traders");
        state.status = "loading";
      })
      .addCase(
        fetchTraders.fulfilled,
        (state, action: PayloadAction<TraderType[]>) => {
          state.status = "succeeded";
          state.traderList = action.payload;
          //console.log(state.employees);
        },
      )
      .addCase(fetchTradersIfNeeded.pending, (state) => {
        console.log("pending Promise Traders");
        state.status = "loading";
      })
      .addCase(
        fetchTradersIfNeeded.fulfilled,
        (state, action: PayloadAction<TraderType[]>) => {
          state.status = "succeeded";
          state.traderList = action.payload;
        },
      );
  },
});
// Define the async thunk for fetching data
export const fetchTradersIfNeeded = createAsyncThunk(
  "traders/fetchTradersIfNeeded", // Action type prefix
  async (anything = undefined, { getState }) => {
    console.log(anything);
    //@ts-expect-error @ts-ignore
    const listLength = getState().traders.traderList.length;
    if (!(listLength > 0)) {
      const response = await apiInstance.get(tradersEndPoint);
      return response.data;
    }
    //@ts-expect-error @ts-ignore
    return getState().traders.traderList;
  },
);

// Define the async thunk for fetching data
export const fetchTraders = createAsyncThunk(
  "traders/fetchTraders", // Action type prefix
  async () => {
    const response = await apiInstance.get(tradersEndPoint);
    return response.data;
  },
);

export const { addTrader } = traderSlice.actions;
export default traderSlice.reducer;
