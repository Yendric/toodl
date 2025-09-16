import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { nlNL } from "@mui/x-date-pickers/locales";
import nlLocale from "date-fns/locale/nl-BE";
import { SnackbarProvider } from "notistack";
import { type FC, type ReactNode } from "react";
import { AuthProvider } from "./AuthState";

export const AppStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SnackbarProvider maxSnack={3} variant="success">
      <AuthProvider>
        <LocalizationProvider
          localeText={nlNL.components.MuiLocalizationProvider.defaultProps.localeText}
          adapterLocale={nlLocale}
          dateAdapter={AdapterDateFns}
        >
          {children}
        </LocalizationProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
};
