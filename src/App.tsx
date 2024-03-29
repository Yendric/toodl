import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { registerLicense } from "@syncfusion/ej2-base";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import i18next from "i18next";
import { FC, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/nl/zod.json";
import { setMutationDefaults } from "./api/mutationDefaults";
import "./App.scss";
import NavBar from "./components/Partials/NavBar";
import Router from "./components/Router";
import { AppStateProvider } from "./context/AppState";
import { createIDBPersister } from "./helpers/createIDBPersister";
import { queryClient } from "./queryClient";

/* Zod i18n */
i18next.init({
  lng: "nl",
  resources: {
    nl: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

/* SyncFusion EJ2 react scheduler license */
registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE ?? "");

/* React query client */

const persister = createIDBPersister();
setMutationDefaults();

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
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: Infinity }}>
        <AppStateProvider>
          <BrowserRouter>
            <NavBar />
            <Router />
          </BrowserRouter>
        </AppStateProvider>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
