import { Box, Typography } from "@mui/material";
import { GoogleOAuthProvider, type CredentialResponse } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { createContext, useCallback, useContext, useMemo, type FC, type ReactNode } from "react";
import {
  authGoogle,
  authLogin,
  authLogout,
  authRegister,
  getUserInfoQueryKey,
  useUserInfo,
} from "../api/generated/toodl";

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
  const { enqueueSnackbar } = useSnackbar();
  const { data: user, isSuccess, isLoading } = useUserInfo({ query: { retry: false } });
  const queryClient = useQueryClient();

  const isAuth: boolean = isSuccess && !!user;

  const checkAuth = useCallback(() => {
    void queryClient.invalidateQueries();
  }, [queryClient]);

  const register = useCallback(
    async (data: { username: string; email: string; password: string }) => {
      await authRegister(data);
      checkAuth();
    },
    [checkAuth],
  );

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      await authLogin(data);
      checkAuth();
      enqueueSnackbar("Succesvol ingelogd");
    },
    [checkAuth, enqueueSnackbar],
  );

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } catch (e) {
      console.error("Logout failed on server, clearing local state anyway.", e);
    }
    queryClient.setQueryData(getUserInfoQueryKey(), null);
    queryClient.removeQueries();
    enqueueSnackbar("Succesvol uitgelogd.");
  }, [queryClient, enqueueSnackbar]);

  const googleLogin = useCallback(
    async (credentialResponse: CredentialResponse) => {
      if (!("credential" in credentialResponse) || !credentialResponse.credential) return;

      await authGoogle({
        token: credentialResponse.credential,
      });
      checkAuth();
    },
    [checkAuth],
  );

  const value: AuthState = useMemo(
    () => ({ isAuth, isLoading, logout, googleLogin, checkAuth, register, login }),
    [isAuth, isLoading, logout, googleLogin, checkAuth, register, login],
  );

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">Geen GOOGLE_CLIENT_ID ingesteld in .env</Typography>
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>{children}</GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
