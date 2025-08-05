import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signOutInstance } from "../../lib/axios";
import { signInInstance } from "../../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
  id?: number;
  username: string;
  isAdmin: boolean;
  refreshToken: string;
}

export const authEndPoint = "/api/login";

export interface Auth {
  user: UserType;
  error: { message?: string; status?: number };
  status: "idle" | "loading" | "succeeded" | "failed";
}

const InitialState: Auth = {
  user: { id: 0, username: "", isAdmin: false, refreshToken: "" },
  error: {},
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState: InitialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = {};
    },
    localSignOut: (state) => {
      state.user = InitialState.user;
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state) => {
        console.log("pending Promise Login");
        state.status = "loading";
      })
      .addCase(
        authLogin.fulfilled,
        (state, action: PayloadAction<UserType>) => {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
          state.status = "succeeded";
          state.user = { ...action.payload, refreshToken: "" };
          window.location.href = "/";
        },
      )
      .addCase(authLogin.rejected, (state, action) => {
        state.error = action.error;
        state.status = "failed";
      })
      .addCase(authLogout.pending, (state) => {
        console.log("pending Promise Logout");
        state.status = "loading";
      })
      .addCase(authLogout.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = InitialState.user;
        window.location.href = "/";
      });
  },
});
// Define the async thunk for fetching data
export const authLogin = createAsyncThunk(
  "auth/login", // Action type prefix
  async (loginValues: { username: string; password: string }) => {
    const response = await signInInstance.post(authEndPoint, loginValues);
    return response.data;
  },
);

// Define the async thunk for fetching data
export const authLogout = createAsyncThunk(
  "auth/logout", // Action type prefix
  async () => {
    localStorage.removeItem("refreshToken");
    await signOutInstance.post("/api/logout");
    return undefined;
  },
);

export const { localSignOut, resetAuthError } = authSlice.actions;
export default authSlice.reducer;
