import { CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";
import { onlineManager, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useUser } from "../api/user/getUser";
import { isOnline } from "../helpers/isOnline";

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
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [online, setOnlineState] = useState(false);

  function setOnline(online: boolean) {
    setOnlineState(online);
    onlineManager.setOnline(online);
  }

  useEffect(() => {
    onlineManager.setOnline(false);
    window.addEventListener("online", () => {
      (async () => {
        setOnline(await isOnline());
      })();
    });
    window.addEventListener("offline", () => {
      (async () => {
        setOnline(await isOnline());
      })();
    });

    const interval = setInterval(() => {
      (async () => {
        setOnline(await isOnline());
      })();
    }, 5000);
    (async () => {
      setOnline(await isOnline());
    })();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [online, user]);

  async function checkAuth() {
    if (online) {
      try {
        await api("/auth/user_data");
        setIsAuth(true);
      } catch {
        // Er was een error bij het fetchen van de gebruiker, wat impliceert dat deze niet meer ingelogd is
        setIsAuth(false);
        // Invalidate queries zodat geen offline todos bij een andere gebruiker terecht zouden komen
        queryClient.clear();
      }
      await Promise.all(
        queryClient
          .getMutationCache()
          .getAll()
          .map(async (mutation) => {
            await mutation.continue();
          }),
      );
      queryClient.invalidateQueries();
    } else {
      // Er is geen internet, indien er een gebruiker gecachet is door React Query wordt auth op true gezet, anders false
      setIsAuth(!!user);
    }

    setIsLoading(false);
  }

  /* Enkele helper methods voor authenticatie */

  async function register(data: { username: string; email: string; password: string }) {
    await api.post("/auth/register", data);
    checkAuth();
  }

  async function login(data: { email: string; password: string }) {
    await api.post("/auth/login", data);

    checkAuth();
    enqueueSnackbar("Succesvol ingelogd");
  }

  async function logout() {
    await api("auth/logout");

    checkAuth();
    // Invalidate queries zodat geen offline todos bij een andere gebruiker terecht zouden komen
    queryClient.clear();
    enqueueSnackbar("Succesvol uitgelogd.");
  }

  async function googleLogin(credentialResponse: CredentialResponse) {
    if (!("credential" in credentialResponse)) return;

    await api.post("/auth/google", {
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
