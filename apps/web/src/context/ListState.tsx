import { createContext, useContext, useState, useEffect, FC } from "react";
import { useAppState } from "./AppState";
import { useSocket } from "./SocketState";
import IList from "../types/IList";
import { useSnackbar } from "notistack";

type ListState = {
  lists: IList[];
  create: (todo: Omit<IList, "id">, notification?: boolean) => void;
  destroy: (todo: IList, notification?: boolean) => void;
  update: (todo: IList, notification?: boolean) => void;
};

export const ListContext = createContext<ListState | undefined>(undefined);

export const ListProvider: FC = ({ children }) => {
  const [lists, setLists] = useState<IList[]>([]);
  const { socket, call } = useSocket();
  const { setIsLoading } = useAppState();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!socket) return;

    setIsLoading(true);
    socket.emit("lists", (lists: IList[]) => {
      setLists(lists);
      setIsLoading(false);
    });

    // Event listener voor list changes op andere toestellen
    socket.on("lists", (lists: IList[]) => {
      setLists(lists);
    });
  }, [socket]);

  /*
  / C(R)UD 
  */
  async function create(list: Omit<IList, "id">, notification = true) {
    await call("lists/create", list);
    notification && enqueueSnackbar("Lijst aangemaakt");
  }

  async function update(list: IList, notification = true) {
    await call("lists/update", list);
    notification && enqueueSnackbar("Lijst geüpdatet");
  }

  async function destroy(list: IList, notification = true) {
    await call("lists/destroy", list);
    notification && enqueueSnackbar("Lijst verwijderd");
  }

  return (
    <ListContext.Provider
      value={{
        lists,
        create,
        update,
        destroy,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export function useList(): ListState {
  const context = useContext(ListContext);
  if (context === undefined) throw new Error("Context gebruikt zonder contextprovider.");
  return context;
}
