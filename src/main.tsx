import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { hydrate } from "./redux/features/authSlice";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

const savedAuthState = localStorage.getItem("authState");
if (savedAuthState) {
  try {
    const parsedState = JSON.parse(savedAuthState);
    store.dispatch(hydrate(parsedState));
  } catch (error) {
    console.error("Error hydrating auth state:", error);
    localStorage.removeItem("authState");
  }
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
