import { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { useAppState } from "./AppState";
import { useSnackbar } from "notistack";
import IUser from "../types/IUser";
import { CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";
import useAxios from "../hooks/useAxios";
import { SmartschoolEventsProvider } from "./SmartschoolEventsState";
import { CurrentListProvider } from "./CurrentListState";
import { ListProvider } from "./ListState";
import { TodoProvider } from "./TodoState";
import { SocketProvider } from "./SocketState";

type AuthState = {
  user: IUser;
  logout: () => Promise<void>;
  googleLogin: (credentialResponse: CredentialResponse) => Promise<void>;
  checkAuth: () => void;
  deleteAccount: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser>({ auth: false });
  const { addLoading, removeLoading } = useAppState();
  const { enqueueSnackbar } = useSnackbar();
  const axios = useAxios();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    addLoading("auth");

    try {
      const res = await axios("/auth/user_data");
      addLoading("todos");
      addLoading("lists");
      setUser({ ...res.data, auth: true });
    } catch {
      setUser({ ...user, auth: false });
    }

    removeLoading("auth");
  }

  async function logout() {
    await axios("auth/logout");

    setUser({
      auth: false,
    });
    enqueueSnackbar("Succesvol uitgelogd.");
  }

  async function deleteAccount() {
    await axios.post("/auth/user_data/destroy");
    logout();
    enqueueSnackbar("Account succesvol verwijderd.");
  }

  async function googleLogin(credentialResponse: CredentialResponse) {
    if (!("credential" in credentialResponse)) return;

    await axios.post("/auth/google", {
      token: credentialResponse.credential,
    });
    checkAuth();
  }

  return (
    <AuthContext.Provider value={{ user, logout, googleLogin, checkAuth, deleteAccount }}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""}>
        {user.auth ? (
          <SocketProvider>
            <TodoProvider>
              <ListProvider>
                <CurrentListProvider>
                  <SmartschoolEventsProvider>{children}</SmartschoolEventsProvider>
                </CurrentListProvider>
              </ListProvider>
            </TodoProvider>
          </SocketProvider>
        ) : (
          children
        )}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
