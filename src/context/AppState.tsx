import { createContext, useContext, useState, FC, ReactNode, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SnackbarProvider } from "notistack";
import nlLocale from "date-fns/locale/nl-BE";
import { AuthProvider } from "./AuthState";

export type appState = {
  isLoading: boolean;
  addLoading: (name: string) => void;
  removeLoading: (name: string) => void;
};

export const AppStateContext = createContext<appState | undefined>(undefined);

export const AppStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<string[]>(["auth"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(loading.length > 0);
  }, [loading]);

  function addLoading(name: string) {
    setLoading((current) => [...current, name]);
  }

  function removeLoading(name: string) {
    setLoading((current) => current.filter((l) => l !== name));
  }

  return (
    <AppStateContext.Provider value={{ isLoading, addLoading, removeLoading }}>
      <SnackbarProvider maxSnack={3} variant="success">
        <AuthProvider>
          <LocalizationProvider adapterLocale={nlLocale} dateAdapter={AdapterDateFns}>
            {children}
          </LocalizationProvider>
        </AuthProvider>
      </SnackbarProvider>
    </AppStateContext.Provider>
  );
};

export function useAppState(): appState {
  const context = useContext(AppStateContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
