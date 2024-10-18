import React, { useReducer } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./routes/Login";
import { Register } from "./routes/Register";
import { ObjectPage } from "./routes/Object";
import { Admin } from "./routes/Admin";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Operations } from "./routes/Operations";
import { Coordinates } from "./routes/Coordinates";
import { Car } from "./routes/Car";

export const BASEURL = "/~s369074";
// export const BASEURL = "";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// const store = createStore(useReducer);

const router = createBrowserRouter([
  {
    path: BASEURL + "/",
    element: <App />,
  },
  {
    path: BASEURL + "/login",
    element: <Login />,
  },
  {
    path: BASEURL + "/register",
    element: <Register />,
  },
  {
    path: BASEURL + "/new",
    element: <ObjectPage type={"new"} />,
  },
  {
    path: BASEURL + "/edit/:objectId",
    element: <ObjectPage type={"edit"} />,
  },
  {
    path: BASEURL + "/view/:objectId",
    element: <ObjectPage type={"view"} />,
  },
  {
    path: BASEURL + "/admin",
    element: <Admin />,
  },
  {
    path: BASEURL + "/operations",
    element: <Operations />,
  },
  {
    path: BASEURL + "/coordinates",
    element: <Coordinates />,
  },
  {
    path: BASEURL + "/car",
    element: <Car />,
  },
]);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
