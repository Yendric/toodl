import { GoogleOAuthProvider, type CredentialResponse } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import axiosInstance from "../api/api";
import { useUserInfo } from "../api/generated/toodl";

type AuthState = {
  logout: () => Promise<void>;
  googleLogin: (credentialResponse: CredentialResponse) => Promise<void>;
  checkAuth: () => void;
  isAuth: boolean;
  isLoading: boolean;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useUserInfo();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isUserLoading) {
      if (user && !isUserError) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
      setIsLoading(false);
    }
  }, [user, isUserLoading, isUserError]);

  async function checkAuth() {
    queryClient.invalidateQueries();
  }

  async function register(data: { username: string; email: string; password: string }) {
    await axiosInstance.post("/auth/register", data);
    checkAuth();
  }

  async function login(data: { email: string; password: string }) {
    await axiosInstance.post("/auth/login", data);
    checkAuth();
    enqueueSnackbar("Succesvol ingelogd");
  }

  async function logout() {
    await axiosInstance.get("auth/logout");
    setIsAuth(false);
    queryClient.clear();
    enqueueSnackbar("Succesvol uitgelogd.");
  }

  async function googleLogin(credentialResponse: CredentialResponse) {
    if (!("credential" in credentialResponse)) return;

    await axiosInstance.post("/auth/google", {
      token: credentialResponse.credential,
    });
    checkAuth();
  }

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return "Geen GOOGLE_CLIENT_ID ingesteld in .env";
  }

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, logout, googleLogin, checkAuth, register, login }}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
