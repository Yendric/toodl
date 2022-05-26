import { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { useAppState } from "./AppState";
import { useSnackbar } from "notistack";
import IUser from "../types/IUser";
import axios from "axios";
import { CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";

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
  const { setIsLoading, apiUrl } = useAppState();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    setIsLoading(true);

    try {
      const res = await axios(`${apiUrl}/auth/user_data`);
      enqueueSnackbar("Succesvol ingelogd");
      setUser({ ...res.data, auth: true });
    } catch {
      setUser({ ...user, auth: false });
    }

    setIsLoading(false);
  }

  async function logout() {
    await axios(`${apiUrl}/auth/logout`);

    setUser({
      auth: false,
    });
    enqueueSnackbar("Succesvol uitgelogd.");
  }

  async function deleteAccount() {
    await axios.post(`${apiUrl}/auth/user_data/destroy`);
    logout();
    enqueueSnackbar("Account succesvol verwijderd.");
  }

  async function googleLogin(credentialResponse: CredentialResponse) {
    if (!("credential" in credentialResponse)) return;

    await axios.post(`${apiUrl}/auth/google`, {
      token: credentialResponse.credential,
    });
    checkAuth();
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ""}>
      <AuthContext.Provider value={{ user, logout, googleLogin, checkAuth, deleteAccount }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
