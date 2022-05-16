import Router from "./components/Router";
import { BrowserRouter } from "react-router-dom";
// import Footer from './components/Partials/Footer';
// import NavBar from './components/Partials/NavBar';
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppStateProvider } from "./context/AppState";
// import LoadingBar from './components/Partials/LoadingBar';
import "./App.scss";
import { FC, useMemo } from "react";
import NavBar from "./components/Partials/NavBar";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import axios from "axios";
import Footer from "./components/Partials/Footer";
import LoadingBar from "./components/Partials/LoadingBar";

axios.defaults.withCredentials = true;

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
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppStateProvider>
        <BrowserRouter>
          <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <div style={{ flex: "1 0 auto" }}>
              <NavBar />
              <LoadingBar />
              <Router />
            </div>
            <div style={{ flexShrink: 0, zIndex: theme.zIndex.drawer + 1 }}>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  );
};

export default App;
