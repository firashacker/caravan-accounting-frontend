import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./Employees/Employees.slice";
import clientsReducer from "./Clients/Clients.slice";
import tradersReducer from "./Traders/Traders.slice";
import authReducer from "./Auth/Auth.slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; //localStorage

//Redux Persist Configuration
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    clients: clientsReducer,
    traders: tradersReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
