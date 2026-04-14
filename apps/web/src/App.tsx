import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useMemo, type FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { z } from "zod";
import "./App.scss";
import DashboardLayout from "./components/DashboardLayout";
import Error404 from "./components/Errors/Error404";
import { AppStateProvider } from "./context/AppState";
import { AuthProvider } from "./context/AuthState";
import { queryClient } from "./queryClient";
import ErrorPage from "./routes/error-page";
import LandingLoading from "./routes/index/loading";
import LandingPage from "./routes/index/page";
import LoginLoading from "./routes/login/loading";
import LoginPage from "./routes/login/page";
import RegisterLoading from "./routes/register/loading";
import RegisterPage from "./routes/register/page";
import Root from "./routes/root";
import SettingsLoading from "./routes/settings/loading";
import SettingsPage from "./routes/settings/page";
import ShoppingSettingsLoading from "./routes/shopping-settings/loading";
import ShoppingSettingsPage from "./routes/shopping-settings/page";
import TodosLoading from "./routes/todos/loading";
import TodosPage from "./routes/todos/page";
import VoorwaardenLoading from "./routes/voorwaarden/loading";
import VoorwaardenPage from "./routes/voorwaarden/page";

z.config(z.locales.nl());

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LandingLoading />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<LoginLoading />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<RegisterLoading />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "voorwaarden",
        element: (
          <Suspense fallback={<VoorwaardenLoading />}>
            <VoorwaardenPage />
          </Suspense>
        ),
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "todos",
            element: (
              <Suspense fallback={<TodosLoading />}>
                <TodosPage />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={<SettingsLoading />}>
                <SettingsPage />
              </Suspense>
            ),
          },
          {
            path: "shopping-settings",
            element: (
              <Suspense fallback={<ShoppingSettingsLoading />}>
                <ShoppingSettingsPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
]);

const App: FC = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        zIndex: {
          drawer: 1000,
        },
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
        components: {
          MuiList: {
            defaultProps: {
              dense: true,
            },
          },
          MuiButtonBase: {
            defaultProps: {
              disableRipple: true,
            },
          },
        },
        shape: {
          borderRadius: 15,
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <AuthProvider>
            <Suspense fallback={<TodosLoading />}>
              <RouterProvider router={router} />
            </Suspense>
          </AuthProvider>
        </AppStateProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
