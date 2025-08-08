//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store, persistor } from "./state/store.ts";
import { PersistGate } from "redux-persist/lib/integration/react";
import Spinner from "./components/Spinner/Spinner.component.tsx";

createRoot(document.getElementById("root")!).render(
  //<StrictMode>
  <PersistGate loading={<Spinner />} persistor={persistor}>
    <Provider store={store}>
      <App />
    </Provider>
  </PersistGate>,
  //</StrictMode>,
);
