import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ClientType {
  id?: number;
  name: string;
  debits?: [];
  payments?: [];
}

export const clientsEndPoint = "/api/client";

export interface Clients {
  clientList: ClientType[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Clients = {
  clientList: [],
  status: "idle",
};

const clientSlice = createSlice({
  name: "clients",
  initialState: InitialState,
  reducers: {
    addClient: (state, action: PayloadAction<ClientType>) => {
      state.clientList = [...state.clientList, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        console.log("pending Promise Clients");
        state.status = "loading";
      })
      .addCase(
        fetchClients.fulfilled,
        (state, action: PayloadAction<ClientType[]>) => {
          state.status = "succeeded";
          state.clientList = action.payload;
          //console.log(state.employees);
        },
      )
      .addCase(fetchClientsIfNeeded.pending, (state) => {
        console.log("pending Promise Clients");
        state.status = "loading";
      })
      .addCase(
        fetchClientsIfNeeded.fulfilled,
        (state, action: PayloadAction<ClientType[]>) => {
          state.status = "succeeded";
          state.clientList = action.payload;
        },
      );
  },
});
// Define the async thunk for fetching data
export const fetchClientsIfNeeded = createAsyncThunk(
  "clients/fetchClientsIfNeeded", // Action type prefix
  async (clientsList: ClientType[]) => {
    if (!(clientsList.length > 0)) {
      const response = await apiInstance.get(clientsEndPoint);
      return response.data;
    }
    return clientsList;
  },
);

// Define the async thunk for fetching data
export const fetchClients = createAsyncThunk(
  "clients/fetchClients", // Action type prefix
  async () => {
    const response = await apiInstance.get(clientsEndPoint);
    return response.data;
  },
);

export const { addClient } = clientSlice.actions;
export default clientSlice.reducer;
