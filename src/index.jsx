import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import ErrorPage from "./pages/ErrorPage";
import Root from "./routes/root";
import ItemPage from "./pages/ItemPage";
// import NewItemPage from "./pages/NewItemPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

const theme = createTheme({
  palette: {
    primary: {
      main: "#4E2A84",
    },
    darkbackground: {
      main: "#fff",
      contrastText: "#000",
    },
    contrast: {
      main: "#6D28D9",
      light: "#fff",
      dark: "#4c1d95",
      contrastText: "#fff",
    },
    purple: {
      main: "#4e2a84",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <ItemPage /> },
      // {
      //   path: "newitem",
      //   element: <NewItemPage />,
      // },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </ThemeProvider>
  </React.StrictMode>
);
