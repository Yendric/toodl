import { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { useAppState } from "./AppState";
import { useSocket } from "./SocketState";
import IList from "../types/IList";
import { useSnackbar } from "notistack";
import useAxios from "../hooks/useAxios";

type ListState = {
  lists: IList[];
  create: (list: Omit<IList, "id">, notification?: boolean) => Promise<IList>;
  update: (list: IList, notification?: boolean) => Promise<IList>;
  destroy: (list: IList, notification?: boolean) => Promise<boolean>;
};

export const ListContext = createContext<ListState | undefined>(undefined);

export const ListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<IList[]>([]);
  const { socket } = useSocket();
  const { removeLoading, addLoading } = useAppState();
  const { enqueueSnackbar } = useSnackbar();
  const axios = useAxios();

  useEffect(() => {
    addLoading("lists");

    axios("/lists").then(({ data }) => {
      setLists(data);
      removeLoading("lists");
    });

    if (!socket) return;
    // Event listener voor list changes op andere toestellen
    socket.on("lists", (lists: IList[]) => {
      setLists(lists);
    });
  }, [socket]);

  /*
  / C(R)UD 
  */
  async function create(list: Omit<IList, "id">, notification = true) {
    const res = await axios.post<IList>("/lists", list);
    notification && enqueueSnackbar("Lijst aangemaakt");

    return res.data;
  }

  async function update(list: IList, notification = true) {
    const res = await axios.post<IList>(`lists/${list.id}`, list);
    notification && enqueueSnackbar("Lijst geüpdatet");

    return res.data;
  }

  async function destroy(list: IList, notification = true) {
    await axios.delete(`lists/${list.id}`);
    notification && enqueueSnackbar("Lijst verwijderd");

    return true;
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
