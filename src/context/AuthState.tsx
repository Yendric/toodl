import { createContext, useContext, useState, useEffect, FC } from "react";
import { useAppState } from "./AppState";
import { useSnackbar } from "notistack";
import IUser from "../types/IUser";
import axios from "axios";
import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";

type AuthState = {
  user: IUser;
  logout: () => Promise<void>;
  googleLogin: (googleData: GoogleLoginResponse | GoogleLoginResponseOffline) => Promise<void>;
  checkAuth: () => void;
  deleteAccount: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: FC = ({ children }) => {
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
      username: "",
      auth: false,
    });
  }

  async function deleteAccount() {
    await axios.post(`${apiUrl}/auth/delete`);
    logout();
  }

  async function googleLogin(googleData: GoogleLoginResponse | GoogleLoginResponseOffline) {
    if (!("tokenId" in googleData)) return;

    await axios.post(`${apiUrl}/auth/google`, {
      token: googleData.tokenId,
    });
    checkAuth();
  }

  return (
    <AuthContext.Provider value={{ user, logout, googleLogin, checkAuth, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
