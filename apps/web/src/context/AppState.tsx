import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import nlLocale from "date-fns/locale/nl-BE";
import { SnackbarProvider } from "notistack";
import { FC, ReactNode } from "react";
import { AuthProvider } from "./AuthState";

export const AppStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SnackbarProvider maxSnack={3} variant="success">
      <AuthProvider>
        <LocalizationProvider adapterLocale={nlLocale} dateAdapter={AdapterDateFns}>
          {children}
        </LocalizationProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
};
