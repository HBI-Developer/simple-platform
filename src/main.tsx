import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "./components/ui/provider.tsx";
import { Provider as ProviderRedux } from "react-redux";
import App from "./App.tsx";
import { store } from "./store/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProviderRedux store={store}>
      <Provider>
        <App />
      </Provider>
    </ProviderRedux>
  </StrictMode>
);
