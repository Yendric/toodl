import { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "./AuthState";

type SocketState = {
  socket: Socket | undefined;
};

export const SocketContext = createContext<SocketState | undefined>(undefined);

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const { user } = useAuth();

  useEffect(() => {
    if (user.auth && !socket) {
      setSocket(
        io(import.meta.env.VITE_API_URL ?? "", {
          withCredentials: true,
        })
      );
    }

    if (!user.auth && socket?.connected) {
      socket.disconnect();
      setSocket(undefined);
    }

    return () => {
      if (!socket) return;
      socket.disconnect();
      setSocket(undefined);
    };
  }, [user, socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
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
