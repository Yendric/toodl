import { createContext, useContext, useState, FC, ReactNode } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { SnackbarProvider } from "notistack";
import nlLocale from "date-fns/locale/nl-BE";
import { TodoProvider } from "./TodoState";
import { AuthProvider } from "./AuthState";
import { SocketProvider } from "./SocketState";
import { ListProvider } from "./ListState";
import { CurrentListProvider } from "./CurrentListState";
import { SmartschoolEventsProvider } from "./SmartschoolEventsState";

export type appState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  apiUrl: string;
};

export const AppStateContext = createContext<appState | undefined>(undefined);

export const AppStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL + "/v1" ?? "http://localhost/api/v1";

  return (
    <AppStateContext.Provider value={{ isLoading, setIsLoading, apiUrl }}>
      <SnackbarProvider maxSnack={3} variant="success">
        <AuthProvider>
          <SocketProvider>
            <TodoProvider>
              <ListProvider>
                <CurrentListProvider>
                  <SmartschoolEventsProvider>
                    <LocalizationProvider locale={nlLocale} dateAdapter={AdapterDateFns}>
                      {children}
                    </LocalizationProvider>
                  </SmartschoolEventsProvider>
                </CurrentListProvider>
              </ListProvider>
            </TodoProvider>
          </SocketProvider>
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
