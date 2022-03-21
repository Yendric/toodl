import { useSnackbar } from "notistack";
import { createContext, useContext, useState, useEffect, FC } from "react";
import io, { Socket } from "socket.io-client";
import { useAppState } from "./AppState";
import { useAuth } from "./AuthState";

type SocketState = {
  socket: Socket | undefined;
  call: (uri: string, args?: any) => Promise<any>;
};

export const SocketContext = createContext<SocketState | undefined>(undefined);

export const SocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const { setIsLoading, apiUrl } = useAppState();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user.auth && !socket) {
      setSocket(
        io(apiUrl.slice(0, -3), {
          withCredentials: true,
        })
      );
    }

    return () => {
      if (!socket) return;
      socket.disconnect();
      setIsLoading(false);
    };
  }, [user, socket]);

  function call(uri: string, args?: any) {
    return new Promise((resolve, reject) => {
      if (!socket) return;
      socket.emit(uri, args, (res: any) => {
        if (!res) {
          enqueueSnackbar("Er is iets foutgelopen", { variant: "warning" });
          return reject(res.error);
        }
        return resolve(res);
      });
    });
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        call,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket(): SocketState {
  const context = useContext(SocketContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
